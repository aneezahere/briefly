'use client';

import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { signUp, signInWithGoogle } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const inter = Inter({ subsets: ['latin'] });

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { error } = await signUp(email, password);
      if (error) throw new Error(error.message);
      router.push('/chat');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/chat');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Spline background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Spline scene="https://prod.spline.design/1dEc0u62qTsMHEzC/scene.splinecode" />
      </div>

      {/* Content overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Link 
          href="/"
          className="text-2xl font-semibold text-white block mb-8"
        >
          Lumina
        </Link>

        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-6">Create your account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-white/30 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all placeholder-gray-500 text-gray-900"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-white/30 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all placeholder-gray-500 text-gray-900"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium
                hover:from-violet-700 hover:to-indigo-700 transition-all duration-200
                shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]
                transform hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-400 text-center">
              {error}
            </p>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 bg-white/90 border border-white/30 rounded-xl font-medium text-gray-700
              hover:bg-white/95 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="mt-6 text-center text-sm text-white/80">
            Already have an account?{' '}
            <Link 
              href="/signin"
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}