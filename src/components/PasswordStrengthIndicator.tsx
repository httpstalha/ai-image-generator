import React from 'react';
import { validatePasswordStrength } from '@/lib/password-validator';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

interface Props {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: Props) {
  if (!password) return null;

  const result = validatePasswordStrength(password);

  const getBarColor = () => {
    if (result.strengthLabel === 'Strong') return 'bg-emerald-500';
    if (result.strengthLabel === 'Medium') return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getTextColor = () => {
    if (result.strengthLabel === 'Strong') return 'text-emerald-600';
    if (result.strengthLabel === 'Medium') return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="mt-2.5 p-3.5 bg-[#F7FBFE] border border-[#E2F1FA] rounded-2xl space-y-3">
      {/* Strength Bar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          {result.isValid ? (
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          )}
          <span className="text-xs font-bold text-[#172B4D]">Password Strength:</span>
        </div>
        <span className={`text-xs font-black uppercase tracking-wider ${getTextColor()}`}>
          {result.strengthLabel}
        </span>
      </div>

      {/* Visual Progress Meter */}
      <div className="w-full h-1.5 bg-[#E2F1FA] rounded-full overflow-hidden flex gap-1">
        <div
          className={`h-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${(result.score / 5) * 100}%` }}
        />
      </div>

      {/* Checklist Rules */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <div className={`flex items-center space-x-1 ${result.hasMinLength ? 'text-emerald-600 font-semibold' : 'text-[#5E7292]'}`}>
          {result.hasMinLength ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
          <span>At least 8 characters</span>
        </div>
        <div className={`flex items-center space-x-1 ${result.hasUppercase ? 'text-emerald-600 font-semibold' : 'text-[#5E7292]'}`}>
          {result.hasUppercase ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
          <span>1 Uppercase letter (A-Z)</span>
        </div>
        <div className={`flex items-center space-x-1 ${result.hasLowercase ? 'text-emerald-600 font-semibold' : 'text-[#5E7292]'}`}>
          {result.hasLowercase ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
          <span>1 Lowercase letter (a-z)</span>
        </div>
        <div className={`flex items-center space-x-1 ${result.hasNumber ? 'text-emerald-600 font-semibold' : 'text-[#5E7292]'}`}>
          {result.hasNumber ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
          <span>1 Number (0-9)</span>
        </div>
        <div className={`flex items-center space-x-1 col-span-2 ${result.hasSpecialChar ? 'text-emerald-600 font-semibold' : 'text-[#5E7292]'}`}>
          {result.hasSpecialChar ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
          <span>1 Special symbol (!@#$%^&*) (Optional for maximum security)</span>
        </div>
      </div>
    </div>
  );
}
