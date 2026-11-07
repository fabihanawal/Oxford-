/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  HeartHandshake, 
  ShieldCheck,
  Search,
  Users
} from 'lucide-react';
import { SCHOOL_INFO } from '../types';

interface HeroProps {
  onOpenAdmissionModal: () => void;
  onOpenTrackerModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAdmissionModal,
  onOpenTrackerModal,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/60">
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* 2027 Admission Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-emerald-600/30 shadow-xs mb-6 backdrop-blur-xs">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs sm:text-sm font-bold text-emerald-900 tracking-wide">
              🎉 ২০২৭ শিক্ষাবর্ষে ভর্তি চলছে! • নার্সারি থেকে ৫ম শ্রেণি
            </span>
          </div>

          {/* School Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            <span className="text-emerald-800 drop-shadow-xs">{SCHOOL_INFO.nameBn}</span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-600 tracking-normal mt-1">
              Oxford Model School
            </span>
          </h1>

          {/* Location Badge */}
          <div className="inline-flex items-center gap-1.5 text-slate-700 bg-white/90 border border-slate-200/80 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs mb-6">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{SCHOOL_INFO.address}</span>
          </div>

          {/* Slogans */}
          <div className="bg-white/80 border border-emerald-100/90 rounded-2xl p-4 sm:p-6 shadow-sm max-w-3xl mx-auto mb-8 backdrop-blur-xs">
            <p className="text-lg sm:text-xl font-bold text-emerald-950 mb-2">
              &ldquo;{SCHOOL_INFO.slogan1}&rdquo;
            </p>
            <p className="text-sm sm:text-base text-slate-600 font-medium italic">
              &ldquo;{SCHOOL_INFO.slogan2}&rdquo;
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={onOpenAdmissionModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>অনলাইনে ভর্তি আবেদন করুন</span>
              <ArrowRight className="w-5 h-5 text-emerald-200" />
            </button>

            <button
              onClick={onOpenTrackerModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-base text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Search className="w-5 h-5 text-emerald-600" />
              <span>আবেদনের অবস্থা জানুন</span>
            </button>
          </div>

          {/* Quick Direct Hotline Contact Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-600 font-semibold mb-12">
            <span className="text-slate-400 font-normal">সরাসরি কথা বলুন:</span>
            <a 
              href="tel:01715844170" 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>পরিচালক: 01715-844170</span>
            </a>
            <a 
              href="tel:01780678956" 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>শিক্ষক: 01780-678956</span>
            </a>
          </div>

          {/* 4 Core Values extracted from Poster */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">মেধা ও মননের বিকাশ</h3>
              <p className="text-xs text-slate-500 mt-1">সৃজনশীল পাঠদান ও শিশুর আত্মবিশ্বাস বিনির্মাণ</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">নৈতিক ও মানবিক মূল্যবোধ</h3>
              <p className="text-xs text-slate-500 mt-1">সততা, শিষ্টাচার ও দেশপ্রেমিক নাগরিক হিসেবে গঠন</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">সহশিক্ষা কার্যক্রমে অংশগ্রহণ</h3>
              <p className="text-xs text-slate-500 mt-1">খেলাধুলা, বিতর্ক, চিত্রাঙ্কন ও সাংস্কৃতিক উৎসব</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">নিয়মিত মূল্যায়ন ও ব্যক্তিগত যত্ন</h3>
              <p className="text-xs text-slate-500 mt-1">প্রতিটি শিক্ষার্থীর দুর্বলতা চিহ্নিত করে বিশেষ যত্ন</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
