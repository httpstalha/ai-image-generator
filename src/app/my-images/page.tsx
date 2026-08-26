'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import ImageModal from '@/components/ImageModal';
import RemoveBgModal from '@/components/RemoveBgModal';
import { History, Download, Trash2, Scissors, Eye, Search, Calendar } from 'lucide-react';
import { getStoredImages, deleteImageRecord } from '@/lib/storage';
import { downloadImageFile } from '@/lib/download-helper';
import { GeneratedImage } from '@/types';

export default function MyImagesPage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('ALL');
  
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [removeBgImage, setRemoveBgImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    setImages(getStoredImages());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteImageRecord(id);
    setImages(updated);
    if (selectedImage?.id === id) setSelectedImage(null);
  };

  const handleDownload = (img: GeneratedImage) => {
    downloadImageFile(img.imageUrl, `cerulia-image-${img.style.toLowerCase()}-${Date.now()}.png`);
  };

  const filteredImages = images.filter((img) => {
    const matchesSearch = img.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = selectedStyle === 'ALL' || img.style === selectedStyle;
    return matchesSearch && matchesStyle;
  });

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#F7FBFE]">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#DFF3FC] px-3 py-1 rounded-full text-xs font-semibold text-[#172B4D] mb-1">
                <History className="w-3.5 h-3.5 text-[#6BB6D9]" />
                <span>Saved Generations</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#172B4D]">My Images</h1>
              <p className="text-xs text-[#5E7292]">Browse, download, or manage all your created AI images.</p>
            </div>

            {/* Controls */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#6BB6D9] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E2F1FA] rounded-2xl text-xs text-[#172B4D] focus:outline-none focus:border-[#6BB6D9] shadow-xs"
                />
              </div>

              <div className="flex items-center space-x-1 bg-[#FFFFFF] p-1 rounded-2xl border border-[#E2F1FA] w-full sm:w-auto">
                {['ALL', 'Anime', 'Realistic', 'Cinematic', 'Digital Art'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedStyle === style
                        ? 'bg-[#A7D8F0] text-[#172B4D] shadow-xs'
                        : 'text-[#5E7292] hover:text-[#172B4D]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Images Grid */}
          {filteredImages.length === 0 ? (
            <div className="bg-[#FFFFFF] border-2 border-dashed border-[#E2F1FA] rounded-3xl p-12 text-center space-y-3">
              <History className="w-10 h-10 text-[#6BB6D9] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#172B4D]">No saved images found</p>
              <p className="text-xs text-[#5E7292]">Generate new images to populate your gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((img) => (
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
                    <span className="absolute top-3 left-3 bg-[#A7D8F0] text-[#172B4D] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                      {img.style}
                    </span>

                    <div className="absolute inset-0 bg-[#172B4D]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setSelectedImage(img)}
                        className="p-2 bg-[#FFFFFF] text-[#172B4D] rounded-xl hover:bg-[#A7D8F0] transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
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

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-xs font-medium text-[#172B4D] line-clamp-2 mb-2">
                        "{img.prompt}"
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#5E7292] bg-[#F7FBFE] px-2.5 py-1 rounded-lg">
                        <Calendar className="w-3 h-3 text-[#6BB6D9]" />
                        <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2F1FA]">
                      <button
                        onClick={() => handleDownload(img)}
                        className="flex items-center justify-center space-x-1 py-2 px-2 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-bold text-xs rounded-xl transition-all shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="flex items-center justify-center space-x-1 py-2 px-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-xl transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>

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
        />

        <Footer />
      </div>
    </AuthGuard>
  );
}
