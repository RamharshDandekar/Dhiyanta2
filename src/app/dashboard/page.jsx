'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import UrlScanner from '../components/UrlScanner';
import LoadingOverlay from '../components/LoadingOverlay';
import Header from '../components/Header';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUrlScan = async (formData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/rfp/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze RFP');
      }

      const result = await response.json();
      
      // Redirect to RFP detail page with just the ID
      router.push(`/dashboard/rfp/${result.id}`);
      
    } catch (error) {
      console.error('RFP Scan Error:', error);
      alert('Failed to analyze RFP portal. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Analyzing RFP with AI Agents" />}
      <Header />
      
      <div className="space-y-12 pt-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 py-12 relative"
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 blur-3xl -z-10" />
          
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-black bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Strategic RFP Deliberation System
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Enter an RFP portal URL and let our AI agents scan, extract requirements, 
            perform product matching, and generate comprehensive proposals.
          </motion.p>

          {/* Floating Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-3 justify-center items-center"
          >
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>AI-Powered</span>
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>Multi-Agent</span>
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>3x Faster</span>
            </span>
          </motion.div>
        </motion.div>

        {/* URL Scanner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <UrlScanner onScan={handleUrlScan} isLoading={isLoading} />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-3xl font-bold text-gray-900 text-center mb-12"
          >
            How It Works
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 border-t-4 border-blue-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300" />
              <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-lg relative z-10">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Scan Portal</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter the URL of an RFP tender portal to automatically extract opportunities.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 border-t-4 border-green-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300" />
              <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-xl mb-4 shadow-lg relative z-10">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">AI Analysis</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Multiple AI agents work together to extract requirements and match products.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 border-t-4 border-purple-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300" />
              <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl mb-4 shadow-lg relative z-10">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Review Proposal</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get a comprehensive proposal with technical specs and pricing strategy.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 border-t-4 border-orange-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300" />
              <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl mb-4 shadow-lg relative z-10">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Refine & Export</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Provide feedback for AI revision or export the final proposal.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="bg-linear-to-r from-blue-600 via-blue-700 to-purple-800 rounded-2xl shadow-2xl p-10 text-white mt-16 relative overflow-hidden"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-2xl font-bold text-center mb-10 relative z-10"
          >
            Proven Results
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  delay: 1.4 
                }}
                className="text-5xl font-black mb-3"
              >
                90%
              </motion.p>
              <p className="text-blue-100 font-medium">Win rate correlation with timely responses</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  delay: 1.5 
                }}
                className="text-5xl font-black mb-3"
              >
                60%
              </motion.p>
              <p className="text-blue-100 font-medium">Win rate with adequate technical matching time</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  delay: 1.6 
                }}
                className="text-5xl font-black mb-3"
              >
                3x
              </motion.p>
              <p className="text-blue-100 font-medium">Faster RFP response processing</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
