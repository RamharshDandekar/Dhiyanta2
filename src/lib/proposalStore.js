/**
 * Simple in-memory store for proposal data
 * In production, this should be replaced with a database
 */

// Use globalThis to ensure the Map persists across all contexts and hot reloads
if (typeof globalThis.__proposalStore === 'undefined') {
  globalThis.__proposalStore = new Map();
  console.log('🆕 [proposalStore] Initialized new global proposal store');
} else {
  console.log('♻️ [proposalStore] Reusing existing proposal store, size:', globalThis.__proposalStore.size);
}

const proposalStore = globalThis.__proposalStore;

// Auto-cleanup old proposals after 1 hour
const EXPIRY_TIME = 60 * 60 * 1000; // 1 hour

export function storeProposal(id, data) {
  console.log('💾 [proposalStore] Storing proposal with id:', id);
  proposalStore.set(id, {
    data,
    timestamp: Date.now()
  });
  console.log('💾 [proposalStore] Proposal stored. Total proposals:', proposalStore.size);
  console.log('💾 [proposalStore] Available keys:', Array.from(proposalStore.keys()));
  
  // Clean up old entries
  cleanupOldProposals();
}

export function getProposal(id) {
  console.log('🔍 [proposalStore] Looking for proposal with id:', id);
  console.log('🔍 [proposalStore] Current store size:', proposalStore.size);
  console.log('🔍 [proposalStore] Available keys:', Array.from(proposalStore.keys()));
  
  const entry = proposalStore.get(id);
  
  if (!entry) {
    console.error('❌ [proposalStore] Proposal NOT FOUND');
    return null;
  }
  
  console.log('✅ [proposalStore] Proposal found, timestamp:', new Date(entry.timestamp).toISOString());
  
  // Check if expired
  if (Date.now() - entry.timestamp > EXPIRY_TIME) {
    console.warn('⏰ [proposalStore] Proposal EXPIRED, deleting...');
    proposalStore.delete(id);
    return null;
  }
  
  console.log('✅ [proposalStore] Returning proposal data');
  return entry.data;
}

export function deleteProposal(id) {
  proposalStore.delete(id);
}

function cleanupOldProposals() {
  const now = Date.now();
  let deletedCount = 0;
  
  console.log('🧹 [proposalStore] Starting cleanup...');
  
  for (const [id, entry] of proposalStore.entries()) {
    if (now - entry.timestamp > EXPIRY_TIME) {
      proposalStore.delete(id);
      deletedCount++;
      console.log('🗑️ [proposalStore] Deleted expired entry:', id);
    }
  }
  
  console.log('🧹 [proposalStore] Cleanup complete. Deleted:', deletedCount, 'Remaining:', proposalStore.size);
}
