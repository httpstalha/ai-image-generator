'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import ImageModal from '@/components/ImageModal';
import RemoveBgModal from '@/components/RemoveBgModal';
import { Sparkles, Plus, Image as ImageIcon, Eye, Download, Scissors, ArrowRight } from 'lucide-react';
import { getStoredUser, getStoredImages, deleteImageRecord, DEFAULT_USER } from '@/lib/storage';
import { GeneratedImage, UserProfile } from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [removeBgImage, setRemoveBgImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    setImages(getStoredImages());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteImageRecord(id);
    setImages(updated);
    if (selectedImage?.id === id) setSelectedImage(null);
  };

  const handleDownload = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.imageUrl;
    link.download = `ai-image-${img.style}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#F7FBFE]">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Dashboard Header Banner */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2F1FA] pastel-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-[#DFF3FC] px-3 py-1 rounded-full text-xs font-semibold text-[#172B4D]">
                <Sparkles className="w-3.5 h-3.5 text-[#6BB6D9]" />
                <span>Personal Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D]">
                Welcome back, {user.name} 👋
              </h1>
              <p className="text-xs sm:text-sm text-[#5E7292]">
                Create AI images using Anime, Realistic, Cinematic, or Digital Art styles.
              </p>
            </div>

            <Link
              href="/generate"
              className="px-6 py-3.5 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-bold rounded-2xl shadow-sm transition-all flex items-center space-x-2 shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>Generate New Image</span>
            </Link>
          </div>

          {/* Single Stat Counter */}
          <div className="max-w-xs">
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2F1FA] pastel-shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-[#172B4D]">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#172B4D]">{images.length}</p>
                <p className="text-xs font-semibold text-[#5E7292]">Total Images Created</p>
              </div>
            </div>
          </div>

          {/* Most Recent Images Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#172B4D] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6BB6D9]" /> Recent AI Images
              </h2>
              <Link href="/my-images" className="text-xs font-bold text-[#6BB6D9] hover:underline flex items-center gap-1">
                <span>View All Images</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {images.length === 0 ? (
              <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2F1FA] rounded-3xl p-12 text-center space-y-4">
                <ImageIcon className="w-12 h-12 text-[#6BB6D9] mx-auto opacity-50" />
                <div>
                  <p className="text-base font-bold text-[#172B4D]">No images generated yet</p>
                  <p className="text-xs text-[#5E7292] mt-1">Start by clicking Generate New Image to create your first artwork.</p>
                </div>
                <Link
                  href="/generate"
                  className="inline-block px-6 py-2.5 bg-[#A7D8F0] text-[#172B4D] font-bold text-xs rounded-xl"
                >
                  Generate Image
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.slice(0, 4).map((img) => (
                  <div
                    key={img.id}
                    className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E2F1FA] pastel-shadow-sm pastel-shadow-hover flex flex-col group"
                  >
                    <div className="relative aspect-square bg-[#F7FBFE] overflow-hidden">
                      <img
                        src={img.imageUrl}
                        alt={img.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-[#A7D8F0] text-[#172B4D] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {img.style}
                      </span>

                      {/* Hover Action Overlay */}
                      <div className="absolute inset-0 bg-[#172B4D]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 p-2">
                        <button
                          onClick={() => setSelectedImage(img)}
                          className="p-2 bg-[#FFFFFF] text-[#172B4D] rounded-xl hover:bg-[#A7D8F0] transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(img)}
                          className="p-2 bg-[#FFFFFF] text-[#172B4D] rounded-xl hover:bg-[#A7D8F0] transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setRemoveBgImage(img)}
                          className="p-2 bg-[#FFFFFF] text-[#172B4D] rounded-xl hover:bg-[#A7D8F0] transition-colors"
                          title="Remove Background"
                        >
                          <Scissors className="w-4 h-4 text-[#3B92BD]" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <p className="text-xs font-medium text-[#172B4D] line-clamp-2">
                        "{img.prompt}"
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[#5E7292] pt-2 border-t border-[#E2F1FA]">
                        <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                        <Link
                          href={`/image/${img.id}`}
                          className="text-[#6BB6D9] font-bold hover:underline"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>

        {/* Modals */}
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
          onRemoveBackground={(img) => {
            setSelectedImage(null);
            setRemoveBgImage(img);
          }}
          onRegenerate={(img) => {
            window.location.href = `/generate?prompt=${encodeURIComponent(img.prompt)}&style=${encodeURIComponent(img.style)}`;
          }}
          onDelete={handleDelete}
        />

        <RemoveBgModal
          image={removeBgImage}
          onClose={() => setRemoveBgImage(null)}
          onSuccess={() => {
            setImages(getStoredImages());
          }}
        />

        <Footer />
      </div>
    </AuthGuard>
  );
}
