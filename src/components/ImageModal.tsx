'use client';

import React from 'react';
import { X, Download, Scissors, RefreshCw, Trash2, Calendar, Sparkles, Eye } from 'lucide-react';
import { GeneratedImage } from '@/types';

interface ImageModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onDownload: (img: GeneratedImage) => void;
  onRemoveBackground: (img: GeneratedImage) => void;
  onRegenerate: (img: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

export default function ImageModal({
  image,
  onClose,
  onDownload,
  onRemoveBackground,
  onRegenerate,
  onDelete,
}: ImageModalProps) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#FFFFFF] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#E2F1FA] flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Display */}
        <div className="md:w-3/5 bg-[#F7FBFE] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#E2F1FA] relative min-h-[300px]">
          <img
            src={image.imageUrl}
            alt={image.prompt}
            className="w-full h-auto max-h-[60vh] object-contain rounded-2xl shadow-md"
          />
          <div className="absolute top-4 left-4 bg-[#A7D8F0] text-[#172B4D] text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
            {image.style}
          </div>
        </div>

        {/* Details & Actions */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6BB6D9] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Image Details
              </span>
              <button
                onClick={onClose}
                className="p-1 text-[#5E7292] hover:text-[#172B4D] hover:bg-[#DFF3FC] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt */}
            <div>
              <label className="text-xs font-medium text-[#5E7292] block mb-1">Prompt</label>
              <p className="text-sm font-medium text-[#172B4D] bg-[#DFF3FC]/50 p-3 rounded-2xl border border-[#E2F1FA]">
                "{image.prompt}"
              </p>
            </div>

            {/* Date & Meta */}
            <div className="flex items-center gap-2 text-xs text-[#5E7292] bg-[#F7FBFE] px-3 py-2 rounded-xl">
              <Calendar className="w-4 h-4 text-[#6BB6D9]" />
              <span>Created {new Date(image.createdAt).toLocaleDateString()} at {new Date(image.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* 5 Standard Action Buttons (Requirement 4) */}
          <div className="space-y-2 pt-2 border-t border-[#E2F1FA]">
            {/* Download */}
            <button
              onClick={() => onDownload(image)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-semibold rounded-xl transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>

            {/* Remove Background */}
            <button
              onClick={() => onRemoveBackground(image)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#DFF3FC] hover:bg-[#A7D8F0] text-[#172B4D] font-medium rounded-xl transition-all border border-[#BBE0F5]"
            >
              <Scissors className="w-4 h-4 text-[#3B92BD]" />
              <span>Remove Background</span>
            </button>

            {/* Regenerate & Delete Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onRegenerate(image)}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#F7FBFE] hover:bg-[#DFF3FC] text-[#172B4D] font-medium text-xs rounded-xl border border-[#E2F1FA] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#6BB6D9]" />
                <span>Regenerate</span>
              </button>

              <button
                onClick={() => onDelete(image.id)}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
