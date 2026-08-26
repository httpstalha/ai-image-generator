<div align="center">
  <h1>✨ Cerulia AI Image Generator ✨</h1>
  <p>A professional, modern web application for next-generation AI image generation, background removal, and creative exploration.</p>
</div>

<br />

## 🌟 Overview

**Cerulia** is an enterprise-grade AI Image Generator built with **Next.js 16 (App Router)** and **React 19**. It leverages powerful multi-model endpoints including **Alibaba Cloud Model Studio (DashScope)** and **Pollinations AI** to bring imaginative text prompts to life across diverse, high-fidelity aesthetic styles.

---

## 🎨 AI Features & Capabilities

### 1. Advanced Image Generation Engine
Cerulia integrates with cutting-edge text-to-image AI APIs (including **Qwen / Wan2.5-t2i-preview**) to generate stunning images. The platform supports multiple curated art styles, injecting specialized prompt suffixes to ensure breathtaking results.

#### Curated Styles
| Anime | Realistic | Cinematic | Digital Art |
|:---:|:---:|:---:|:---:|
| <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80" width="200" style="border-radius:10px" alt="Anime"/> | <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80" width="200" style="border-radius:10px" alt="Realistic"/> | <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80" width="200" style="border-radius:10px" alt="Cinematic"/> | <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80" width="200" style="border-radius:10px" alt="Digital Art"/> |
| Vibrant line art & Makoto Shinkai lighting | Photorealistic 8k detail & sharp focus | Dramatic film composition & blockbluster aesthetics | Modern concept art & expressive brush strokes |

### 2. Intelligent Background Removal Tool
Built-in Canvas API algorithm designed to seamlessly remove backgrounds and generate transparent PNGs (Alpha Channel Extraction) locally within the browser, optimizing user privacy and speed without relying on external APIs.

---

## 🔐 Authentication & Security

The platform utilizes **NextAuth 2.0** for a highly secure, frictionless login experience.
- **OAuth Providers Support**: Google, Yahoo, and Apple integrations.
- **Custom Credentials**: Robust email/password authentication system.
- **Protected Routes**: Middleware and HOCs (AuthGuard) to restrict access to pro features and galleries.

---

## 🛠️ Technology Stack

### Frontend & UI
- **Framework**: Next.js (React 19)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend & Cloud
- **Authentication**: NextAuth.js
- **AI Endpoints**: Alibaba Cloud Model Studio (Qwen), Pollinations AI API
- **State & Storage**: Secure local storage & API proxy routing

---

## 🚀 Getting Started

Follow these instructions to run the Cerulia AI Image Generator locally.

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **Package Manager**: `npm`, `yarn`, or `pnpm`

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/httpstalha/ai-image-generator.git
cd ai-image-generator
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the project and populate it with your credentials:

```env
# AI API Keys
AI_GENERATOR_API_KEY=your_alibaba_qwen_or_pollinations_api_key
NEXT_PUBLIC_AI_API_KEY=your_public_api_key_if_applicable

# Authentication (NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_random_string

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret

# Database (If applicable)
DATABASE_URL=your_postgresql_database_url
```

### 4. Running the Development Server

Start the app locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start generating AI art!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/httpstalha/ai-image-generator/issues).

## 📄 License
This project is available under the MIT License.
