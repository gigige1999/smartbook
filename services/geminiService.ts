import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

const RUSTY_LAKE_STYLE_SUFFIX = ", rusty lake game style, hand-drawn sketch, mysterious, surreal, sepia tones, thick outlines, paper texture background, vintage illustration, minimalist details.";

// --- Cache & Queue System ---

// In-memory cache to prevent re-generating the same images during the session
const globalImageCache = new Map<string, string>();

// Queue for serializing requests to avoid hitting concurrency limits
type Task<T> = () => Promise<T>;
const requestQueue: Array<{
  task: Task<any>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

let isProcessingQueue = false;
const REQUEST_DELAY_MS = 2500; // Delay between processing requests to be safe

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

    // Wait before processing the next item to respect rate limits
    if (requestQueue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
    }
  }

  isProcessingQueue = false;
};

const enqueueRequest = <T>(task: Task<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ task, resolve, reject });
    processQueue();
  });
};

// Retry logic wrapper
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, backoff = 2000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    // Check for 429 or similar rate limit errors
    const isRateLimit = error?.status === 429 || error?.code === 429 || error?.message?.includes('429') || error?.message?.includes('quota');
    
    if (isRateLimit && retries > 0) {
      console.warn(`Rate limit hit. Retrying in ${backoff}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return withRetry(fn, retries - 1, backoff * 2);
    }
    throw error;
  }
};

// --- API Functions ---

export const generateImage = async (prompt: string): Promise<string> => {
  const fullPrompt = `${prompt} ${RUSTY_LAKE_STYLE_SUFFIX}`;
  
  if (globalImageCache.has(fullPrompt)) {
    return globalImageCache.get(fullPrompt)!;
  }

  return enqueueRequest(() => withRetry(async () => {
    try {
      const ai = getAiClient();
      const model = 'gemini-2.5-flash-image';

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [{ text: fullPrompt }]
        }
      });

      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const result = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            globalImageCache.set(fullPrompt, result);
            return result;
          }
        }
      }
      throw new Error("No image generated");
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }));
};

export const editImage = async (base64Image: string, editInstruction: string): Promise<string> => {
  return enqueueRequest(() => withRetry(async () => {
    try {
      const ai = getAiClient();
      const model = 'gemini-2.5-flash-image';

      // Strip the prefix if present to get raw base64
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

      const fullInstruction = `Edit this image: ${editInstruction}. Maintain the Rusty Lake, hand-drawn sketch style. Keep the sepia/vintage atmosphere.`;

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              text: fullInstruction
            },
            {
              inlineData: {
                mimeType: 'image/png', // Assuming PNG or standard format
                data: base64Data
              }
            }
          ]
        }
      });

      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("No edited image returned");
    } catch (error) {
      console.error("Error editing image:", error);
      throw error;
    }
  }));
};
