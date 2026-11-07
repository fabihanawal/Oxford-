/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ClipboardCheck, 
  FileText, 
  Calendar, 
  HelpCircle, 
  CheckCircle, 
  Sparkles, 
  AlertCircle,
  PhoneCall
} from 'lucide-react';
import { SCHOOL_INFO } from '../types';

interface AdmissionNoticeProps {
  onOpenAdmissionModal: () => void;
}

export const AdmissionNotice: React.FC<AdmissionNoticeProps> = ({
  onOpenAdmissionModal
}) => {
  const steps = [
    {
      num: '০১',
      title: 'অনলাইন ফরম পূরণ',
      desc: 'ওয়েবসাইটে প্রবেশ করে শিক্ষার্থীর সঠিক তথ্য ও অভিভাবকের মোবাইল নম্বর প্রদান করে আবেদন দাখিল করুন।'
    },
    {
      num: '০২',
      title: 'যাচাই ও কনফার্মেশন',
      desc: 'বিদ্যালয় কর্তৃপক্ষ প্রাপ্ত আবেদন পর্যালোচনা করে এসএমএস বা ফোনে নিশ্চিতকরণ ও সাক্ষাৎকারের তারিখ জানাবেন।'
    },
    {
      num: '০৩',
      title: 'মৌখিক পরিচিতি পর্ব',
      desc: 'নির্দিষ্ট দিনে শিক্ষার্থী ও অভিভাবকসহ বিদ্যালয়ে উপস্থিত হয়ে প্রাথমিক পরিচিতি ও মূল্যায়ন পর্বে অংশ নেওয়া।'
    },
    {
      num: '০৪',
      title: 'চূড়ান্ত ভর্তি ও পাঠদান শুরু',
      desc: 'ভর্তি ফি পরিশোধ ও প্রয়োজনীয় কাগজপত্র জমাদানের মাধ্যমে ভর্তি কার্যক্রম সম্পন্ন করে নতুন শিক্ষাবর্ষের পাঠ্যবই গ্রহণ।'
    }
  ];

  const requiredDocuments = [
    'শিক্ষার্থীর অনলাইন ডিজিটাল জন্ম নিবন্ধন সনদের রঙিন ফটোকপি',
    'শিক্ষার্থীর সদ্য তোলা ২ কপি পাসপোর্ট সাইজের রঙিন ছবি',
    'পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) স্পষ্ট ফটোকপি',
    'অভিভাবকের কার্যকর সচল মোবাইল নম্বর (এসএমএস ও যোগাযোগের জন্য)',
    'পূর্বে অন্য প্রতিষ্ঠানে পড়লে সংশ্লিষ্ট শ্রেণির প্রত্যয়নপত্র বা প্রশংসাপত্র (প্রযোজ্য ক্ষেত্রে)'
  ];

  return (
    <section id="notice" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ভর্তি নির্দেশিকা ২০২৭</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            সহজ ৪টি ধাপে অনলাইনে ভর্তি সম্পন্ন করুন
          </h2>
          <p className="mt-3 text-base text-slate-600">
            অক্সফোর্ড মডেল স্কুলে আপনার সন্তানের উজ্জ্বল ভবিষ্যতের সূচনা হোক এখনই।
          </p>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="text-4xl font-black text-emerald-100 group-hover:text-emerald-200 transition-colors absolute top-3 right-4">
                {step.num}
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-sm">
                {idx + 1}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Required Documents & Call to Action box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span>ভর্তির সময় প্রয়োজনীয় কাগজপত্র</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              অনলাইন আবেদন নিশ্চিত হওয়ার পর চূড়ান্ত ভর্তির সময় প্রধান কার্যালয়ে নিম্নলিখিত কাগজপত্রসমূহ জমা দিতে হবে:
            </p>

            <ul className="space-y-3">
              {requiredDocuments.map((doc, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>বিশেষ দ্রষ্টব্য:</strong> আসন সংখ্যা সীমিত থাকায় আবেদনের ক্রমানুসারে আসন বরাদ্দ দেওয়া হবে। কোনো তথ্য অসম্পূর্ণ থাকলে আবেদন বাতিল বলে গণ্য হতে পারে।
              </p>
            </div>
          </div>

          {/* Quick Apply & Help Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-amber-300 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>সরাসরি ভর্তি হেল্পলাইন</span>
              </div>
              <h3 className="text-2xl font-black mb-3 text-white">
                যেকোনো তথ্যের জন্য কল করুন
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm mb-6 leading-relaxed">
                ভর্তি সংক্রান্ত বিস্তারিত জানতে বা ফর্ম পূরণে সহযোগিতার জন্য সরাসরি আমাদের সাথে ফোনে যোগাযোগ করতে পারেন।
              </p>

              <div className="space-y-3 mb-6">
                <a 
                  href="tel:01715844170"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white font-semibold text-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-emerald-200">পরিচালক</div>
                    <div>01715-844170</div>
                  </div>
                </a>

                <a 
                  href="tel:01780678956"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white font-semibold text-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-400 text-slate-900 flex items-center justify-center font-bold">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-emerald-200">শিক্ষক</div>
                    <div>01780-678956</div>
                  </div>
                </a>
              </div>
            </div>

            <button
              onClick={onOpenAdmissionModal}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-md text-center transition-colors cursor-pointer"
            >
              এখনই অনলাইন আবেদন করুন
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
