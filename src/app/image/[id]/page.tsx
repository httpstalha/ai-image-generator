'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import RemoveBgModal from '@/components/RemoveBgModal';
import { Sparkles, Download, Scissors, RefreshCw, Trash2, ArrowLeft, Calendar, Tag, ShieldCheck, Loader2 } from 'lucide-react';
import { getStoredImages, deleteImageRecord } from '@/lib/storage';
import { downloadImageFile } from '@/lib/download-helper';
import { GeneratedImage } from '@/types';

export default function DynamicImageDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [removeBgImage, setRemoveBgImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    const images = getStoredImages();
    if (id) {
      const found = images.find(img => img.id === id);
      if (found) setImage(found);
      else if (images.length > 0) setImage(images[0]);
    } else if (images.length > 0) {
      setImage(images[0]);
    }
  }, [id]);

  const handleDownload = () => {
    if (!image) return;
    downloadImageFile(image.imageUrl, `cerulia-details-${image.style.toLowerCase()}-${Date.now()}.png`);
  };

  const handleDelete = () => {
    if (!image) return;
    deleteImageRecord(image.id);
    router.push('/my-images');
  };

  if (!image) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col bg-[#F7FBFE]">
          <Navbar />
          <div className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-[#6BB6D9] animate-spin" />
          </div>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#F7FBFE]">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#5E7292] hover:text-[#172B4D] bg-[#FFFFFF] px-3.5 py-2 rounded-xl border border-[#E2F1FA] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Images</span>
          </button>

          <div className="bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#E2F1FA] pastel-shadow grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Preview Image */}
            <div className="bg-[#F7FBFE] p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E2F1FA] relative">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-auto max-h-[500px] object-contain rounded-2xl shadow-md"
              />
              <span className="absolute top-4 left-4 bg-[#A7D8F0] text-[#172B4D] text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                {image.style}
              </span>
            </div>

            {/* Right Details Panel */}
            <div className="p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-[#DFF3FC] px-3 py-1 rounded-full text-xs font-semibold text-[#172B4D]">
                  <Sparkles className="w-3.5 h-3.5 text-[#6BB6D9]" />
                  <span>Image Details (ID: {image.id})</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5E7292] uppercase block mb-1">Prompt</label>
                  <p className="text-base font-semibold text-[#172B4D] bg-[#F7FBFE] p-4 rounded-2xl border border-[#E2F1FA] leading-relaxed">
                    "{image.prompt}"
                  </p>
                </div>

                <div className="space-y-2 text-xs text-[#5E7292]">
                  <div className="flex items-center justify-between p-3 bg-[#F7FBFE] rounded-xl">
                    <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-[#6BB6D9]" /> Style</span>
                    <span className="font-bold text-[#172B4D]">{image.style}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F7FBFE] rounded-xl">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#6BB6D9]" /> Created Date</span>
                    <span className="font-medium text-[#172B4D]">{new Date(image.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F7FBFE] rounded-xl">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6BB6D9]" /> Storage</span>
                    <span className="font-medium text-[#3B92BD]">Cerulia PostgreSQL DB</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-[#E2F1FA]">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-bold rounded-xl shadow-xs transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </button>

                <button
                  onClick={() => setRemoveBgImage(image)}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#DFF3FC] hover:bg-[#A7D8F0] text-[#172B4D] font-semibold rounded-xl transition-all border border-[#BBE0F5]"
                >
                  <Scissors className="w-4 h-4 text-[#3B92BD]" />
                  <span>Remove Background</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => router.push(`/generate?prompt=${encodeURIComponent(image.prompt)}&style=${encodeURIComponent(image.style)}`)}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-[#F7FBFE] hover:bg-[#DFF3FC] text-[#172B4D] font-semibold text-xs rounded-xl border border-[#E2F1FA]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#6BB6D9]" />
                    <span>Regenerate</span>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <RemoveBgModal
            image={removeBgImage}
            onClose={() => setRemoveBgImage(null)}
          />
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
