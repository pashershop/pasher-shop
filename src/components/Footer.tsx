import React from 'react';
import { Logo } from './Logo';
import { Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAddShopModal: () => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAddShopModal,
  onOpenAuthModal,
}) => {
  return (
    <footer className="bg-white dark:bg-[#02050B] border-t border-[#E5E7EB] dark:border-slate-900 pt-12 pb-8 text-[#171717] dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#E5E7EB] dark:border-slate-900">
          
          {/* Brand & Tagline Column */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <Logo size="lg" showTagline={true} />
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mt-2">
              Pasher Shop বাংলাদেশের প্রথম ও আধুনিক লোকাল শপিং মার্কেটপ্লেস। আপনার পাড়া-মহল্লার দোকানগুলোকে অনলাইনের মাধ্যমে ক্রেতাদের আরও কাছে পৌঁছে দেওয়া আমাদের একমাত্র ব্রত।
            </p>

            <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0B4A8A] dark:text-cyan-400 shrink-0" />
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0B4A8A] dark:text-cyan-400 shrink-0" />
                <span>হেল্পলাইন: +৮৮০ ১৭০১-০০০০০০</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0B4A8A] dark:text-cyan-400 shrink-0" />
                <span>
                  সহযোগিতা:{' '}
                  <a
                    href="mailto:support@pasher.shop"
                    className="hover:text-[#FF7900] transition-colors hover:underline"
                  >
                    support@pasher.shop
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-[#171717] dark:text-white tracking-tight">
              প্রয়োজনীয় লিংক (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-[#FF7900] transition-colors cursor-pointer"
                >
                  হোম (Home)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('nearby-shops')}
                  className="hover:text-[#FF7900] transition-colors cursor-pointer"
                >
                  দোকানসমূহ (Explore Shops)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-[#FF7900] transition-colors cursor-pointer"
                >
                  ক্যাটাগরি (Categories)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why-us')}
                  className="hover:text-[#FF7900] transition-colors cursor-pointer"
                >
                  আমাদের সম্পর্কে (About Us)
                </button>
              </li>
            </ul>
          </div>

          {/* For Shop Owners Column */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-[#171717] dark:text-white tracking-tight">
              দোকানিদের জন্য (For Shop Owners)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={onOpenAddShopModal}
                  className="text-[#FF7900] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>দোকান যুক্ত করুন (Add Shop)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="hover:text-[#0B4A8A] dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  মার্চেন্ট লগইন (Merchant Login)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuthModal('signup')}
                  className="hover:text-[#0B4A8A] dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  মার্চেন্ট রেজিস্ট্রেশন (Registration)
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-400">
                  জিরো কমিশন পলিসি
                </span>
              </li>
            </ul>
          </div>

          {/* Support & Social Column */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-[#171717] dark:text-white tracking-tight">
              সহায়তা ও নিরাপত্তা (Support)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#help" className="hover:text-[#0B4A8A] dark:hover:text-cyan-400 transition-colors">
                  হেল্প সেন্টার (Help Center)
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-[#0B4A8A] dark:hover:text-cyan-400 transition-colors">
                  প্রাইভেসি পলিসি (Privacy Policy)
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#0B4A8A] dark:hover:text-cyan-400 transition-colors">
                  শর্তাবলি (Terms & Conditions)
                </a>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2.5">
                সোশ্যাল মিডিয়ায় যুক্ত থাকুন:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/pashershop?mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white flex items-center justify-center transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-95"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/pashershop?xtok=aWN0dWJkeng5aXJn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-90 flex items-center justify-center transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-95"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@pashershop?si=3w2ZxiwQP-NqOtce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#FF0000] hover:bg-[#E60000] text-white flex items-center justify-center transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-95"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@pashershop?_r=1&_t=ZS-9B5ojtsh1En"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-black hover:bg-slate-900 text-white flex items-center justify-center transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-95 border border-slate-700/80"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.37a6.34 6.34 0 0 0-5.92 6.36 6.34 6.34 0 0 0 6.34 6.34c3.5 0 6.34-2.84 6.34-6.34V8.75a8.28 8.28 0 0 0 4.84 1.55v-3.5a4.85 4.85 0 0 1-2.35-.11z"/>
                  </svg>
                </a>

                {/* Snapchat */}
                <a
                  href="https://snapchat.com/add/pashershop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#FFFC00] hover:bg-[#f0eb00] text-black flex items-center justify-center transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-95 border border-amber-300/60"
                  aria-label="Snapchat"
                  title="Snapchat"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 3.2c-3.05 0-5.3 2.05-5.3 4.85 0 1.2.4 2.3.95 3.2.18.33.2.5 0 .75-.24.33-1.05.8-2.02 1.03-.33.08-.56.3-.56.62 0 .42.38.76.78.89 1.18.35 2.2.08 2.75-.23.2-.12.4-.06.5.16.35.8.72 1.76 1.37 2.21.46.33.98.45 1.73.45.75 0 1.27-.12 1.73-.45.65-.45 1.02-1.41 1.37-2.21.1-.22.3-.28.5-.16.55.31 1.57.58 2.75.23.4-.13.78-.47.78-.89 0-.32-.23-.54-.56-.62-.97-.23-1.78-.7-2.02-1.03-.2-.25-.18-.42 0-.75.55-.9.95-2 1-3.2 0-2.8-2.25-4.85-5.3-4.85z"
                      fill="#FFFFFF"
                      stroke="#000000"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/pashershop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#0A66C2] hover:bg-[#0855A3] text-white flex items-center justify-center transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-95"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/>
                  </svg>
                </a>

                {/* Likee */}
                <a
                  href="https://likee.video/@pashershop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#FF5364] to-[#FF2052] hover:opacity-90 text-white flex items-center justify-center transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-95"
                  aria-label="Likee"
                  title="Likee"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://x.com/pashershop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-black hover:bg-slate-900 text-white flex items-center justify-center transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-95 border border-slate-700/80"
                  aria-label="X (Twitter)"
                  title="X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/pashershop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#229ED9] hover:bg-[#1E8EC4] text-white flex items-center justify-center transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-95"
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-.99.53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.66-2.89 8.01-3.45 3.82-1.59 4.61-1.87 5.13-1.88.11 0 .37.03.54.17.14.12.18.28.2.45-.01.07.01.21 0 .28z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <div>
            © 2026 <span className="font-bold text-[#0B4A8A] dark:text-cyan-400">Pasher Shop</span>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>বাংলাদেশের স্থানীয় ব্যবসায়ীদের সমর্থনে তৈরি</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
};
