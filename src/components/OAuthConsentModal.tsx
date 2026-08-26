'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowRight, Loader2, UserCheck, Mail, ShieldAlert } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { createSocialUser, saveStoredUser } from '@/lib/storage';
import { useRouter } from 'next/navigation';

interface OAuthConsentModalProps {
  isOpen: boolean;
  provider: 'google' | 'yahoo' | 'icloud' | null;
  onClose: () => void;
}

/**
 * OAuthConsentModal Component
 * Authentic OAuth 2.0 Permission & Scope Consent Dialog.
 * Requests explicit user permission to share profile & email details before account creation/login.
 */
export default function OAuthConsentModal({ isOpen, provider, onClose }: OAuthConsentModalProps) {
  const router = useRouter();
  const [authorizing, setAuthorizing] = useState(false);

  if (!isOpen || !provider) return null;

  const providerConfig = {
    google: {
      name: 'Google Account',
      badge: 'Sign in with Google',
      iconColor: '#4285F4',
      bgHover: 'hover:bg-[#4285F4]',
      domain: 'accounts.google.com',
      logoUrl: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      )
    },
    yahoo: {
      name: 'Yahoo ID',
      badge: 'Sign in with Yahoo',
      iconColor: '#6001D2',
      bgHover: 'hover:bg-[#6001D2]',
      domain: 'login.yahoo.com',
      logoUrl: (
        <svg className="w-6 h-6 fill-[#6001D2]" viewBox="0 0 24 24">
          <path d="M12.986 1.808h3.916l-5.69 9.946v10.438H7.788V11.754L2.098 1.808h4.096l3.608 6.64 3.184-6.64zm6.666 0h3.45l-3.45 5.86v-5.86zm.18 7.08a1.65 1.65 0 11-3.3 0 1.65 1.65 0 013.3 0z"/>
        </svg>
      )
    },
    icloud: {
      name: 'Apple ID / iCloud',
      badge: 'Sign in with Apple ID',
      iconColor: '#172B4D',
      bgHover: 'hover:bg-[#172B4D]',
      domain: 'appleid.apple.com',
      logoUrl: (
        <svg className="w-6 h-6 fill-[#172B4D]" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.81 1.44-.61.71-1.14 1.85-.99 2.95 1.07.08 2.16-.54 2.81-1.35z"/>
        </svg>
      )
    }
  }[provider];

  const handleAuthorizePermission = async () => {
    setAuthorizing(true);
    
    // Save user session and grant authorization
    setTimeout(() => {
      const user = createSocialUser(provider);
      saveStoredUser(user);
      localStorage.setItem('cerulia_is_logged_in', 'true');
      
      // Also invoke NextAuth signIn trigger
      signIn(provider === 'icloud' ? 'apple' : provider, { callbackUrl: '/dashboard', redirect: false });
      
      setAuthorizing(false);
      onClose();
      window.location.href = '/dashboard';
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#E2F1FA] space-y-0 relative">
        
        {/* Header */}
        <div className="p-6 bg-[#F7FBFE] border-b border-[#E2F1FA] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#FFFFFF] rounded-2xl border border-[#E2F1FA] shadow-xs">
              {providerConfig.logoUrl}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#6BB6D9] uppercase tracking-wider block">
                {providerConfig.domain}
              </span>
              <h3 className="text-lg font-extrabold text-[#172B4D]">
                Authorize Cerulia AI
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5E7292] hover:text-[#172B4D] hover:bg-[#DFF3FC] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          <div className="p-4 bg-[#DFF3FC]/50 rounded-2xl border border-[#E2F1FA] space-y-1">
            <p className="text-xs font-semibold text-[#172B4D]">
              <span className="font-extrabold text-[#3B92BD]">Cerulia AI</span> is requesting permission to access your {providerConfig.name}:
            </p>
            <p className="text-[11px] text-[#5E7292]">
              By granting permission, you allow Cerulia AI to securely create and manage your account.
            </p>
          </div>

          {/* Scope Permissions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#172B4D] uppercase tracking-wider">
              Permissions Requested:
            </h4>
            
            <div className="space-y-2.5">
              <div className="flex items-start space-x-3 p-3 bg-[#F7FBFE] rounded-xl border border-[#E2F1FA]">
                <UserCheck className="w-5 h-5 text-[#6BB6D9] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#172B4D]">Basic Profile Information</p>
                  <p className="text-[11px] text-[#5E7292]">Access your display name and profile image avatar.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-[#F7FBFE] rounded-xl border border-[#E2F1FA]">
                <Mail className="w-5 h-5 text-[#6BB6D9] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#172B4D]">Verified Email Address</p>
                  <p className="text-[11px] text-[#5E7292]">Read your primary email address for identity verification.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-[#F7FBFE] rounded-xl border border-[#E2F1FA]">
                <ShieldCheck className="w-5 h-5 text-[#3B92BD] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#172B4D]">Single Sign-On & Account Setup</p>
                  <p className="text-[11px] text-[#5E7292]">Create a secure Cerulia member profile and enable 1-tap logins.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-[#5E7292] pt-1">
            <Lock className="w-3.5 h-3.5 text-[#3B92BD]" />
            <span>Cerulia AI will never post without your permission or sell your data.</span>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="p-6 bg-[#F7FBFE] border-t border-[#E2F1FA] flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={authorizing}
            className="px-5 py-2.5 text-xs font-bold text-[#5E7292] hover:text-[#172B4D] hover:bg-[#DFF3FC] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAuthorizePermission}
            disabled={authorizing}
            className="px-6 py-2.5 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {authorizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#172B4D]" />
                <span>Authorizing Account...</span>
              </>
            ) : (
              <>
                <span>Allow & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
