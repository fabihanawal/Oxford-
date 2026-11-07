/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Users, 
  GraduationCap 
} from 'lucide-react';
import { AdmissionClass, CLASS_OPTIONS } from '../types';

interface ClassesOfferedProps {
  onSelectClassAndApply: (cls: AdmissionClass) => void;
}

export const ClassesOffered: React.FC<ClassesOfferedProps> = ({
  onSelectClassAndApply
}) => {
  const [selectedClassId, setSelectedClassId] = useState<AdmissionClass>('Nursery');

  const selectedClass = CLASS_OPTIONS.find(c => c.id === selectedClassId) || CLASS_OPTIONS[0];

  const classCurriculumDetails: Record<AdmissionClass, {
    subjects: string[];
    focus: string;
    activities: string[];
  }> = {
    Nursery: {
      subjects: ['ছবির বর্ণমালা (বাংলা ও ইংরেজি)', 'সংখ্যা গণনা (১-২০)', 'সাধারণ জ্ঞান ও নীতিশিক্ষা', 'রং ও চিত্রাঙ্কন'],
      focus: 'ভীতিহীন পরিবেশে সামাজিকীকরণ, বর্ণপরিচয় ও আনন্দময় বিনোদন।',
      activities: ['ছড়া গান', 'পুতুল ও ব্লক খেলা', 'হাতের পেশির সমন্বয় অনুশীলন', 'আচরণ শিক্ষা']
    },
    KG: {
      subjects: ['বাংলা সহজ শব্দ ও বাক্য', 'ইংরেজি বর্ণমালা ও প্রাথমিক বানান', 'প্রাথমিক গণিত ও নামতা', 'ড্রয়িং ও ক্যালিগ্রাফি'],
      focus: 'শব্দার্থ ও প্রাথমিক বাক্যগঠন, স্পষ্ট উচ্চারণ ও প্রাথমিক সংখ্যার খেলা।',
      activities: ['শব্দ ধাঁধা', 'ইংরেজি রাইমস আবৃত্তি', 'সহজ ছবি আঁকা', 'দলগত কাজ']
    },
    'Class 1': {
      subjects: ['আমার বাংলা বই', 'English for Today', 'প্রাথমিক গণিত', 'পরিবেশ পরিচিতি ও ধর্ম শিক্ষা'],
      focus: 'সুন্দর ও দ্রুত হস্তলিপি, মৌলিক যোগ-বিয়োগ এবং পাঠ্যপুস্তকের প্রতিটি অধ্যায়ের পরিষ্কার ধারণা।',
      activities: ['সাপ্তাহিক হস্তলিপি প্রতিযোগিতা', 'মানসাঙ্ক অনুশীলন', 'নৈতিক গল্প পাঠ']
    },
    'Class 2': {
      subjects: ['বাংলা পঠন ও ব্যাকরণ', 'English Grammar & Vocabulary', 'গণিত ও জ্যামিতি বেসিক', 'সাধারণ জ্ঞান ও কম্পিউটার'],
      focus: 'স্বাধীনভাবে পঠন ও লিখন দক্ষতা এবং দ্রুত গণনার কৌশল।',
      activities: ['বানান প্রতিযোগিতা (Spelling Bee)', 'সৃজনশীল অনুচ্ছেদ লিখন', 'বিজ্ঞান বিষয়ক প্রাথমিক কৌতূহল']
    },
    'Class 3': {
      subjects: ['বাংলা সাহিত্য ও রচনা', 'ইংরেজি কথোপকথন ও ব্যাকরণ', 'প্রাথমিক গণিত', 'প্রাথমিক বিজ্ঞান ও বাংলাদেশ ও বিশ্বপরিচয়'],
      focus: 'যুক্তিবোধ ও বিজ্ঞানমনস্কতা গঠন, ইংরেজি সহজ কথোপকথন ও আত্মবিশ্বাস।',
      activities: ['ছোটদের কুইজ প্রতিযোগিতা', 'বিতর্কের প্রাথমিক নিয়মাবলী', 'দেওয়াল পত্রিকা তৈরি']
    },
    'Class 4': {
      subjects: ['বাংলা', 'English', 'গণিত', 'বাংলাদেশ ও বিশ্বপরিচয়', 'প্রাথমিক বিজ্ঞান', 'ধর্ম ও নৈতিক শিক্ষা'],
      focus: 'উচ্চতর পাঠ্যক্রমের জন্য মজবুত ভিত্তি ও নিয়মিত সৃজনশীল মূল্যায়ন।',
      activities: ['বিজ্ঞান প্রজেক্ট তৈরি', 'সাধারণ জ্ঞান চর্চা', 'ভাষাশিক্ষা ক্লাব']
    },
    'Class 5': {
      subjects: ['বাংলা', 'ইংরেজি', 'গণিত', 'বাংলাদেশ ও বিশ্বপরিচয়', 'বিজ্ঞান', 'ধর্ম ও নৈতিক শিক্ষা'],
      focus: 'সমাপনী স্তরের পূর্ণাঙ্গ প্রস্তুতি, মডেল টেস্ট ও উচ্চ মাধ্যমিকে প্রবেশের শীর্ষ প্রস্তুতি।',
      activities: ['অধ্যায়ভিত্তিক মক টেস্ট', 'বিশেষ কাউন্সিলিং', 'মেধা অন্বেষণ পরীক্ষা']
    }
  };

  const details = classCurriculumDetails[selectedClass.id];

  return (
    <section id="classes" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>শিক্ষাবর্ষ ২০২৭</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            নার্সারি থেকে ৫ম শ্রেণি পর্যন্ত শিক্ষাক্রম
          </h2>
          <p className="mt-3 text-base text-slate-600">
            প্রতিটি শ্রেণির জন্য রয়েছে বয়সভিত্তিক সুপরিকল্পিত পাঠদান কাঠামো ও নিবিড় তত্ত্বাবধান।
          </p>
        </div>

        {/* Class Selection Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {CLASS_OPTIONS.map((cls) => {
            const isSelected = cls.id === selectedClassId;
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cls.labelBn}
              </button>
            );
          })}
        </div>

        {/* Selected Class Highlight Box */}
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-sm max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-emerald-100/80">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-950">
                  {selectedClass.labelBn}
                </span>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                  বয়সসীমা: {selectedClass.ageRange}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2 font-medium">
                {selectedClass.desc}
              </p>
            </div>

            <button
              onClick={() => onSelectClassAndApply(selectedClass.id)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{selectedClass.labelBn}-তে আবেদন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Subjects */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 text-emerald-800">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>মূল পাঠ্যবিষয়সমূহ</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {details.subjects.map((subj, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{subj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Focus */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 text-teal-800">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                <span>শ্রেণির প্রধান লক্ষ্য</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {details.focus}
              </p>
              <div className="mt-4 p-2.5 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 font-semibold">
                ✓ দক্ষ শিক্ষক দ্বারা ব্যক্তিগত যত্ন ও নিবিড় মূল্যায়ন
              </div>
            </div>

            {/* Extra curricular / activities */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>সহশিক্ষা ও ব্যবহারিক কার্যক্রম</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {details.activities.map((act, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
