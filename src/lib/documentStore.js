/**
 * Shared in-memory store for generated documents
 * This store is shared across all server contexts in the same Node.js process
 * In production, this should be replaced with Redis or a database
 */

// Use globalThis to ensure the Map persists across all contexts and hot reloads
if (typeof globalThis.__documentStore === 'undefined') {
  globalThis.__documentStore = new Map();
  console.log('🆕 [documentStore] Initialized new global document store');
} else {
  console.log('♻️ [documentStore] Reusing existing document store, size:', globalThis.__documentStore.size);
}

const documentStore = globalThis.__documentStore;

// Auto-cleanup old documents after 1 hour
const EXPIRY_TIME = 60 * 60 * 1000; // 1 hour

export function storeDocument(cacheId, html, rfpId) {
  console.log('💾 [documentStore] Storing document with cacheId:', cacheId);
  documentStore.set(cacheId, {
    html,
    rfpId,
    createdAt: Date.now()
  });
  console.log('💾 [documentStore] Document stored. Total documents:', documentStore.size);
  console.log('💾 [documentStore] Available keys:', Array.from(documentStore.keys()));
  
  // Clean up old entries
  cleanupOldDocuments();
}

export function getDocument(cacheId) {
  console.log('🔍 [documentStore] Looking for document with cacheId:', cacheId);
  console.log('🔍 [documentStore] Current store size:', documentStore.size);
  console.log('🔍 [documentStore] Available keys:', Array.from(documentStore.keys()));
  
  const cached = documentStore.get(cacheId);
  
  if (!cached) {
    console.error('❌ [documentStore] Document NOT FOUND');
    return null;
  }
  
  console.log('✅ [documentStore] Document found, created at:', new Date(cached.createdAt).toISOString());
  
  // Check if expired (1 hour)
  const isExpired = Date.now() - cached.createdAt > EXPIRY_TIME;
  if (isExpired) {
    console.warn('⏰ [documentStore] Document EXPIRED, deleting...');
    documentStore.delete(cacheId);
    return null;
  }
  
  console.log('✅ [documentStore] Returning document, length:', cached.html?.length || 0);
  return cached;
}

export function deleteDocument(cacheId) {
  console.log('🗑️ [documentStore] Deleting document:', cacheId);
  documentStore.delete(cacheId);
}

function cleanupOldDocuments() {
  const now = Date.now();
  let deletedCount = 0;
  
  console.log('🧹 [documentStore] Starting cleanup...');
  
  for (const [key, value] of documentStore.entries()) {
    if (now - value.createdAt > EXPIRY_TIME) {
      documentStore.delete(key);
      deletedCount++;
      console.log('🗑️ [documentStore] Deleted expired entry:', key);
    }
  }
  
  console.log('🧹 [documentStore] Cleanup complete. Deleted:', deletedCount, 'Remaining:', documentStore.size);
}

// Export the store size for debugging
export function getStoreInfo() {
  return {
    size: documentStore.size,
    keys: Array.from(documentStore.keys())
  };
}
