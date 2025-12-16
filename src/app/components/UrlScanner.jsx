'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UrlScanner({ onScan, isLoading }) {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const sampleUrls = [
    { label: 'Govt. Infra Tenders', url: '/mock-rfps/portal1.html' },
    { label: 'Private Sector Projects', url: '/mock-rfps/portal2.html' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }
    
    const formData = new FormData();
    formData.append('url', url);
    await onScan(formData);
  };

  const handleSampleClick = (sampleUrl) => {
    setUrl(sampleUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input Section */}
        <motion.div
          animate={{ scale: isFocused ? 1.01 : 1 }}
          className="relative"
        >
          <div className={`
            relative rounded-2xl border-2 transition-all duration-300
            ${isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-200'}
            bg-white p-8
          `}>
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-center mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scan RFP Portal
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Enter the URL of an RFP portal to analyze tender opportunities
            </p>

            {/* Input Field */}
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter URL of RFP portal..."
                disabled={isLoading}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {url && !isLoading && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Scan Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !url.trim()}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={`
                w-full mt-6 px-8 py-4 rounded-xl font-semibold text-lg
                transition-all duration-300 flex items-center justify-center gap-3
                ${isLoading || !url.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                  <span>Scanning & Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Scan URL & Analyze</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Sample Demo URLs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
        >
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            Sample Demo URLs
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Click a sample URL to auto-populate the field and test the system:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleUrls.map((sample, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleSampleClick(sample.url)}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.03, x: isLoading ? 0 : 5 }}
                whileTap={{ scale: isLoading ? 1 : 0.97 }}
                className={`
                  flex items-center gap-3 p-4 rounded-xl text-left transition-all
                  ${isLoading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:bg-blue-50 text-gray-800 hover:text-blue-600 border-2 border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-md'
                  }
                `}
              >
                <div className={`
                  shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                  ${isLoading ? 'bg-gray-300' : 'bg-linear-to-br from-blue-500 to-purple-600'}
                `}>
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{sample.label}</p>
                  <p className="text-xs text-gray-500 truncate">{sample.url}</p>
                </div>
                <svg
                  className={`w-5 h-5 shrink-0 ${isLoading ? 'text-gray-400' : 'text-blue-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <svg className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-amber-800 font-medium">How it works</p>
            <p className="text-sm text-amber-700 mt-1">
              Our AI will scan the portal, identify active RFPs, extract requirements, and generate a comprehensive technical proposal with pricing analysis.
            </p>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
