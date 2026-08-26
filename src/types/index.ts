// Cerulia AI Image Generator - TypeScript Interfaces

export type ImageStyle = 'Anime' | 'Realistic' | 'Cinematic' | 'Digital Art';

export interface GeneratedImage {
  id: string;
  userId: string;
  prompt: string;
  style: ImageStyle;
  imageUrl: string;
  transparentUrl?: string;
  createdAt: string;
  aspectRatio?: string;
}

export interface GenerationRecord {
  id: string;
  userId: string;
  prompt: string;
  style: ImageStyle;
  numImages: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  apiKey?: string;
  provider?: 'email' | 'google' | 'yahoo' | 'icloud';
}

export interface StyleOption {
  id: ImageStyle;
  name: string;
  description: string;
  badgeColor: string;
  previewUrl: string;
  promptSuffix: string;
}
