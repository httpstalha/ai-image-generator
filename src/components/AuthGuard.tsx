'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, Lock } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard Component
 * Strictly guards protected application routes (/dashboard, /generate, /my-images, /profile, /image/[id]).
 * If a user is not authenticated, they are automatically redirected to /login.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const authFlag = typeof window !== 'undefined' ? localStorage.getItem('cerulia_is_logged_in') : null;
    const isLoggedInLocal = authFlag !== 'false' && authFlag !== null;
    const isNextAuthLoggedIn = status === 'authenticated';

    if (!isLoggedInLocal && !isNextAuthLoggedIn && status !== 'loading') {
      setIsAuthorized(false);
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsAuthorized(true);
    }
  }, [status, pathname, router]);

  // Loading state while checking authentication credentials
  if (isAuthorized === null || status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FBFE] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#DFF3FC] flex items-center justify-center text-[#3B92BD] shadow-xs animate-pulse">
          <Lock className="w-6 h-6" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-[#172B4D]">
          <Loader2 className="w-4 h-4 animate-spin text-[#6BB6D9]" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // If unauthorized, block rendering
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
