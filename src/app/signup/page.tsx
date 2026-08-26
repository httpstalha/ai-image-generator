'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { openOAuthPopupWindow } from '@/lib/oauth';
import { validatePasswordStrength } from '@/lib/password-validator';
import { saveStoredUser } from '@/lib/storage';
import { Sparkles, User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordVal = validatePasswordStrength(password);

  // Sync NextAuth session
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const provider = (session.user as any).provider || 'google';
      const userObj = {
        id: (session.user as any).id || `usr_${Date.now()}`,
        name: session.user.name || name || 'Cerulia Member',
        email: session.user.email || email || 'user@cerulia.com',
        avatar: session.user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString().split('T')[0],
        apiKey: `cr_live_${Math.random().toString(36).substring(2, 11)}`,
        provider: provider as any,
      };
      saveStoredUser(userObj);
      localStorage.setItem('cerulia_is_logged_in', 'true');
      router.push('/dashboard');
    }
  }, [session, status, router, name, email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!passwordVal.isValid) {
      setErrorMessage('Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      saveStoredUser({
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        provider: 'email',
      });
      localStorage.setItem('cerulia_is_logged_in', 'true');
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FBFE]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-[#FFFFFF] rounded-3xl p-8 border border-[#E2F1FA] pastel-shadow space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#DFF3FC] flex items-center justify-center text-[#172B4D] mx-auto shadow-xs">
              <Sparkles className="w-6 h-6 text-[#3B92BD]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#172B4D]">Create Account</h1>
            <p className="text-xs text-[#5E7292]">Join Cerulia AI Image Generator</p>
          </div>

          {/* Authentic OAuth Browser Popup Triggers (Google, Yahoo, iCloud) */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2.5">
              {/* Google */}
              <button
                type="button"
                onClick={() => openOAuthPopupWindow('google', 'signup')}
                disabled={loading}
                className="group flex items-center justify-center space-x-2 py-2.5 px-3 bg-[#F7FBFE] hover:bg-[#FFFFFF] border border-[#E2F1FA] hover:border-[#4285F4] hover:shadow-md rounded-2xl transition-all active:scale-[0.97] disabled:opacity-50 cursor-pointer"
                title="Sign up with Google (Launches authentic OAuth window)"
              >
                <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="text-xs font-bold text-[#172B4D]">Google</span>
              </button>

              {/* Yahoo */}
              <button
                type="button"
                onClick={() => openOAuthPopupWindow('yahoo', 'signup')}
                disabled={loading}
                className="group flex items-center justify-center space-x-2 py-2.5 px-3 bg-[#F7FBFE] hover:bg-[#FFFFFF] border border-[#E2F1FA] hover:border-[#6001D2] hover:shadow-md rounded-2xl transition-all active:scale-[0.97] disabled:opacity-50 cursor-pointer"
                title="Sign up with Yahoo (Launches authentic OAuth window)"
              >
                <svg className="w-4 h-4 shrink-0 fill-[#6001D2] transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M12.986 1.808h3.916l-5.69 9.946v10.438H7.788V11.754L2.098 1.808h4.096l3.608 6.64 3.184-6.64zm6.666 0h3.45l-3.45 5.86v-5.86zm.18 7.08a1.65 1.65 0 11-3.3 0 1.65 1.65 0 013.3 0z"/>
                </svg>
                <span className="text-xs font-bold text-[#172B4D]">Yahoo</span>
              </button>

              {/* iCloud / Apple */}
              <button
                type="button"
                onClick={() => openOAuthPopupWindow('icloud', 'signup')}
                disabled={loading}
                className="group flex items-center justify-center space-x-2 py-2.5 px-3 bg-[#F7FBFE] hover:bg-[#FFFFFF] border border-[#E2F1FA] hover:border-[#172B4D] hover:shadow-md rounded-2xl transition-all active:scale-[0.97] disabled:opacity-50 cursor-pointer"
                title="Sign up with iCloud / Apple ID (Launches authentic OAuth window)"
              >
                <svg className="w-4 h-4 shrink-0 fill-[#172B4D] transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.81 1.44-.61.71-1.14 1.85-.99 2.95 1.07.08 2.16-.54 2.81-1.35z"/>
                </svg>
                <span className="text-xs font-bold text-[#172B4D]">iCloud</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center pt-2">
              <div className="w-full border-t border-[#E2F1FA]" />
              <span className="absolute bg-[#FFFFFF] px-3 text-[11px] font-semibold text-[#5E7292] uppercase tracking-wider">
                Or with Email
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6BB6D9] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7FBFE] border border-[#E2F1FA] rounded-xl text-[#172B4D] focus:outline-none focus:border-[#6BB6D9] focus:bg-[#FFFFFF] transition-all"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6BB6D9] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7FBFE] border border-[#E2F1FA] rounded-xl text-[#172B4D] focus:outline-none focus:border-[#6BB6D9] focus:bg-[#FFFFFF] transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6BB6D9] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F7FBFE] border border-[#E2F1FA] rounded-xl text-[#172B4D] focus:outline-none focus:border-[#6BB6D9] focus:bg-[#FFFFFF] transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#6BB6D9] hover:text-[#172B4D] transition-colors focus:outline-none p-0.5"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator Component */}
              <PasswordStrengthIndicator password={password} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E2F1FA]">
            <p className="text-xs text-[#5E7292]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#6BB6D9] font-bold hover:underline">
                Log In
              </Link>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
