/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  ArrowUp,
  Heart,
  FileText,
  Search
} from 'lucide-react';
import { SCHOOL_INFO, SUPER_ADMIN_EMAIL } from '../types';

interface FooterProps {
  onOpenAdmissionModal: () => void;
  onOpenTrackerModal: () => void;
  onOpenAdminPanel: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmissionModal,
  onOpenTrackerModal,
  onOpenAdminPanel,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: School Identity */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white leading-tight">
                  {SCHOOL_INFO.nameBn}
                </h3>
                <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  {SCHOOL_INFO.nameEn}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              &ldquo;{SCHOOL_INFO.slogan1}&rdquo;
            </p>
            <p className="text-xs text-slate-400 italic">
              &ldquo;{SCHOOL_INFO.slogan2}&rdquo;
            </p>

            <div className="pt-2 text-xs text-slate-400 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{SCHOOL_INFO.address}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              প্রয়োজনীয় লিংক
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">আমাদের পরিচিতি ও লক্ষ্য</a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-emerald-400 transition-colors">ক্যাম্পাস ও আধুনিক সুবিধা</a>
              </li>
              <li>
                <a href="#classes" className="hover:text-emerald-400 transition-colors">শ্রেণিসমূহ (নার্সারি - ৫ম)</a>
              </li>
              <li>
                <a href="#notice" className="hover:text-emerald-400 transition-colors">ভর্তি নির্দেশিকা ২০২৭</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">যোগাযোগ ও লোকেশন</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Online Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5">
              অনলাইন পোর্টাল
            </h4>
            <div className="space-y-3">
              <button
                onClick={onOpenAdmissionModal}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-800 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>অনলাইন ভর্তি আবেদন</span>
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-sm">
                  ২০২৭
                </span>
              </button>

              <button
                onClick={onOpenTrackerModal}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-800 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-teal-400" />
                  <span>আবেদন যাচাই / ট্র্যাকার</span>
                </span>
                <span className="text-[10px] text-slate-500">লাইভ</span>
              </button>

              <button
                onClick={onOpenAdminPanel}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-amber-300 border border-slate-800 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>অ্যাডমিন ড্যাশবোর্ড</span>
                </span>
                <span className="text-[10px] text-slate-500">লগইন</span>
              </button>
            </div>
          </div>

          {/* Col 4: Hotlines & Admission Session */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2.5">
              ভর্তি হটলাইন
            </h4>
            <div className="space-y-3 text-xs">
              <a 
                href="tel:01715844170" 
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">পরিচালক</div>
                  <div className="text-sm font-bold text-white">01715-844170</div>
                </div>
              </a>

              <a 
                href="tel:01780678956" 
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">শিক্ষক</div>
                  <div className="text-sm font-bold text-white">01780-678956</div>
                </div>
              </a>

              <p className="text-[11px] text-slate-500 mt-2">
                সকাল ৮:০০ টা হতে বিকেল ৪:০০ টা (সার্বক্ষণিক খোলা)
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright and back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {SCHOOL_INFO.nameBn} ({SCHOOL_INFO.nameEn}), বদলগাছী, নওগাঁ। সর্বস্বত্ব সংরক্ষিত।
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">
              সুপার অ্যাডমিন: <code>{SUPER_ADMIN_EMAIL}</code>
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="উপরে যান"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
