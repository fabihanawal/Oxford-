/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Tv, 
  Dribbble, 
  Palette, 
  BookMarked, 
  ShieldCheck, 
  Sparkles, 
  Laptop, 
  Award,
  Heart,
  Droplet
} from 'lucide-react';

export const Facilities: React.FC = () => {
  const facilitiesList = [
    {
      icon: <Tv className="w-6 h-6 text-emerald-600" />,
      title: 'আধুনিক শ্রেণিকক্ষে পাঠদান',
      desc: 'শিশুদের আকৃষ্ট করতে অডিও-ভিজ্যুয়াল ডিজিটাল প্রজেক্টর ও মাল্টিমিডিয়া পাঠদান পদ্ধতি। এতে শিশুরা সহজে ও আনন্দের সাথে যে কোনো বিষয় আয়ত্ত করতে পারে।'
    },
    {
      icon: <Dribbble className="w-6 h-6 text-amber-600" />,
      title: 'খেলাধুলা ও শারীরিক বিকাশ',
      desc: 'শিশুর মেধার পাশাপাশি শারীরিক সুস্থতার জন্য প্রশস্ত খেলার পরিবেশ, দৌড়ঝাঁপ, ইনডোর বোর্ড গেমস ও বার্ষিক আকর্ষণীয় ক্রীড়া প্রতিযোগিতা।'
    },
    {
      icon: <Palette className="w-6 h-6 text-rose-600" />,
      title: 'সৃজনশীল কার্যক্রম ও সাংস্কৃতিক উৎসব',
      desc: 'চিত্রাঙ্কন, সুন্দর হাতের লেখা, ছড়া আবৃত্তি, ক্বেরাত, বিতর্ক প্রতিযোগিতা ও জাতীয় দিবস সমূহে বর্ণাঢ্য সাংস্কৃতিক আয়োজনে শিক্ষার্থীদের অংশগ্রহণ।'
    },
    {
      icon: <BookMarked className="w-6 h-6 text-indigo-600" />,
      title: 'সমৃদ্ধ গ্রন্থাগার ও কম্পিউটার পরিচিতি',
      desc: 'ছোটদের উপযোগী রূপকথা, বিজ্ঞান কল্পকাহিনি ও নীতিকথার বইয়ের সমৃদ্ধ শিশু পাঠাগার এবং প্রাথমিক আইসিটি ও কম্পিউটার বেসিক প্রশিক্ষণ।'
    },
    {
      icon: <Heart className="w-6 h-6 text-teal-600" />,
      title: 'যোগ্য ও আন্তরিক শিক্ষক মণ্ডলী',
      desc: 'উচ্চশিক্ষিত, প্রশিক্ষণপ্রাপ্ত ও শিশু মনোবিজ্ঞান সম্পর্কে অভিজ্ঞ শিক্ষক-শিক্ষিকা, যারা মাতৃস্নেহে ও গভীর ভালোবাসায় শিক্ষাদান করে থাকেন।'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-600" />,
      title: 'নিরাপদ ক্যাম্পাস ও বিশুদ্ধ পরিবেশ',
      desc: '২৪ ঘণ্টা সিসিটিভি ক্যামেরা নজরদারি, শিশুদের সুরক্ষায় পরিচ্ছন্ন ক্যাম্পাস, সার্বক্ষণিক বিদ্যুৎ জেনারেটর ব্যাকআপ ও বিশুদ্ধ ফিল্টারকৃত খাবার পানি।'
    }
  ];

  return (
    <section id="facilities" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>আমাদের সুবিধাসমূহ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            শিশুর সামগ্রিক বিকাশে আধুনিক সুযোগ-সুবিধা
          </h2>
          <p className="mt-3 text-base text-slate-600">
            অক্সফোর্ড মডেল স্কুলে প্রতিটি শিশুই পায় যত্নশীল পরিবেশ ও প্রতিভা বিকাশের অবারিত সুযোগ।
          </p>
        </div>

        {/* Facilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {facilitiesList.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 shadow-xs">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>অক্সফোর্ড মডেল স্কুল</span>
                <span className="text-slate-400">সুবিধা #{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
