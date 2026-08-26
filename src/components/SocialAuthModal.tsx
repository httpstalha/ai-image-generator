'use client';

import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, UserPlus, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { createSocialUser, saveStoredUser } from '@/lib/storage';
import { useRouter } from 'next/navigation';

interface SocialAuthModalProps {
  isOpen: boolean;
  provider: 'google' | 'yahoo' | 'icloud' | null;
  onClose: () => void;
}

export default function SocialAuthModal({ isOpen, provider, onClose }: SocialAuthModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<'select' | 'authenticating' | 'custom'>('select');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen || !provider) return null;

  const providerDetails = {
    google: {
      name: 'Google',
      bgColor: 'bg-[#FFFFFF]',
      borderColor: 'border-[#4285F4]',
      headerBg: 'bg-blue-50',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      ),
      accounts: [
        {
          name: 'Talha',
          email: 'talha.google@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          badge: 'Active Google Account',
        },
        {
          name: 'Talha (Cerulia Studio)',
          email: 'talha.studio@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          badge: 'Verified Google Profile',
        },
      ],
    },
    yahoo: {
      name: 'Yahoo',
      bgColor: 'bg-[#F6F0FF]',
      borderColor: 'border-[#6001D2]',
      headerBg: 'bg-purple-50',
      icon: (
        <svg className="w-6 h-6 fill-[#6001D2]" viewBox="0 0 24 24">
          <path d="M12.986 1.808h3.916l-5.69 9.946v10.438H7.788V11.754L2.098 1.808h4.096l3.608 6.64 3.184-6.64zm6.666 0h3.45l-3.45 5.86v-5.86zm.18 7.08a1.65 1.65 0 11-3.3 0 1.65 1.65 0 013.3 0z"/>
        </svg>
      ),
      accounts: [
        {
          name: 'Talha',
          email: 'talha.yahoo@yahoo.com',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          badge: 'Active Yahoo Account',
        },
        {
          name: 'Talha (Work Mail)',
          email: 'talha.work@yahoo.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          badge: 'Yahoo Mail Verified',
        },
      ],
    },
    icloud: {
      name: 'iCloud',
      bgColor: 'bg-[#F2F4F7]',
      borderColor: 'border-[#172B4D]',
      headerBg: 'bg-slate-100',
      icon: (
        <svg className="w-6 h-6 fill-[#172B4D]" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.81 1.44-.61.71-1.14 1.85-.99 2.95 1.07.08 2.16-.54 2.81-1.35z"/>
        </svg>
      ),
      accounts: [
        {
          name: 'Talha',
          email: 'talha.apple@icloud.com',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          badge: 'Touch ID / Apple ID Active',
        },
        {
          name: 'Talha (Personal)',
          email: 'talha.personal@me.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          badge: 'Apple Passkey Active',
        },
      ],
    },
  }[provider];

  const handleSelectAccount = (acc: any) => {
    setSelectedUser(acc);
    setStep('authenticating');

    setTimeout(() => {
      const user = createSocialUser(provider, acc.email, acc.name);
      user.avatar = acc.avatar;
      saveStoredUser(user);
      localStorage.setItem('cerulia_is_logged_in', 'true');
      router.push('/dashboard');
      onClose();
    }, 700);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    const acc = {
      name: customName || customEmail.split('@')[0],
      email: customEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    handleSelectAccount(acc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-[#E2F1FA] space-y-0 relative">
        
        {/* Header */}
        <div className={`p-6 ${providerDetails.headerBg} border-b border-[#E2F1FA] flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFFFFF] shadow-xs flex items-center justify-center border border-[#E2F1FA]">
              {providerDetails.icon}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#172B4D]">
                Sign in with {providerDetails.name}
              </h3>
              <p className="text-xs text-[#5E7292]">Choose an account to continue to Cerulia AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5E7292] hover:text-[#172B4D] hover:bg-[#FFFFFF] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {step === 'select' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5E7292] mb-1">
                <span>Detected Accounts</span>
                <span className="flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified SSO</span>
                </span>
              </div>

              {providerDetails.accounts.map((acc, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAccount(acc)}
                  className="w-full flex items-center justify-between p-3.5 bg-[#F7FBFE] hover:bg-[#FFFFFF] border border-[#E2F1FA] hover:border-[#6BB6D9] rounded-2xl shadow-2xs hover:shadow-md transition-all group active:scale-[0.98] text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#E2F1FA] shadow-xs"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#172B4D] group-hover:text-[#6BB6D9] transition-colors">
                        {acc.name}
                      </h4>
                      <p className="text-[11px] text-[#5E7292] font-medium">{acc.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-[#DFF3FC] text-[#3B92BD] font-semibold px-2 py-0.5 rounded-full block mb-1">
                      {acc.badge}
                    </span>
                    <span className="text-[11px] font-bold text-[#6BB6D9] group-hover:underline flex items-center justify-end space-x-1">
                      <span>Log In</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              ))}

              {/* Add Custom / New Account */}
              <button
                onClick={() => setStep('custom')}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#FFFFFF] hover:bg-[#F7FBFE] border border-dashed border-[#A7D8F0] rounded-2xl text-xs font-bold text-[#3B92BD] transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Use another {providerDetails.name} account</span>
              </button>

              <div className="pt-2 text-center text-[10px] text-[#5E7292]">
                To continue, Cerulia AI will share your name, email address, and language preference with {providerDetails.name}.
              </div>
            </div>
          )}

          {step === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                  Enter {providerDetails.name} Email
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7FBFE] border border-[#E2F1FA] rounded-xl text-[#172B4D] focus:outline-none focus:border-[#6BB6D9]"
                  placeholder={`your.name@${provider === 'google' ? 'gmail.com' : provider === 'yahoo' ? 'yahoo.com' : 'icloud.com'}`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7FBFE] border border-[#E2F1FA] rounded-xl text-[#172B4D] focus:outline-none focus:border-[#6BB6D9]"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="px-4 py-2 text-xs font-semibold text-[#5E7292] hover:bg-[#DFF3FC] rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!customEmail.trim()}
                  className="px-5 py-2.5 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  Continue to Sign In
                </button>
              </div>
            </form>
          )}

          {step === 'authenticating' && (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <img
                  src={selectedUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedUser?.name || 'User'}
                  className="w-full h-full rounded-full object-cover border-2 border-[#6BB6D9] shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-[#172B4D]">
                  Welcome back, {selectedUser?.name}!
                </h4>
                <p className="text-xs text-[#5E7292] font-medium">{selectedUser?.email}</p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-xs text-[#3B92BD] font-bold pt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating session & redirecting...</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
