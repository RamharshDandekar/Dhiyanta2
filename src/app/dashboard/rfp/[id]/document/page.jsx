import { getDocumentFromCache } from './_actions';
import DocumentEditorClient from './DocumentEditorClient';

export default async function DocumentEditorPage({ params, searchParams }) {
  console.log('📄 [DocumentEditorPage] Starting page render...');
  console.log('📄 [DocumentEditorPage] params:', params);
  console.log('📄 [DocumentEditorPage] searchParams:', searchParams);
  
  const { id: rfpId } = await params;
  const { cacheId } = await searchParams;
  
  console.log('📄 [DocumentEditorPage] rfpId:', rfpId);
  console.log('📄 [DocumentEditorPage] cacheId:', cacheId);

  if (!cacheId) {
    console.error('❌ [DocumentEditorPage] No cacheId provided!');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Missing Document ID</h2>
          <p className="text-gray-600">Please generate the document from the proposal page.</p>
        </div>
      </div>
    );
  }

  let documentHtml;
  try {
    console.log('🔄 [DocumentEditorPage] Fetching document from cache...');
    documentHtml = await getDocumentFromCache(cacheId);
    console.log('✅ [DocumentEditorPage] Document retrieved successfully, length:', documentHtml?.length || 0);
  } catch (error) {
    console.error('❌ [DocumentEditorPage] Error retrieving document:', error);
    console.error('❌ [DocumentEditorPage] Error message:', error.message);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Document Not Found</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <a
            href={`/dashboard/rfp/${rfpId}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back to Proposal
          </a>
        </div>
      </div>
    );
  }

  console.log('✨ [DocumentEditorPage] Rendering DocumentEditorClient...');
  return <DocumentEditorClient initialHtml={documentHtml} rfpId={rfpId} />;
}
