// LocalStorage & State Persistence Layer for Cerulia AI Image Generator
import { GeneratedImage, GenerationRecord, UserProfile, ImageStyle } from '@/types';

const USERS_KEY = 'cerulia_user_profile';
const IMAGES_KEY = 'cerulia_generated_images';
const GENERATIONS_KEY = 'cerulia_generations_history';
const REGISTERED_EMAILS_KEY = 'cerulia_registered_emails_list';

export function getRegisteredEmails(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(REGISTERED_EMAILS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function isEmailRegistered(email: string): boolean {
  if (!email || typeof window === 'undefined') return false;
  const emails = getRegisteredEmails();
  return emails.some(e => e.toLowerCase() === email.trim().toLowerCase());
}

export function registerUserEmail(email: string): void {
  if (!email || typeof window === 'undefined') return;
  const normalized = email.trim().toLowerCase();
  const current = getRegisteredEmails();
  if (!current.some(e => e.toLowerCase() === normalized)) {
    const updated = [...current, normalized];
    localStorage.setItem(REGISTERED_EMAILS_KEY, JSON.stringify(updated));
  }
}

// Default User Profile (Neutral fallback)
export const DEFAULT_USER: UserProfile = {
  id: 'usr_cerulia_guest',
  name: 'Cerulia Member',
  email: 'user@cerulia.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-08-21',
  apiKey: 'cr_live_ai_sec_9847129384',
  provider: 'email'
};

export function createSocialUser(provider: 'google' | 'yahoo' | 'icloud', email?: string, name?: string): UserProfile {
  const providerNames = {
    google: name || 'Google Member',
    yahoo: name || 'Yahoo Member',
    icloud: name || 'Apple Member'
  };
  const providerEmails = {
    google: email || 'user.google@gmail.com',
    yahoo: email || 'user.yahoo@yahoo.com',
    icloud: email || 'user.apple@icloud.com'
  };
  const providerAvatars = {
    google: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    yahoo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    icloud: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  };

  return {
    id: `usr_${provider}_${Date.now()}`,
    name: providerNames[provider],
    email: providerEmails[provider],
    avatar: providerAvatars[provider],
    createdAt: new Date().toISOString().split('T')[0],
    apiKey: `cr_${provider}_${Math.random().toString(36).substring(2, 11)}`,
    provider: provider
  };
}

// Initial Seed Images featuring all 4 supported styles
const INITIAL_IMAGES: GeneratedImage[] = [
  {
    id: 'img_001',
    userId: 'usr_cerulia_001',
    prompt: 'Futuristic metropolis with neon reflections and flying vehicles in rain',
    style: 'Cinematic',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'img_002',
    userId: 'usr_cerulia_001',
    prompt: 'Mystical anime warrior girl with blue glowing aura standing on cliff',
    style: 'Anime',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'img_003',
    userId: 'usr_cerulia_001',
    prompt: 'Portrait of an elderly craftsman in light study with ultra crisp details',
    style: 'Realistic',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'img_004',
    userId: 'usr_cerulia_001',
    prompt: 'Abstract vibrant galaxy wave floating over soft pastel clouds',
    style: 'Digital Art',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const INITIAL_GENERATIONS: GenerationRecord[] = [
  {
    id: 'gen_001',
    userId: 'usr_cerulia_001',
    prompt: 'Futuristic metropolis with neon reflections',
    style: 'Cinematic',
    numImages: 2,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'gen_002',
    userId: 'usr_cerulia_001',
    prompt: 'Mystical anime warrior girl with blue glowing aura',
    style: 'Anime',
    numImages: 1,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

export function getStoredUser(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER;
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveStoredUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(user));
  if (user.email) {
    registerUserEmail(user.email);
  }
}

export function getStoredImages(): GeneratedImage[] {
  if (typeof window === 'undefined') return INITIAL_IMAGES;
  const stored = localStorage.getItem(IMAGES_KEY);
  if (!stored) {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(INITIAL_IMAGES));
    return INITIAL_IMAGES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_IMAGES;
  }
}

export function saveImageRecord(image: GeneratedImage): GeneratedImage[] {
  const current = getStoredImages();
  const updated = [image, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteImageRecord(id: string): GeneratedImage[] {
  const current = getStoredImages();
  const updated = current.filter(img => img.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function updateImageTransparentUrl(id: string, transparentUrl: string): GeneratedImage[] {
  const current = getStoredImages();
  const updated = current.map(img => img.id === id ? { ...img, transparentUrl } : img);
  if (typeof window !== 'undefined') {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getStoredGenerations(): GenerationRecord[] {
  if (typeof window === 'undefined') return INITIAL_GENERATIONS;
  const stored = localStorage.getItem(GENERATIONS_KEY);
  if (!stored) {
    localStorage.setItem(GENERATIONS_KEY, JSON.stringify(INITIAL_GENERATIONS));
    return INITIAL_GENERATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_GENERATIONS;
  }
}

export function saveGenerationRecord(gen: GenerationRecord): void {
  const current = getStoredGenerations();
  const updated = [gen, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(GENERATIONS_KEY, JSON.stringify(updated));
  }
}
