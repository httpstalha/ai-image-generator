'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { validatePasswordStrength } from '@/lib/password-validator';
import { User, Mail, Lock, Eye, EyeOff, Check, Save, AlertCircle, Loader2 } from 'lucide-react';
import { getStoredUser, saveStoredUser, DEFAULT_USER } from '@/lib/storage';
import { UserProfile } from '@/types';

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER);
  const [name, setName] = useState(DEFAULT_USER.name);
  const [email, setEmail] = useState(DEFAULT_USER.email);
  const [password, setPassword] = useState('TalhaPass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordVal = validatePasswordStrength(password);

  useEffect(() => {
    setIsMounted(true);
    const u = getStoredUser();
    setProfile(u);
    setName(u.name);
    setEmail(u.email);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password && !passwordVal.isValid) {
      setErrorMessage('New password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number.');
      return;
    }

    const updated: UserProfile = {
      ...profile,
      name,
      email
    };
    saveStoredUser(updated);
    setProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#F7FBFE]">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-[#DFF3FC] px-3 py-1 rounded-full text-xs font-semibold text-[#172B4D]">
              <User className="w-3.5 h-3.5 text-[#6BB6D9]" />
              <span>Account Settings</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#172B4D]">Edit Profile</h1>
            <p className="text-xs text-[#5E7292]">Manage your user account details and credentials.</p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isMounted ? (
            <div className="bg-[#FFFFFF] rounded-3xl p-12 border border-[#E2F1FA] pastel-shadow text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#6BB6D9] animate-spin mx-auto" />
              <p className="text-xs text-[#5E7292]">Loading profile data...</p>
            </div>
          ) : (
            /* Profile Card Form */
            <form onSubmit={handleSave} className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2F1FA] pastel-shadow space-y-6">
              
              {/* Avatar Banner */}
              <div className="flex items-center space-x-4 bg-[#F7FBFE] p-4 rounded-2xl border border-[#E2F1FA]">
                <div className="w-16 h-16 rounded-2xl bg-[#A7D8F0] flex items-center justify-center text-[#172B4D] font-extrabold text-xl shadow-xs">
                  {name ? name.charAt(0) : 'T'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172B4D]">{profile.name}</h3>
                  <p className="text-xs text-[#5E7292]">{profile.email}</p>
                  <span className="inline-block mt-1 bg-[#DFF3FC] text-[#3B92BD] text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Active Member
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Display Name */}
                <div>
                  <label className="text-xs font-bold text-[#172B4D] block mb-1">Display Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6BB6D9] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7FBFE] border border-[#E2F1FA] rounded-xl text-[#172B4D] focus:outline-none focus:border-[#6BB6D9] focus:bg-[#FFFFFF]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-bold text-[#172B4D] block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6BB6D9] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7FBFE] border border-[#E2F1FA] rounded-xl text-[#172B4D] focus:outline-none focus:border-[#6BB6D9] focus:bg-[#FFFFFF]"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-xs font-bold text-[#172B4D] block mb-1">Password</label>
                <div className="relative max-w-md">
                  <Lock className="w-4 h-4 text-[#6BB6D9] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F7FBFE] border border-[#E2F1FA] rounded-xl text-[#172B4D] focus:outline-none focus:border-[#6BB6D9] focus:bg-[#FFFFFF]"
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

                {/* Password Strength Meter */}
                <div className="max-w-md">
                  <PasswordStrengthIndicator password={password} />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2F1FA]">
                {savedSuccess ? (
                  <span className="flex items-center space-x-1.5 text-xs text-emerald-600 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Profile updated successfully!</span>
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  disabled={password.length > 0 && !passwordVal.isValid}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-bold text-sm rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          )}

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
