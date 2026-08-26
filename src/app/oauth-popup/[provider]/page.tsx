'use client';

import React, { useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSocialUser, saveStoredUser, isEmailRegistered, registerUserEmail } from '@/lib/storage';
import { Sparkles, ShieldCheck, Mail, CheckCircle, ArrowRight, User, AlertCircle, UserPlus, LogIn } from 'lucide-react';

interface PageProps {
  params: Promise<{ provider: string }>;
}

export default function OAuthPopupPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  
  const provider = (resolvedParams.provider || 'google').toLowerCase();
  const mode = (searchParams.get('mode') || 'login').toLowerCase() as 'login' | 'signup';
  const isLogin = mode === 'login';

  const isGoogle = provider === 'google';
  const isYahoo = provider === 'yahoo';
  const isApple = provider === 'apple' || provider === 'icloud';

  const providerDomains: Record<string, string> = {
    google: 'gmail.com',
    yahoo: 'yahoo.com',
    apple: 'icloud.com',
    icloud: 'icloud.com',
  };

  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuthorize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const targetEmail = emailInput.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address (e.g. user@gmail.com).');
      return;
    }

    // Strict Account Existence Check on LOG IN
    if (isLogin) {
      const registered = isEmailRegistered(targetEmail);
      if (!registered) {
        setErrorMessage(`Account Not Found! No Cerulia account exists for "${targetEmail}". Please sign up first.`);
        return;
      }
    }

    setLoading(true);
    const finalName = targetEmail.split('@')[0] || 'Cerulia Member';

    setTimeout(() => {
      const socialProvider = isApple ? 'icloud' : (provider as 'google' | 'yahoo');
      
      // Auto-register email on signup
      if (!isLogin) {
        registerUserEmail(targetEmail);
      }

      const user = createSocialUser(socialProvider, targetEmail, finalName);
      saveStoredUser(user);

      if (typeof window !== 'undefined') {
        localStorage.setItem('cerulia_is_logged_in', 'true');
        if (window.opener) {
          try {
            window.opener.postMessage({ type: 'CERULIA_OAUTH_SUCCESS', user }, window.location.origin);
          } catch (err) {
            console.error('PostMessage error:', err);
          }
        }
        window.close();
      }
    }, 600);
  };

  const handleCancel = () => {
    if (typeof window !== 'undefined') {
      window.close();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between p-6 font-sans text-gray-900 select-none">
      
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-2">
          {isGoogle && (
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          )}
          {isYahoo && (
            <svg className="w-6 h-6 fill-[#6001D2]" viewBox="0 0 24 24">
              <path d="M12.986 1.808h3.916l-5.69 9.946v10.438H7.788V11.754L2.098 1.808h4.096l3.608 6.64 3.184-6.64zm6.666 0h3.45l-3.45 5.86v-5.86zm.18 7.08a1.65 1.65 0 11-3.3 0 1.65 1.65 0 013.3 0z"/>
            </svg>
          )}
          {isApple && (
            <svg className="w-6 h-6 fill-[#172B4D]" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.81 1.44-.61.71-1.14 1.85-.99 2.95 1.07.08 2.16-.54 2.81-1.35z"/>
            </svg>
          )}
          <span className="text-sm font-bold text-gray-800">
            {isGoogle ? 'Google OAuth' : isYahoo ? 'Yahoo OAuth' : 'Apple ID OAuth'}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-[#DFF3FC] px-2.5 py-1 rounded-full text-xs font-bold text-[#172B4D]">
          <Sparkles className="w-3.5 h-3.5 text-[#3B92BD]" />
          <span>Cerulia AI</span>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="my-auto space-y-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
              isLogin ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isLogin ? 'Log In Authorization' : 'New Account Sign Up'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mt-2">
            {isLogin ? 'Sign in with your provider' : 'Create Cerulia Account'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter your provider email to authenticate with <strong className="text-[#172B4D]">Cerulia AI</strong>
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-red-700">{errorMessage}</p>
              {isLogin && (
                <p className="text-[11px] text-red-600">
                  Tip: Switch to the <strong className="underline">Sign Up</strong> page first to create your account.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleAuthorize} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span>Your {isGoogle ? 'Google' : isYahoo ? 'Yahoo' : 'Apple'} Email Address:</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setErrorMessage('');
                }}
                placeholder={`yourname@${providerDomains[provider] || 'gmail.com'}`}
                className="w-full px-4 py-3 text-xs border border-gray-300 rounded-2xl focus:outline-none focus:border-[#4285F4] bg-white text-gray-900 shadow-xs font-medium"
                autoFocus
              />
            </div>
          </div>

          {/* Preset Quick Fill Badges */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-gray-500">Quick Test Account:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmailInput(`talhamazhar@${providerDomains[provider] || 'gmail.com'}`);
                  setErrorMessage('');
                }}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-700 transition-all cursor-pointer"
              >
                talhamazhar@{providerDomains[provider] || 'gmail.com'}
              </button>
            </div>
          </div>

          {/* Requested Scopes Banner */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-gray-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Requested Permissions:</span>
            </div>
            <ul className="pl-6 list-disc space-y-0.5 text-gray-600 text-[11px]">
              <li>Read profile name and verified email address</li>
              <li>{isLogin ? 'Validate registered account status' : 'Register new Cerulia member profile'}</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4 flex items-center justify-between space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 border border-gray-300 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 ${
                isLogin ? 'bg-[#4285F4] hover:bg-[#3367D6]' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span>{loading ? 'Validating...' : isLogin ? 'Authenticate & Log In' : 'Register & Create Account'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>

      <div className="text-center pt-2 text-[11px] text-gray-400">
        Cerulia AI Security & OAuth 2.0 Handshake Layer
      </div>

    </div>
  );
}
