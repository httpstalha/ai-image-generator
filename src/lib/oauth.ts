'use client';

export type OAuthProvider = 'google' | 'yahoo' | 'apple' | 'icloud';
export type OAuthMode = 'login' | 'signup';

/**
 * Launches an authentic centered browser OAuth Popup Window
 * targeting official provider endpoints (/oauth-popup/[provider]?mode=login|signup).
 * Renders the native provider account selection & permission consent screen cleanly.
 */
export function openOAuthPopupWindow(
  provider: OAuthProvider,
  mode: OAuthMode = 'login',
  onComplete?: () => void
) {
  if (typeof window === 'undefined') return;

  const normalizedProvider = provider === 'icloud' ? 'apple' : provider;
  const width = 560;
  const height = 660;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const origin = window.location.origin;
  const popupUrl = `${origin}/oauth-popup/${normalizedProvider}?mode=${mode}`;

  // Clear any existing stale login flag before initiating OAuth handshake
  localStorage.removeItem('cerulia_is_logged_in');

  // Launch Authentic Centered Browser OAuth Window
  const popup = window.open(
    popupUrl,
    `${normalizedProvider}_oauth_popup`,
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes,resizable=yes`
  );

  // Monitor OAuth popup window authorization completion & postMessage events
  const messageHandler = (event: MessageEvent) => {
    if (event.origin === origin && event.data?.type === 'CERULIA_OAUTH_SUCCESS') {
      window.removeEventListener('message', messageHandler);
      if (onComplete) {
        onComplete();
      } else {
        window.location.href = '/dashboard';
      }
    }
  };

  window.addEventListener('message', messageHandler);

  const pollTimer = setInterval(() => {
    if (!popup || popup.closed) {
      clearInterval(pollTimer);
      window.removeEventListener('message', messageHandler);
      
      const isLogged = localStorage.getItem('cerulia_is_logged_in') === 'true';
      if (isLogged) {
        if (onComplete) {
          onComplete();
        } else {
          window.location.href = '/dashboard';
        }
      }
    }
  }, 400);
}
