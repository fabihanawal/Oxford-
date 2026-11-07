/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  PhoneCall, 
  FileText, 
  Search,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { User } from 'firebase/auth';
import { SCHOOL_INFO, SUPER_ADMIN_EMAIL } from '../types';

interface NavbarProps {
  currentUser: User | null;
  isAdmin: boolean;
  onOpenAdmissionModal: () => void;
  onOpenTrackerModal: () => void;
  onOpenAdminPanel: () => void;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  isAdmin,
  onOpenAdmissionModal,
  onOpenTrackerModal,
  onOpenAdminPanel,
  onSignInWithGoogle,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification / Hotline Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full text-[10px] animate-pulse">
              <Sparkles className="w-3 h-3" /> ২০২৭ শিক্ষাবর্ষ
            </span>
            <span className="hidden sm:inline">নার্সারি থেকে ৫ম শ্রেণি পর্যন্ত সীমিত আসনে ভর্তি চলছে!</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href="tel:01715844170" 
              className="flex items-center gap-1 hover:text-amber-300 transition-colors font-medium"
            >
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>পরিচালক: 01715-844170</span>
            </a>
            <span className="text-emerald-300 hidden md:inline">|</span>
            <a 
              href="tel:01780678956" 
              className="hidden md:flex items-center gap-1 hover:text-amber-300 transition-colors font-medium"
            >
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>শিক্ষক: 01780-678956</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Branding */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center border border-emerald-100">
                <GraduationCap className="w-7 h-7 text-emerald-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                  {SCHOOL_INFO.nameBn}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-emerald-700 tracking-wide uppercase mt-0.5">
                {SCHOOL_INFO.nameEn} • বদলগাছী, নওগাঁ
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <a href="#about" className="hover:text-emerald-700 transition-colors">পরিচিতি ও মূল্যবোধ</a>
            <a href="#facilities" className="hover:text-emerald-700 transition-colors">ক্যাম্পাস ও সুবিধা</a>
            <a href="#classes" className="hover:text-emerald-700 transition-colors">শ্রেণিসমূহ</a>
            <a href="#notice" className="hover:text-emerald-700 transition-colors">ভর্তি নির্দেশিকা</a>
            <a href="#contact" className="hover:text-emerald-700 transition-colors">যোগাযোগ</a>
            <button 
              onClick={onOpenTrackerModal}
              className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 transition-colors font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs"
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>আবেদন যাচাই</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Admin Dashboard Entry Button */}
            <button
              onClick={onOpenAdminPanel}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                isAdmin 
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-xs' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="অ্যাডমিন ড্যাশবোর্ড (rstsbd@gmail.com)"
            >
              <ShieldCheck className={`w-4 h-4 ${isAdmin ? 'text-amber-600' : 'text-slate-500'}`} />
              <span>{isAdmin ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন লগইন'}</span>
            </button>

            {/* Google Authentication Status */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'Guardian'} 
                    className="w-8 h-8 rounded-full border border-emerald-500 ring-2 ring-emerald-100 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                )}
                <div className="hidden xl:block text-left text-xs">
                  <p className="font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                    {currentUser.displayName || 'অভিভাবক'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[110px]">
                    {currentUser.email}
                  </p>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                  title="লগআউট"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignInWithGoogle}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>জিমেইল লগইন</span>
              </button>
            )}

            {/* Main Admission CTA Button */}
            <button
              onClick={onOpenAdmissionModal}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>অনলাইনে ভর্তি হোন</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenAdmissionModal}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 rounded-lg shadow-xs"
            >
              ভর্তি আবেদন
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-700 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-slate-700">
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 hover:text-emerald-700"
            >
              পরিচিতি ও মূল্যবোধ
            </a>
            <a 
              href="#facilities" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 hover:text-emerald-700"
            >
              ক্যাম্পাস ও সুবিধা
            </a>
            <a 
              href="#classes" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 hover:text-emerald-700"
            >
              শ্রেণিসমূহ
            </a>
            <a 
              href="#notice" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 hover:text-emerald-700"
            >
              ভর্তি নির্দেশিকা
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 hover:text-emerald-700"
            >
              যোগাযোগ
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackerModal();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>আবেদন যাচাই ও ট্র্যাকিং</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminPanel();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>অ্যাডমিন প্যানেল ({SUPER_ADMIN_EMAIL})</span>
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-slate-600" />
                  )}
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">{currentUser.displayName || 'Guardian'}</p>
                    <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignInWithGoogle();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-800 border border-slate-300 hover:bg-slate-50"
              >
                <LogIn className="w-4 h-4 text-emerald-700" />
                <span>জিমেইল দিয়ে সাইন-ইন করুন</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmissionModal();
              }}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md text-center"
            >
              অনলাইনে ভর্তি আবেদন করুন
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
