'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import ImageModal from '@/components/ImageModal';
import RemoveBgModal from '@/components/RemoveBgModal';
import { Sparkles, Wand2, RefreshCw, Download, Scissors, Eye, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { IMAGE_STYLES, generateImageUrl } from '@/lib/ai-generator';
import { saveImageRecord, saveGenerationRecord, deleteImageRecord } from '@/lib/storage';
import { downloadImageFile } from '@/lib/download-helper';
import { GeneratedImage, ImageStyle } from '@/types';

function GenerateContent() {
  const searchParams = useSearchParams();
  
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('Cinematic');
  const [numImages, setNumImages] = useState<number>(1);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<GeneratedImage[]>([]);
  const [activeModalImage, setActiveModalImage] = useState<GeneratedImage | null>(null);
  const [removeBgImage, setRemoveBgImage] = useState<GeneratedImage | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const queryPrompt = searchParams.get('prompt');
    const queryStyle = searchParams.get('style');
    if (queryPrompt) setPrompt(queryPrompt);
    if (queryStyle && ['Anime', 'Realistic', 'Cinematic', 'Digital Art'].includes(queryStyle)) {
      setSelectedStyle(queryStyle as ImageStyle);
    }
  }, [searchParams]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setStatusMessage('Talha\'s AI Engine is processing prompt...');

    const newImages: GeneratedImage[] = [];

    setTimeout(() => { setStatusMessage('Applying ' + selectedStyle + ' style parameters...'); }, 600);
    setTimeout(() => { setStatusMessage('Synthesizing high resolution visual assets...'); }, 1200);

    setTimeout(() => {
      for (let i = 0; i < numImages; i++) {
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = generateImageUrl(prompt, selectedStyle, seed);
        
        const newImg: GeneratedImage = {
          id: `img_${Date.now()}_${i}`,
          userId: 'usr_cerulia_001',
          prompt: prompt.trim(),
          style: selectedStyle,
          imageUrl,
          createdAt: new Date().toISOString()
        };

        saveImageRecord(newImg);
        newImages.push(newImg);
      }

      saveGenerationRecord({
        id: `gen_${Date.now()}`,
        userId: 'usr_cerulia_001',
        prompt: prompt.trim(),
        style: selectedStyle,
        numImages,
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      });

      setGeneratedResults(newImages);
      setIsGenerating(false);
      setStatusMessage('');
    }, 2000);
  };

  const handleDownload = (img: GeneratedImage) => {
    downloadImageFile(img.imageUrl, `cerulia-${img.style.toLowerCase()}-${Date.now()}.png`);
  };

  const handleDelete = (id: string) => {
    deleteImageRecord(id);
    setGeneratedResults(prev => prev.filter(img => img.id !== id));
    if (activeModalImage?.id === id) setActiveModalImage(null);
  };

  const handleRegenerateSingle = (img: GeneratedImage) => {
    setPrompt(img.prompt);
    setSelectedStyle(img.style);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-[#DFF3FC] px-3 py-1 rounded-full text-xs font-semibold text-[#172B4D]">
          <Sparkles className="w-3.5 h-3.5 text-[#6BB6D9]" />
          <span>AI Image Creator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D]">Generate Custom AI Artwork</h1>
        <p className="text-xs sm:text-sm text-[#5E7292]">
          Describe your vision, choose your preferred style, and generate up to 4 images at once.
        </p>
      </div>

      {/* Control Card */}
      <form onSubmit={handleGenerate} className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2F1FA] pastel-shadow space-y-6">
        
        {/* 1. Prompt Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center justify-between">
            <span>1. Enter Your Prompt</span>
            <span className="text-[11px] text-[#5E7292] normal-case font-normal">Be descriptive for best results</span>
          </label>
          <textarea
            required
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A futuristic city at night with flying cars and glowing neon towers..."
            className="w-full p-4 bg-[#F7FBFE] border border-[#E2F1FA] rounded-2xl text-sm text-[#172B4D] focus:outline-none focus:border-[#6BB6D9] focus:bg-[#FFFFFF] transition-all resize-none shadow-xs"
          />

          {/* Quick Inspiration Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-[#5E7292]">Try prompt:</span>
            {[
              { label: '🏙️ Cyberpunk Neon City', style: 'Cinematic', prompt: 'A glowing cyberpunk metropolis at night with rainy reflection streets and flying vehicles' },
              { label: '🌸 Anime Cherry Blossom', style: 'Anime', prompt: 'Beautiful anime character in cherry blossom gardens with soft Makoto Shinkai sunlight' },
              { label: '🐉 Mythical Dragon', style: 'Digital Art', prompt: 'Ancient majestic blue dragon resting on mist covered mountain peaks, artstation trending' },
              { label: '🦁 Cybernetic Lion', style: 'Realistic', prompt: 'Photorealistic 8k close up studio portrait of a futuristic mechanical cybernetic lion' }
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(preset.prompt);
                  setSelectedStyle(preset.style as ImageStyle);
                }}
                className="px-2.5 py-1 bg-[#DFF3FC]/70 hover:bg-[#A7D8F0] text-[#172B4D] text-[11px] font-medium rounded-full border border-[#E2F1FA] transition-all hover:scale-105"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Style Picker */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#172B4D] uppercase tracking-wider block">
            2. Select Image Style (4 Version 1 Styles)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {IMAGE_STYLES.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#A7D8F0] border-[#6BB6D9] text-[#172B4D] shadow-md ring-2 ring-[#6BB6D9]/40'
                      : 'bg-[#F7FBFE] border-[#E2F1FA] text-[#5E7292] hover:bg-[#DFF3FC]/60 hover:text-[#172B4D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{style.name}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-[#172B4D]" />}
                  </div>
                  <p className="text-[10px] opacity-80 leading-tight line-clamp-2">{style.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Number of Images Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#172B4D] uppercase tracking-wider block">
            3. Number of Images
          </label>
          <div className="flex space-x-3 max-w-xs">
            {[1, 2, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setNumImages(num)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                  numImages === num
                    ? 'bg-[#A7D8F0] border-[#6BB6D9] text-[#172B4D] shadow-xs'
                    : 'bg-[#F7FBFE] border-[#E2F1FA] text-[#5E7292] hover:bg-[#DFF3FC]'
                }`}
              >
                {num} {num === 1 ? 'Image' : 'Images'}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-extrabold text-base rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#172B4D]" />
                <span>Generating AI Image...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-[#172B4D]" />
                <span>Generate Image</span>
              </>
            )}
          </button>

          {isGenerating && (
            <p className="text-xs text-center text-[#6BB6D9] font-medium mt-3 animate-pulse">
              {statusMessage}
            </p>
          )}
        </div>

      </form>

      {/* Generating Skeleton Cards */}
      {isGenerating && (
        <div className="space-y-4 pt-6 border-t border-[#E2F1FA]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#172B4D] flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-[#6BB6D9] animate-spin" /> Rendering AI Artwork...
            </h2>
            <span className="text-xs text-[#5E7292] bg-[#DFF3FC] px-3 py-1 rounded-full font-medium animate-pulse">
              Cerulia AI Synthesis
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: numImages }).map((_, i) => (
              <div key={i} className="bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#E2F1FA] pastel-shadow p-4 space-y-4 animate-pulse">
                <div className="aspect-square bg-[#DFF3FC]/60 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#6BB6D9]/50 animate-bounce" />
                </div>
                <div className="h-4 bg-[#DFF3FC]/70 rounded-full w-3/4"></div>
                <div className="h-8 bg-[#A7D8F0]/40 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      {!isGenerating && generatedResults.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#E2F1FA]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#172B4D] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6BB6D9]" /> Generated Results ({generatedResults.length})
            </h2>
            <span className="text-xs text-[#5E7292] bg-[#DFF3FC] px-3 py-1 rounded-full font-medium">
              Auto-saved to history
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generatedResults.map((img) => (
              <div
                key={img.id}
                className="bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#E2F1FA] pastel-shadow flex flex-col group"
              >
                <div className="relative aspect-square bg-[#F7FBFE] overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#A7D8F0] text-[#172B4D] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                    {img.style}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs font-medium text-[#172B4D] line-clamp-2">
                    "{img.prompt}"
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#E2F1FA]">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setActiveModalImage(img)}
                        className="flex items-center justify-center space-x-1 py-2 px-2 bg-[#DFF3FC] hover:bg-[#A7D8F0] text-[#172B4D] font-semibold text-xs rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => handleDownload(img)}
                        className="flex items-center justify-center space-x-1 py-2 px-2 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-bold text-xs rounded-xl transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setRemoveBgImage(img)}
                      className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#F7FBFE] hover:bg-[#DFF3FC] text-[#172B4D] font-semibold text-xs rounded-xl border border-[#BBE0F5] transition-colors"
                    >
                      <Scissors className="w-3.5 h-3.5 text-[#3B92BD]" />
                      <span>Remove Background</span>
                    </button>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleRegenerateSingle(img)}
                        className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-[#F7FBFE] hover:bg-[#DFF3FC] text-[#5E7292] hover:text-[#172B4D] font-medium text-[11px] rounded-lg border border-[#E2F1FA]"
                      >
                        <RefreshCw className="w-3 h-3 text-[#6BB6D9]" />
                        <span>Regenerate</span>
                      </button>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-[11px] rounded-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ImageModal
        image={activeModalImage}
        onClose={() => setActiveModalImage(null)}
        onDownload={handleDownload}
        onRemoveBackground={(img) => {
          setActiveModalImage(null);
          setRemoveBgImage(img);
        }}
        onRegenerate={handleRegenerateSingle}
        onDelete={handleDelete}
      />

      <RemoveBgModal
        image={removeBgImage}
        onClose={() => setRemoveBgImage(null)}
      />
    </main>
  );
}

export default function GeneratePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#F7FBFE]">
        <Navbar />
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-[#6BB6D9] animate-spin" />
          </div>
        }>
          <GenerateContent />
        </Suspense>
        <Footer />
      </div>
    </AuthGuard>
  );
}
