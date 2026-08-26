'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Scissors, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { GeneratedImage } from '@/types';
import { removeBackgroundCanvas } from '@/lib/ai-generator';
import { updateImageTransparentUrl } from '@/lib/storage';

import { downloadImageFile } from '@/lib/download-helper';

interface RemoveBgModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onSuccess?: (transparentUrl: string) => void;
}

export default function RemoveBgModal({ image, onClose, onSuccess }: RemoveBgModalProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [transparentUrl, setTransparentUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'transparent' | 'original'>('transparent');

  useEffect(() => {
    if (!image) return;

    let isMounted = true;
    setIsProcessing(true);
    setTransparentUrl(null);

    // Run Canvas Background Removal processing
    removeBackgroundCanvas(image.imageUrl)
      .then((url) => {
        if (isMounted) {
          setTransparentUrl(url);
          setIsProcessing(false);
          updateImageTransparentUrl(image.id, url);
          if (onSuccess) onSuccess(url);
        }
      })
      .catch((err) => {
        console.error('BG removal failed:', err);
        if (isMounted) setIsProcessing(false);
      });

    return () => {
      isMounted = false;
    };
  }, [image]);

  if (!image) return null;

  const handleDownloadTransparent = () => {
    if (!transparentUrl) return;
    const filename = `cerulia-transparent-${image.prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_')}.png`;
    downloadImageFile(transparentUrl, filename);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#E2F1FA] p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2F1FA] pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-[#172B4D]">
              <Scissors className="w-4 h-4 text-[#172B4D]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172B4D]">Background Removal Tool</h3>
              <p className="text-xs text-[#5E7292]">Convert generated art to transparent PNG</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#5E7292] hover:text-[#172B4D] hover:bg-[#DFF3FC] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#DFF3FC]/60 p-1 rounded-2xl border border-[#E2F1FA]">
          <button
            onClick={() => setActiveTab('transparent')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'transparent'
                ? 'bg-[#A7D8F0] text-[#172B4D] shadow-xs'
                : 'text-[#5E7292] hover:text-[#172B4D]'
            }`}
          >
            Transparent PNG
          </button>
          <button
            onClick={() => setActiveTab('original')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'original'
                ? 'bg-[#A7D8F0] text-[#172B4D] shadow-xs'
                : 'text-[#5E7292] hover:text-[#172B4D]'
            }`}
          >
            Original Image
          </button>
        </div>

        {/* Processing State / Image Display */}
        <div className="relative min-h-[300px] bg-[#F7FBFE] border-2 border-dashed border-[#BBE0F5] rounded-2xl p-4 flex items-center justify-center overflow-hidden">
          {/* Checkered pattern for transparency visualization */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-[#6BB6D9] 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          {isProcessing ? (
            <div className="text-center space-y-3 z-10">
              <Loader2 className="w-10 h-10 text-[#6BB6D9] animate-spin mx-auto" />
              <p className="text-sm font-semibold text-[#172B4D]">Removing Background...</p>
              <p className="text-xs text-[#5E7292]">Extracting subject & creating transparent layer</p>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center">
              <img
                src={activeTab === 'transparent' ? (transparentUrl || image.imageUrl) : image.imageUrl}
                alt="Cutout result"
                className="max-h-[350px] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1.5 text-xs text-[#3B92BD] font-medium">
            <CheckCircle className="w-4 h-4 text-[#6BB6D9]" />
            <span>Ready for transparent export</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5E7292] hover:bg-[#DFF3FC] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={isProcessing || !transparentUrl}
              onClick={handleDownloadTransparent}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Transparent PNG</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
