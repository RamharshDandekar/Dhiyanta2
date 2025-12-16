'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    title: 'Automated Discovery',
    subtitle: 'Instant Ingestion & Analysis',
    description:
      'Dhiyanta scans, parses, and understands any RFP document in seconds, extracting key requirements automatically.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'AI-Powered Technical Agent',
    subtitle: 'Intelligent Product Matching',
    description:
      'Our AI engine matches technical specs against your product catalog with near-perfect accuracy, calculating a "Spec Match %" to eliminate guesswork.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
        />
      </svg>
    ),
    title: 'The Deliberation Loop',
    subtitle: 'Human-in-the-Loop Collaboration',
    description:
      'Review, reject, and revise. Provide simple feedback in plain English and watch the AI instantly redraft the proposal to meet your exact strategic needs.',
    gradient: 'from-purple-500 to-pink-500',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Dhiyanta combines cutting-edge AI with intuitive design to revolutionize your RFP workflow
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              whileHover={{
                y: -10,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
              }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className={`w-16 h-16 bg-linear-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:shadow-lg`}
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-2xl font-bold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-sm font-semibold text-blue-600 mb-4">{feature.subtitle}</p>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
