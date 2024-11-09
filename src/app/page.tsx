'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe2, Brain, BookOpen } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      {/* Simple Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
              Lumina
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center space-y-8 max-w-3xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900">
              Understand Better,{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
                Learn Faster
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform complex texts into clear, concise summaries in your preferred language.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                href="/signup"
                className="inline-block px-8 py-4 text-lg font-medium text-white rounded-full
                  bg-gradient-to-r from-violet-600 to-indigo-600 
                  hover:from-violet-700 hover:to-indigo-700
                  transition-all duration-200 ease-out
                  shadow-[0_0_20px_rgba(124,58,237,0.3)]
                  hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]
                  transform hover:-translate-y-0.5"
              >
                Start Summarizing
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
              {[
                {
                  icon: <Globe2 className="w-6 h-6" />,
                  title: 'Multilingual Support',
                  description: 'Understand content in multiple languages'
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: 'AI-Powered',
                  description: 'Advanced algorithms for accurate summaries'
                },
                {
                  icon: <BookOpen className="w-6 h-6" />,
                  title: 'Student Friendly',
                  description: 'Perfect for academic readings and research'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="absolute bottom-0 w-full py-6">
        <div className="text-center text-gray-500 text-sm">
          © 2024 Lumina
        </div>
      </footer>
    </div>
  );
}