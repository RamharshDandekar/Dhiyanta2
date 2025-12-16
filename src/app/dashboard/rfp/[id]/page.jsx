'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProposalDisplay from './components/ProposalDisplay';
import FeedbackForm from './components/FeedbackForm';
import ActionButtons from './components/ActionButtons';
import LoadingOverlay from '@/app/components/LoadingOverlay';
import { generateFinalDocument } from './document/_actions';

export default function RFPDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [proposal, setProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Fetch proposal data from API
    const fetchProposal = async () => {
      try {
        const response = await fetch(`/api/rfp/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Proposal not found');
        }
        
        const result = await response.json();
        setProposal(result.proposal);
      } catch (error) {
        console.error('Failed to load proposal:', error);
        alert('Proposal not found or expired. Please analyze the RFP again.');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProposal();
    }
  }, [params.id, router]);

  const handleRevisionSubmit = async (feedback) => {
    if (!proposal) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/rfp/revise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalRFP: proposal.originalRFP,
          previousProposal: proposal,
          userFeedback: feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to revise proposal');
      }

      const result = await response.json();
      setProposal(result.proposal);
      setShowFeedbackForm(false);
      
      // Scroll to top to show revised proposal
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Revision Error:', error);
      alert('Failed to revise proposal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRFP = () => {
    router.push('/dashboard');
  };

  const handleGenerateDocument = async () => {
    if (!proposal) {
      console.error('❌ [handleGenerateDocument] No proposal data available');
      return;
    }
    
    console.log('🚀 [handleGenerateDocument] Starting document generation...');
    console.log('📝 [handleGenerateDocument] RFP ID:', params.id);
    console.log('📊 [handleGenerateDocument] Proposal data:', proposal);
    
    setIsGenerating(true);
    
    try {
      // Generate the document using the actual RFP ID from params
      console.log('🔄 [handleGenerateDocument] Calling generateFinalDocument...');
      const result = await generateFinalDocument(params.id, proposal);
      console.log('📬 [handleGenerateDocument] Result received:', result);
      
      if (result.success) {
        console.log('✅ [handleGenerateDocument] Document generated successfully!');
        console.log('🔑 [handleGenerateDocument] Cache ID:', result.cacheId);
        const redirectUrl = `/dashboard/rfp/${params.id}/document?cacheId=${result.cacheId}`;
        console.log('🔀 [handleGenerateDocument] Redirecting to:', redirectUrl);
        // Redirect to document editor with cacheId using the actual RFP ID
        router.push(redirectUrl);
      } else {
        console.error('❌ [handleGenerateDocument] Document generation failed:', result.error);
        alert(`Failed to generate document: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ [handleGenerateDocument] Document generation error:', error);
      console.error('❌ [handleGenerateDocument] Error stack:', error.stack);
      alert('An unexpected error occurred while generating the document.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposal...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <LoadingOverlay message="Revising Proposal with AI" />}
      {isGenerating && <LoadingOverlay message="Generating Final Document with AI (30-60 seconds)" />}
      
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RFP Proposal Analysis</h1>
              <p className="text-gray-600 mt-1">
                Generated by Dhiyanta AI • {new Date().toLocaleDateString()}
              </p>
            </div>
            <ActionButtons 
              onNewRFP={handleNewRFP} 
              onGenerateDocument={handleGenerateDocument}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        {/* Proposal Display */}
        <ProposalDisplay proposal={proposal} />

        {/* Feedback Section */}
        <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border-2 border-orange-200">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-600 rounded-full p-3 shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Human-in-the-Loop Revision</h3>
              <p className="text-gray-700 mb-4">
                Not satisfied with the proposal? Provide specific feedback and our AI will regenerate 
                the entire analysis incorporating your suggestions.
              </p>
              
              {!showFeedbackForm ? (
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Request Revision</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <FeedbackForm onSubmit={handleRevisionSubmit} isLoading={isLoading} />
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">About This Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="font-semibold mb-1">🤖 AI Agents Used</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sales Agent - RFP Triage & Extraction</li>
                <li>Technical Agent - Product Matching</li>
                <li>Pricing Agent - Strategy Formulation</li>
                <li>Orchestrator Agent - Final Synthesis</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">⚡ Key Features</p>
              <ul className="list-disc list-inside space-y-1">
                <li>90% correlation with timely responses</li>
                <li>Automated technical spec matching</li>
                <li>Intelligent pricing optimization</li>
                <li>Human-in-the-loop revision</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
