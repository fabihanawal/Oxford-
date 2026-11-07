/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Target, 
  Eye, 
  GraduationCap, 
  Users, 
  Smile, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import { SCHOOL_INFO } from '../types';

export const AboutAndValues: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>আমাদের দর্শন ও লক্ষ্য</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            গুণগত শিক্ষা ও ভবিষ্যৎ নেতৃত্বের মজবুত ভিত
          </h2>
          <p className="mt-3 text-base text-slate-600">
            নওগাঁর বদলগাছীতে আধুনিক শিক্ষাদান পদ্ধতি ও শিশুবান্ধব পরিবেশে গড়ে তোলা একটি অনন্য শিক্ষালয়।
          </p>
        </div>

        {/* Story & Vision Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div className="space-y-6">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-emerald-900 font-bold text-xl mb-3">
                <Target className="w-6 h-6 text-emerald-700" />
                <span>আমাদের লক্ষ্য (Our Mission)</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                “শিক্ষা মানেই শুধু পাঠ্যবই নয়, এটি জীবনের প্রস্তুতি।”—এই মূলমন্ত্রকে ধারণ করে প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভার বিকাশ ঘটানো, তাদের প্রযুক্তিমনস্ক ও সুনাগরিক হিসেবে গড়ে তোলা এবং নৈতিক মূল্যবোধসম্পন্ন মানুষে রূপান্তর করাই আমাদের মূল অঙ্গীকার।
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl mb-3">
                <Eye className="w-6 h-6 text-teal-600" />
                <span>আমাদের দৃষ্টিভঙ্গি (Our Vision)</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                নার্সারি থেকে ৫ম শ্রেণি পর্যন্ত শিশুর শৈশবকে আনন্দময় রেখে আনন্দের সাথে পাঠগ্রহণ নিশ্চিত করা। মুখস্থবিদ্যার বদলে বাস্তবভিত্তিক চিন্তাশক্তি, ইংরেজি ও মাতৃভাষার সঠিক প্রয়োগ এবং বিজ্ঞানমুখী মানসিকতা গঠন।
              </p>
            </div>
          </div>

          {/* Key Differentiators / Feature Points */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />
            <h3 className="text-2xl font-black text-amber-300 mb-6 flex items-center gap-2">
              <GraduationCap className="w-7 h-7" />
              <span>কেন অক্সফোর্ড মডেল স্কুল অনন্য?</span>
            </h3>

            <ul className="space-y-4 text-emerald-50 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>সীমিত আসন সংখ্যা:</strong> প্রতি শ্রেণিতে সুনির্দিষ্ট আসন যাতে শিক্ষক প্রতিটি শিশুর প্রতি গভীর যত্ন নিতে পারেন।</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>উন্নত মূল্যায়ন ব্যবস্থা:</strong> দৈনিক পড়া আদায়, সাপ্তাহিক ক্লাস টেস্ট ও প্রতি মাসে অভিভাবকদের অগ্রগতি প্রতিবেদন প্রদান।</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>ভীতিহীন আনন্দময় পাঠদান:</strong> কোনো শারীরিক বা মানসিক চাপ ছাড়াই আনন্দের মধ্য দিয়ে শিক্ষা প্রদান।</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>ইংরেজি কথন ও হাতের লেখা:</strong> নার্সারি স্তর থেকেই সঠিক উচ্চারণ, স্পোকেন ইংলিশ ও বাংলা-ইংরেজি সুন্দর হস্তলিপি প্রশিক্ষণ।</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>অভিভাবক-শিক্ষক মিথস্ক্রিয়া:</strong> প্রতি মাসে নিয়মিত মতবিনিময় সভা এবং সার্বক্ষণিক ডিজিটাল যোগাযোগ।</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-300">
              <span>📍 বদলগাছী ডাকবাংলোর উত্তর পাশে</span>
              <span className="font-bold text-amber-300">২০২৭ শিক্ষাবর্ষ</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
