'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const steps = [
  {
    number: 1,
    title: 'Upload Your Document',
    description: 'Simply drag and drop any RFP file. Our Sales Agent begins the analysis immediately.',
    mockup: (
      <div className="bg-white rounded-xl p-6 shadow-xl border-2 border-dashed border-blue-300">
        <div className="flex items-center justify-center flex-col space-y-4">
          <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-600 font-medium">Drop your RFP here</p>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    title: 'Review the AI-Generated Draft',
    description:
      'In minutes, receive a complete, strategic proposal summary covering technical, pricing, and executive insights.',
    mockup: (
      <div className="bg-white rounded-xl p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm font-semibold text-gray-700">Analysis Complete</span>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>
        <div className="pt-4 flex space-x-2">
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            95% Match
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            GO Recommendation
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 3,
    title: 'Collaborate and Finalize',
    description: 'Provide feedback to refine the proposal. Approve the final version with confidence.',
    mockup: (
      <div className="bg-white rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            You
          </div>
          <div className="flex-1 bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
            Increase emphasis on our 24/7 support
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex-1 bg-indigo-50 rounded-lg p-3 text-sm text-gray-700">
            Updated proposal with enhanced support section ✓
          </div>
        </div>
      </div>
    ),
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-linear-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to transform your RFP process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onMouseEnter={() => setActiveStep(index)}
                className="relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    className="absolute left-6 top-16 w-0.5 h-20 bg-linear-to-b from-blue-500 to-indigo-500 origin-top"
                  />
                )}

                <div className="flex items-start space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`shrink-0 w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                      activeStep === index ? 'ring-4 ring-blue-200' : ''
                    }`}
                  >
                    {step.number}
                  </motion.div>

                  <div className="flex-1 pt-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Animated Mockup */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block"
          >
            {steps[activeStep].mockup}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
