'use server';

import { documentGenerationAgent } from '@/lib/agents';
import { COMPANY_INFO } from '@/lib/companyInfo';
import { storeDocument, getDocument } from '@/lib/documentStore';

export async function generateFinalDocument(rfpId, proposalData) {
  try {
    console.log('🚀 [generateFinalDocument] Starting document generation for RFP:', rfpId);
    console.log('📋 [generateFinalDocument] Proposal data keys:', Object.keys(proposalData));
    
    // Generate the document HTML using the AI agent
    console.log('🤖 [generateFinalDocument] Calling documentGenerationAgent...');
    const documentHtml = await documentGenerationAgent(proposalData, COMPANY_INFO);
    console.log('✅ [generateFinalDocument] Document HTML generated, length:', documentHtml?.length || 0);
    
    // Generate a unique cache ID
    const cacheId = `doc_${rfpId}_${Date.now()}`;
    console.log('🔑 [generateFinalDocument] Generated cache ID:', cacheId);
    
    // Store in global document store
    storeDocument(cacheId, documentHtml, rfpId);
    
    console.log('✨ [generateFinalDocument] Document generation complete. Returning cacheId:', cacheId);
    return { success: true, cacheId };
  } catch (error) {
    console.error('❌ [generateFinalDocument] Error generating document:', error);
    console.error('❌ [generateFinalDocument] Error stack:', error.stack);
    return { success: false, error: error.message };
  }
}

export async function getDocumentFromCache(cacheId) {
  console.log('🔍 [getDocumentFromCache] Looking for document with cacheId:', cacheId);
  
  const cached = getDocument(cacheId);
  
  if (!cached) {
    console.error('❌ [getDocumentFromCache] Document NOT FOUND in global store!');
    console.error('❌ [getDocumentFromCache] Requested:', cacheId);
    throw new Error('Document not found or expired. Please generate again.');
  }
  
  console.log('✅ [getDocumentFromCache] Document found in global store');
  console.log('📅 [getDocumentFromCache] Document created at:', new Date(cached.createdAt).toISOString());
  console.log('✨ [getDocumentFromCache] Returning document HTML, length:', cached.html?.length || 0);
  
  return cached.html;
}
