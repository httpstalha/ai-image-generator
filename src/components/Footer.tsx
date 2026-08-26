import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#DFF3FC]/70 border-t border-[#E2F1FA] pt-12 pb-8 text-[#172B4D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-[#172B4D] shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-[#172B4D]">Cerulia</span>
            </div>
            <p className="text-xs text-[#5E7292] leading-relaxed">
              Simple, clean, soft blue pastel AI Image Generation website engineered for fast, high-quality visual creation and background removal.
            </p>
          </div>

          {/* Supported 4 Styles */}
          <div>
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">Supported Styles</h4>
            <ul className="space-y-2 text-xs text-[#5E7292]">
              <li><span className="hover:text-[#6BB6D9] transition-colors">✨ Anime</span></li>
              <li><span className="hover:text-[#6BB6D9] transition-colors">📸 Realistic</span></li>
              <li><span className="hover:text-[#6BB6D9] transition-colors">🎬 Cinematic</span></li>
              <li><span className="hover:text-[#6BB6D9] transition-colors">🎨 Digital Art</span></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#5E7292]">
              <li><Link href="/" className="hover:text-[#6BB6D9] transition-colors">Home Page</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#6BB6D9] transition-colors">Dashboard</Link></li>
              <li><Link href="/generate" className="hover:text-[#6BB6D9] transition-colors">Generate Image</Link></li>
              <li><Link href="/my-images" className="hover:text-[#6BB6D9] transition-colors">My Images</Link></li>
              <li><Link href="/profile" className="hover:text-[#6BB6D9] transition-colors">Profile & Settings</Link></li>
            </ul>
          </div>

          {/* Project Developer */}
          <div className="bg-[#FFFFFF]/80 p-4 rounded-2xl border border-[#E2F1FA] shadow-xs">
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#6BB6D9]" /> Developer Profile
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Cpu className="w-4 h-4 text-[#6BB6D9] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#172B4D]">Talha <span className="text-[10px] bg-[#A7D8F0] px-1.5 py-0.5 rounded text-[#172B4D]">Project Lead</span></p>
                  <p className="text-[11px] text-[#5E7292]">Full-Stack AI & Web Engineer</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-[#BBE0F5]/50 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5E7292]">
          <p>© {new Date().getFullYear()} Cerulia. Soft Blue Pastel AI Image Generator.</p>
          <p className="mt-2 sm:mt-0 font-medium text-[#6BB6D9]">Designed & Built by Talha</p>
        </div>
      </div>
    </footer>
  );
}
