import React, { useState } from 'react';
import { X, Phone, Lock, LockOpen, Eye, EyeOff, User, Store, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess?: (role: 'customer' | 'merchant', phone: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'customer' | 'merchant'>('customer');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
    setShowPassword(false);
    setIsSuccess(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsSuccess(true);
    if (onLoginSuccess) {
      onLoginSuccess(role, phone);
    }
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Top Lockup */}
        <div className="bg-slate-50 pt-7 pb-5 px-6 border-b border-slate-100 text-center">
          <Logo size="sm" className="justify-center mb-2" />
          <h3 className="font-extrabold text-lg text-[#171717]">
            {mode === 'login' ? 'অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            আপনার পাশের দোকানগুলোর সাথে সার্বক্ষণিক যুক্ত থাকুন
          </p>

          {/* Mode Tabs */}
          <div className="mt-4 grid grid-cols-2 p-1 bg-slate-200/60 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                setMode('login');
                setIsSuccess(false);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#0B4A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              লগইন (Login)
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setIsSuccess(false);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#0B4A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সাইন আপ (Sign Up)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-lg text-[#171717]">
                {mode === 'login' ? 'স্বাগতম!' : 'নিবন্ধন সফল হয়েছে!'}
              </h4>
              <p className="text-xs text-slate-500">
                লগইন সফল হয়েছে। হোমপেজে ফিরে যাচ্ছেন...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                    role === 'customer'
                      ? 'border-[#0B4A8A] bg-[#0B4A8A]/5 text-[#0B4A8A] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>আমি ক্রেতা</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('merchant')}
                  className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                    role === 'merchant'
                      ? 'border-[#FF7900] bg-[#FF7900]/5 text-[#FF7900] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>আমি দোকানদার</span>
                </button>
              </div>

              {/* Name for Sign Up */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আপনার পূর্ণ নাম
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="যেমন: সাকিব হাসান"
                      className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]/30"
                    />
                  </div>
                </div>
              )}

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১৭১১-xxxxxx"
                    className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]/30"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    পাসওয়ার্ড
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="text-[11px] text-[#0B4A8A] hover:underline"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  )}
                </div>
                <div className="relative">
                  {/* Left Lock indicator */}
                  <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                    {showPassword ? (
                      <LockOpen className="w-4 h-4 text-[#FF7900]" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Password Input (toggles type) */}
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={showPassword ? 'আপনার পাসওয়ার্ড লিখুন' : '••••••••'}
                    className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]/30 transition-all"
                  />

                  {/* Clickable Lock Icon Button to view/hide password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 p-1.5 rounded-lg text-slate-400 hover:text-[#0B4A8A] hover:bg-slate-100 transition-colors focus:outline-none"
                    title={showPassword ? 'পাসওয়ার্ড লুকাতে ক্লিক করুন' : 'পাসওয়ার্ড দেখতে ক্লিক করুন'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <LockOpen className="w-4 h-4 text-[#FF7900]" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  তালা আইকনে ক্লিক করে পাসওয়ার্ড দেখা বা লুকানো যাবে।
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0B4A8A] hover:bg-[#093a6d] transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>{mode === 'login' ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center text-[11px] text-slate-400 pt-1">
                এগিয়ে যাওয়ার মাধ্যমে আপনি Pasher Shop-এর সেবা শর্তাবলি মেনে নিচ্ছেন।
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
