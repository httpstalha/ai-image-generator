'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, ArrowRight, Image as ImageIcon, Scissors, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';
import { IMAGE_STYLES } from '@/lib/ai-generator';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FBFE]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
          {/* Subtle background glow circle */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#A7D8F0]/30 to-[#DFF3FC]/50 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <div className="inline-flex items-center space-x-2 bg-[#DFF3FC] border border-[#BBE0F5] px-4 py-1.5 rounded-full text-xs font-bold text-[#172B4D] mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6BB6D9]" />
              <span>Cerulia • Soft Blue Pastel AI Website</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172B4D] tracking-tight leading-tight max-w-4xl mx-auto">
              Create Beautiful AI Images in <span className="text-[#6BB6D9] underline decoration-[#A7D8F0] decoration-wavy decoration-2">Seconds</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#5E7292] max-w-2xl mx-auto leading-relaxed">
              Transform your simple text prompts into high-resolution visuals. Built with 4 custom AI styles, background removal, and instant PNG downloads.
            </p>

            {/* Workflow Banner: Write Prompt -> Pick Style -> Generate -> Download */}
            <div className="mt-10 max-w-3xl mx-auto bg-[#FFFFFF] p-4 rounded-3xl border border-[#E2F1FA] pastel-shadow grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 bg-[#F7FBFE] rounded-2xl border border-[#E2F1FA]">
                <span className="text-[10px] font-bold uppercase text-[#6BB6D9] block">Step 1</span>
                <p className="text-xs font-bold text-[#172B4D] mt-0.5">Write Prompt</p>
              </div>
              <div className="p-3 bg-[#F7FBFE] rounded-2xl border border-[#E2F1FA]">
                <span className="text-[10px] font-bold uppercase text-[#6BB6D9] block">Step 2</span>
                <p className="text-xs font-bold text-[#172B4D] mt-0.5">Pick Style</p>
              </div>
              <div className="p-3 bg-[#F7FBFE] rounded-2xl border border-[#E2F1FA]">
                <span className="text-[10px] font-bold uppercase text-[#6BB6D9] block">Step 3</span>
                <p className="text-xs font-bold text-[#172B4D] mt-0.5">Generate Image</p>
              </div>
              <div className="p-3 bg-[#F7FBFE] rounded-2xl border border-[#E2F1FA]">
                <span className="text-[10px] font-bold uppercase text-[#6BB6D9] block">Step 4</span>
                <p className="text-xs font-bold text-[#172B4D] mt-0.5">Download PNG</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/generate"
                className="w-full sm:w-auto px-8 py-4 bg-[#A7D8F0] hover:bg-[#6BB6D9] text-[#172B4D] font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Start Generating Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-[#DFF3FC] hover:bg-[#A7D8F0] text-[#172B4D] font-semibold text-base rounded-2xl transition-all flex items-center justify-center border border-[#BBE0F5]"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Supported 4 Styles Section */}
        <section className="py-16 bg-[#FFFFFF] border-y border-[#E2F1FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D]">
                4 Signature AI Styles
              </h2>
              <p className="mt-2 text-sm text-[#5E7292]">
                First version focused strictly on these 4 curated artistic styles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {IMAGE_STYLES.map((style) => (
                <div
                  key={style.id}
                  className="bg-[#F7FBFE] rounded-3xl overflow-hidden border border-[#E2F1FA] pastel-shadow-sm pastel-shadow-hover flex flex-col"
                >
                  <div className="h-48 relative overflow-hidden bg-[#DFF3FC]">
                    <img
                      src={style.preview}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#A7D8F0] text-[#172B4D] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {style.name}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#172B4D] mb-1">{style.name} Style</h3>
                      <p className="text-xs text-[#5E7292] leading-relaxed">{style.description}</p>
                    </div>
                    <Link
                      href={`/generate?style=${encodeURIComponent(style.id)}`}
                      className="mt-4 w-full py-2 bg-[#DFF3FC] hover:bg-[#A7D8F0] text-[#172B4D] font-medium text-xs rounded-xl text-center block transition-colors border border-[#BBE0F5]"
                    >
                      Use {style.name} Style
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-16 bg-[#F7FBFE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E2F1FA] pastel-shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#A7D8F0] flex items-center justify-center text-[#172B4D]">
                  <Scissors className="w-6 h-6 text-[#172B4D]" />
                </div>
                <h3 className="text-lg font-bold text-[#172B4D]">Instant Background Removal</h3>
                <p className="text-xs text-[#5E7292] leading-relaxed">
                  Extract subjects with a single click and download transparent PNG cutouts ready for graphic design.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E2F1FA] pastel-shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DFF3FC] flex items-center justify-center text-[#172B4D]">
                  <Layers className="w-6 h-6 text-[#3B92BD]" />
                </div>
                <h3 className="text-lg font-bold text-[#172B4D]">Batch Image Creation</h3>
                <p className="text-xs text-[#5E7292] leading-relaxed">
                  Generate 1, 2, or 4 images simultaneously per prompt to explore multiple creative variations at once.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E2F1FA] pastel-shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#A7D8F0] flex items-center justify-center text-[#172B4D]">
                  <ShieldCheck className="w-6 h-6 text-[#172B4D]" />
                </div>
                <h3 className="text-lg font-bold text-[#172B4D]">Secure AI API Architecture</h3>
                <p className="text-xs text-[#5E7292] leading-relaxed">
                  Engineered by Talha with backend proxy security so your API keys are never exposed client-side.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
