
import { get, set, del, clear, keys, entries } from 'idb-keyval';

const PREFIX = 'mm_img_';

/**
 * Robust key generator that avoids btoa's character set limitations.
 * Uses a simple hash-like string from the prompt to ensure safe IndexedDB keys.
 */
const formatKey = (prompt: string) => {
  // Use a simple string cleaning + hash for the key
  const cleanPrompt = prompt.slice(0, 150).replace(/[^a-zA-Z0-9]/g, '_');
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `${PREFIX}${cleanPrompt}_${Math.abs(hash)}`;
};

/**
 * Wraps an IndexedDB action with robust retry logic to handle 
 * "database connection is closing" or other transient state errors.
 */
async function withRetry<T>(action: () => Promise<T>, maxRetries = 5): Promise<T | undefined> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await action();
    } catch (e: any) {
      const errorMsg = e?.message || String(e);
      const name = e?.name || '';
      
      // Detected transient/state errors
      const isTransient = 
          errorMsg.includes('connection is closing') || 
          errorMsg.includes('database connection is closing') ||
          name === 'InvalidStateError' ||
          name === 'TransactionInactiveError' ||
          name === 'AbortError' ||
          name === 'UnknownError' ||
          name === 'ReadOnlyError';

      if (isTransient && i < maxRetries) {
        const delay = 300 * (i + 1); // Incremental backoff: 300, 600, 900, 1200, 1500ms
        console.warn(`IndexedDB transient error (attempt ${i + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`, errorMsg);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Quota errors are usually not transient but shouldn't crash the app
      if (name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Image could not be cached.');
        return undefined;
      }

      throw e;
    }
  }
  return undefined;
}

export const saveImageToStorage = async (prompt: string, base64Data: string) => {
  const key = formatKey(prompt);
  try {
    await withRetry(() => set(key, base64Data));
    console.debug('Image saved to storage:', key);
  } catch (e) {
    // Graceful degradation: failing to save to cache shouldn't break the app flow
    console.warn('Storage warning: Failed to save image to cache after multiple retries.', e);
  }
};

export const getImageFromStorage = async (prompt: string): Promise<string | undefined> => {
  const key = formatKey(prompt);
  try {
    return await withRetry(() => get(key));
  } catch (e) {
    console.warn('Storage warning: Failed to retrieve image from cache.', e);
    return undefined;
  }
};

export const clearImageCache = async () => {
  try {
    await withRetry(() => clear());
    console.log('Storage cleared');
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
};

export const getStorageUsage = async (): Promise<string> => {
  try {
    // Use entries() to get all data in a single operation
    const allEntries = await withRetry(() => entries()) as [IDBValidKey, any][] | undefined;
    if (!allEntries || allEntries.length === 0) return '0.00 MB';
    
    let totalSize = 0;
    for (const [_, val] of allEntries) {
        if (typeof val === 'string') {
            totalSize += val.length * 2; // Approx bytes for UTF-16 string
        }
    }
    return (totalSize / 1024 / 1024).toFixed(2) + ' MB';
  } catch (e) {
    console.warn('Storage usage calculation failed:', e);
    return 'Unknown';
  }
};
