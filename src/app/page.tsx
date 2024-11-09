'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Spline Background - Using exact URL provided */}
      <div className="absolute inset-0 w-full h-full z-0">
        <iframe 
          src='https://my.spline.design/glassfluidpastelsemplification-8ca24cd1982a4a3a4580a85c0a70cab4/'
          frameBorder='0' 
          width='100%' 
          height='100%'
          title="Background Animation"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full pt-6 pb-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-violet-600">
              Briefly AI
            </h2>
            <p className="text-sm text-gray-600 mt-1">Your Global Companion for Student Life</p>
          </motion.div>
        </header>

        {/* Content */}
        <main className="flex-grow flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-[95vw] h-[75vh] mx-auto 
              bg-white/10 backdrop-blur-md rounded-3xl
              flex items-center justify-center"
          >
            <div className="text-center space-y-2">
              <h1 className="text-6xl sm:text-7xl font-bold tracking-tight">
                <span className="text-violet-600">
                  Empower Your
                </span>
              </h1>
              <h1 className="text-6xl sm:text-7xl font-bold tracking-tight">
                <span className="text-violet-600">
                  Student Journey
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Get help with anything, anywhere, anytime
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-8"
              >
                <Link 
                  href="/signup"
                  className="inline-flex items-center px-12 py-4 text-xl font-medium
                    bg-white/20 backdrop-blur-sm rounded-full
                    text-violet-600 border border-violet-600/30
                    hover:bg-violet-600/10
                    transition-all duration-300 ease-out
                    shadow-[0_0_30px_rgba(124,58,237,0.2)]
                    hover:shadow-[0_0_40px_rgba(124,58,237,0.3)]
                    transform hover:-translate-y-0.5"
                >
                  Start Your Journey
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}