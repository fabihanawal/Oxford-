/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  MapPin, 
  PhoneCall, 
  Clock, 
  Mail, 
  MessageCircle, 
  Sparkles, 
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { SCHOOL_INFO } from '../types';

export const ContactAndLocation: React.FC = () => {
  return (
    <section id="contact" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>যোগাযোগ ও ক্যাম্পাস অবস্থান</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            সরাসরি সাক্ষাৎ করুন বা ফোনে তথ্য নিন
          </h2>
          <p className="mt-3 text-base text-slate-600">
            বদলগাছী ডাকবাংলোর উত্তর পাশে অবস্থিত আমাদের সুপরিসর ও মনোরম ক্যাম্পাস ঘুরে আসার আমন্ত্রণ রইল।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Contact Details Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-6">
                যোগাযোগের তথ্য ও অফিসের সময়সূচি
              </h3>

              <div className="space-y-5">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      বিদ্যালয়ের ঠিকানা
                    </h4>
                    <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                      {SCHOOL_INFO.address}
                    </p>
                    <p className="text-xs text-slate-600">
                      উপজেলা: {SCHOOL_INFO.upazila}, জেলা: {SCHOOL_INFO.district}
                    </p>
                  </div>
                </div>

                {/* Director Hotline */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      পরিচালক হটলাইন
                    </h4>
                    <a 
                      href="tel:01715844170" 
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors block mt-0.5"
                    >
                      01715-844170
                    </a>
                    <span className="text-xs text-emerald-700 font-semibold">সরাসরি কথা বলুন (যেকোনো দিন)</span>
                  </div>
                </div>

                {/* Teacher Hotline */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      শিক্ষক / ভর্তি শাখা
                    </h4>
                    <a 
                      href="tel:01780678956" 
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors block mt-0.5"
                    >
                      01780-678956
                    </a>
                    <span className="text-xs text-slate-500">ভর্তি ফরম ও পাঠক্রম সংক্রান্ত তথ্য</span>
                  </div>
                </div>

                {/* Visiting Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      অফিস খোলা থাকে
                    </h4>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      প্রতিদিন সকাল ৮:০০ টা হতে বিকেল ৪:০০ টা পর্যন্ত
                    </p>
                    <p className="text-xs text-slate-500">
                      (শুক্রবার ও সরকারি ছুটির দিনেও বিশেষ ভর্তি হেল্প ডেস্ক খোলা থাকে)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">ইমেইল: info@oxfordbadalgachhi.edu.bd</span>
              <span className="font-bold text-emerald-800">অক্সফোর্ড মডেল স্কুল</span>
            </div>
          </div>

          {/* Campus Map & Guidance Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4">
                <Navigation className="w-3.5 h-3.5" />
                <span>যাতায়াত নির্দেশিকা</span>
              </div>

              <h3 className="text-2xl font-black text-white mb-3">
                ক্যাম্পাসে যেভাবে আসবেন
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                বদলগাছী উপজেলা সদরের মূল প্রাণকেন্দ্রে অবস্থিত ঐতিহাসিক ডাকবাংলোর ঠিক উত্তর পাশে আমাদের সুবিশাল ক্যাম্পাস। উপজেলা চত্বর কিংবা বাজার থেকে যেকোনো ভ্যান বা অটোরিকশায় সরাসরি ডাকবাংলো বললেই পৌঁছে যাবেন।
              </p>

              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3 text-xs mb-6">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>নওগাঁ জেলা সদর থেকে নিয়মিত বাস ও সিএনজি চলাচল রয়েছে।</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>বদলগাছী থানা ও উপজেলা নির্বাহী অফিসারের কার্যালয়ের অতি সন্নিকটে।</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>নিরাপদ, ছায়াঘেরা এবং ট্রাফিক কোলাহলমুক্ত শিশুবান্ধব পরিবেশ।</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left w-full sm:w-auto">
                <div className="text-[11px] text-slate-400">জরুরি তথ্য ও দিকনির্দেশনা</div>
                <div className="text-sm font-bold text-amber-300">01715-844170 (পরিচালক)</div>
              </div>

              <a
                href="https://maps.google.com/?q=Badalgachhi,Naogaon,Bangladesh"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>ম্যাপে অবস্থান দেখুন</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
