'use client';

import { motion } from 'framer-motion';

const benefits = [
  {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'Go from Weeks to Hours',
    subtitle: 'Accelerate Your Velocity',
    description:
      'Dramatically reduce your RFP response time, allowing you to bid on more opportunities and increase your pipeline velocity. What once took weeks now takes hours, freeing your team to focus on strategic decisions.',
    stats: [
      { label: 'Time Saved', value: '85%' },
      { label: 'More Bids', value: '3x' },
    ],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Eliminate Human Error',
    subtitle: 'Enhance Your Quality',
    description:
      'Leverage data-driven analysis to produce highly accurate, compliant, and professional proposals every single time. Our AI ensures consistency, completeness, and precision across all your submissions.',
    stats: [
      { label: 'Accuracy Rate', value: '99%' },
      { label: 'Compliance', value: '100%' },
    ],
    gradient: 'from-indigo-500 to-purple-500',
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 sm:py-32 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Transformative Benefits
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience measurable improvements in speed, quality, and win rates
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-linear-to-br from-white to-gray-50 rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className={`w-20 h-20 bg-linear-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}
              >
                {benefit.icon}
              </motion.div>

              <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">{benefit.title}</h3>
              <p className="text-sm font-semibold text-blue-600 mb-4">{benefit.subtitle}</p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{benefit.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {benefit.stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 text-center"
                  >
                    <div className={`text-3xl font-bold bg-linear-to-r ${benefit.gradient} bg-clip-text text-transparent mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
