// Password Strength & Validation Rules Utility
export interface PasswordValidationResult {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number; // 0 to 5
  strengthLabel: 'Weak' | 'Medium' | 'Strong';
  isValid: boolean;
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasUppercase) score += 1;
  if (hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecialChar) score += 1;

  let strengthLabel: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  if (score >= 4) {
    strengthLabel = 'Strong';
  } else if (score >= 2) {
    strengthLabel = 'Medium';
  }

  // Mandatory requirements for a valid strong password:
  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    score,
    strengthLabel,
    isValid,
  };
}
