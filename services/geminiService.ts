
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { getImageFromStorage, saveImageToStorage } from './storageService';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const STYLES = {
  RUSTY_LAKE: "art style of Rusty Lake games, surreal, sepia-toned, hand-drawn sketch, vintage, mysterious, thick outlines, paper texture",
  RED_BLACK: "abstract european modernism, flat vector art, lineless, tarot card aesthetic, dominant red and black colors, geometric, bauhaus influence, minimalist, symbolic, high contrast",
  LOTR_VINTAGE: "2D medieval European fantasy illustration, Tolkien book art style, vintage parchment texture, classic film color palette, detailed ink outlines, epic and ancient atmosphere"
};

const getFullPrompt = (prompt: string, stylePreset: keyof typeof STYLES = 'RUSTY_LAKE') => {
  const styleSuffix = STYLES[stylePreset];
  return `A high-quality 2D illustration of ${prompt}. ${styleSuffix}. Masterpiece, evocative composition.`;
}

type Task<T> = () => Promise<T>;
const requestQueue: Array<{
  task: Task<any>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

let isProcessingQueue = false;
const REQUEST_DELAY_MS = 6000; 

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const item = requestQueue.shift();
    if (!item) break;
    try {
      const result = await item.task();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    }
    if (requestQueue.length > 0) await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
  }
  isProcessingQueue = false;
};

const enqueueRequest = <T>(task: Task<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ task, resolve, reject });
    processQueue();
  });
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 5, backoff = 5000): Promise<T> => {
  try { return await fn(); } catch (error: any) {
    let errObj = error;
    try { if (typeof error.message === 'string' && error.message.trim().startsWith('{')) errObj = JSON.parse(error.message); } catch (e) {}
    if (errObj?.error) errObj = errObj.error;
    const status = errObj?.status || errObj?.code || error?.status;
    const message = errObj?.message || error?.message || JSON.stringify(errObj);
    const isRateLimit = String(status) === '429' || String(status) === 'RESOURCE_EXHAUSTED';
    const isTransient = String(status) === '500' || String(status) === '503';
    if ((isRateLimit || isTransient) && retries > 0) {
      const waitTime = isRateLimit ? backoff * 2 : backoff;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return withRetry(fn, retries - 1, waitTime * 1.5);
    }
    throw new Error(`Gemini API Error: ${message}`);
  }
};

export const checkImageCache = async (prompt: string, stylePreset: keyof typeof STYLES = 'RUSTY_LAKE'): Promise<string | undefined> => {
  const fullPrompt = getFullPrompt(prompt, stylePreset);
  return await getImageFromStorage(fullPrompt);
};

export const generateImage = async (prompt: string, stylePreset: keyof typeof STYLES = 'RUSTY_LAKE'): Promise<string> => {
  const fullPrompt = getFullPrompt(prompt, stylePreset);
  const cached = await getImageFromStorage(fullPrompt);
  if (cached) return cached;

  return enqueueRequest(() => withRetry(async () => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: fullPrompt }] },
      config: {
        imageConfig: { aspectRatio: "1:1" },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          const result = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          await saveImageToStorage(fullPrompt, result);
          return result;
        }
      }
    }
    throw new Error("No valid image data found in response");
  }));
};

export const editImage = async (base64Image: string, editInstruction: string, stylePreset: keyof typeof STYLES = 'RUSTY_LAKE'): Promise<string> => {
  return enqueueRequest(() => withRetry(async () => {
    const ai = getAiClient();
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const fullInstruction = `Edit this image: ${editInstruction}. Style: ${STYLES[stylePreset]}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [ { text: fullInstruction }, { inlineData: { mimeType: 'image/png', data: base64Data } } ] },
      config: { 
        imageConfig: { aspectRatio: "1:1" },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) for (const part of parts) if (part.inlineData?.data) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    throw new Error("No valid image data found in response");
  }));
};

export const saveCustomImage = async (prompt: string, base64Data: string, stylePreset: keyof typeof STYLES = 'RUSTY_LAKE') => {
    const fullPrompt = getFullPrompt(prompt, stylePreset);
    await saveImageToStorage(fullPrompt, base64Data);
};
