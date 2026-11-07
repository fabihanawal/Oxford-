/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User as UserIcon, 
  BookOpen, 
  Phone, 
  MapPin, 
  LogIn, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Calendar,
  Sparkles,
  Heart,
  FileText,
  Lock,
  Camera,
  UploadCloud,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from 'firebase/auth';
import { 
  AdmissionApplication, 
  AdmissionClass, 
  CLASS_OPTIONS, 
  SCHOOL_INFO 
} from '../types';
import { submitAdmissionApplication, compressImageFile } from '../firebase/config';

interface AdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSignInWithGoogle: () => void;
  preselectedClass?: AdmissionClass;
  onSuccessSubmission: (application: AdmissionApplication) => void;
}

export const AdmissionFormModal: React.FC<AdmissionFormModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSignInWithGoogle,
  preselectedClass,
  onSuccessSubmission,
}) => {
  const [formData, setFormData] = useState({
    studentNameBn: '',
    studentNameEn: '',
    gender: 'male' as 'male' | 'female' | 'other',
    dateOfBirth: '',
    bloodGroup: 'A+',
    admissionClass: (preselectedClass || 'Nursery') as AdmissionClass,
    previousSchool: '',
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    guardianPhone: '',
    villageRoad: '',
    postOffice: '',
    upazila: 'বদলগাছী',
    district: 'নওগাঁ',
    notes: '',
  });

  // Photo URLs
  const [studentPhotoUrl, setStudentPhotoUrl] = useState<string>('');
  const [fatherPhotoUrl, setFatherPhotoUrl] = useState<string>('');
  const [motherPhotoUrl, setMotherPhotoUrl] = useState<string>('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<string | null>(null);

  const studentFileInputRef = useRef<HTMLInputElement>(null);
  const fatherFileInputRef = useRef<HTMLInputElement>(null);
  const motherFileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedClass) {
      setFormData(prev => ({ ...prev, admissionClass: preselectedClass }));
    }
  }, [preselectedClass]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // If father's phone is updated and guardian phone is blank, sync it
    if (name === 'fatherPhone' && !formData.guardianPhone) {
      setFormData(prev => ({ ...prev, guardianPhone: value }));
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'student' | 'father' | 'mother') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG বা WEBP) নির্বাচন করুন।');
      return;
    }

    // Limit original file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('ছবির সাইজ ১০ মেগাবাইটের বেশি হতে পারবে না।');
      return;
    }

    setIsProcessingPhoto(type);
    setErrorMessage(null);

    try {
      // Compress to optimal passport size thumbnail
      const compressed = await compressImageFile(file, 400, 400, 0.78);
      if (type === 'student') setStudentPhotoUrl(compressed);
      if (type === 'father') setFatherPhotoUrl(compressed);
      if (type === 'mother') setMotherPhotoUrl(compressed);
    } catch (err) {
      console.error('Photo compression error:', err);
      setErrorMessage('ছবি প্রক্রিয়া করতে ব্যর্থ হয়েছে। অনুগ্রহ করে অন্য ছবি চেষ্টা করুন।');
    } finally {
      setIsProcessingPhoto(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation checks
    if (!currentUser) {
      setErrorMessage('ভর্তি আবেদন সম্পন্ন করতে অনুগ্রহ করে আপনার গুগল (Gmail) অ্যাকাউন্ট দিয়ে সাইন-ইন করুন।');
      return;
    }

    if (!formData.studentNameBn.trim() || !formData.studentNameEn.trim()) {
      setErrorMessage('শিক্ষার্থীর নাম (বাংলা ও ইংরেজি উভয় ভাষায়) প্রদান করা আবশ্যক।');
      return;
    }

    if (!formData.admissionClass) {
      setErrorMessage('আবেদনের শ্রেণি নির্বাচন করুন।');
      return;
    }

    const primaryPhone = formData.guardianPhone.trim() || formData.fatherPhone.trim() || formData.motherPhone.trim();
    if (!primaryPhone || primaryPhone.length < 10) {
      setErrorMessage('অনুগ্রহ করে অভিভাবকের সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate readable application number: OMS-2027-XXXX
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      const appNumber = `OMS-2027-${randomSeq}`;
      const now = new Date().toISOString();

      const newApp: Omit<AdmissionApplication, 'id'> = {
        applicationNumber: appNumber,
        studentNameBn: formData.studentNameBn.trim(),
        studentNameEn: formData.studentNameEn.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || '2021-01-01',
        bloodGroup: formData.bloodGroup,
        admissionClass: formData.admissionClass,
        previousSchool: formData.previousSchool.trim(),
        
        // Attached photos
        studentPhotoUrl: studentPhotoUrl || undefined,
        fatherPhotoUrl: fatherPhotoUrl || undefined,
        motherPhotoUrl: motherPhotoUrl || undefined,

        fatherName: formData.fatherName.trim() || 'প্রযোজ্য নয়',
        fatherOccupation: formData.fatherOccupation.trim() || 'ব্যবসায়ী/চাকুরিজীবী',
        fatherPhone: formData.fatherPhone.trim() || primaryPhone,
        motherName: formData.motherName.trim() || 'প্রযোজ্য নয়',
        motherOccupation: formData.motherOccupation.trim() || 'গৃহিণী',
        motherPhone: formData.motherPhone.trim(),
        guardianPhone: primaryPhone,
        guardianEmail: currentUser.email || 'guardian@gmail.com',
        applicantUid: currentUser.uid,
        villageRoad: formData.villageRoad.trim() || 'ডাকবাংলো সংলগ্ন',
        postOffice: formData.postOffice.trim() || 'বদলগাছী',
        upazila: formData.upazila.trim() || 'বদলগাছী',
        district: formData.district.trim() || 'নওগাঁ',
        notes: formData.notes.trim(),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };

      const savedApp = await submitAdmissionApplication(newApp);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if blocked
      }

      setIsSubmitting(false);
      onSuccessSubmission(savedApp);
      onClose();
    } catch (err: any) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
      setErrorMessage('আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে পুনরায় চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 font-bold border border-white/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full">
                  ২০২৭ শিক্ষাবর্ষ
                </span>
                <span className="text-xs text-emerald-200">অনলাইন ভর্তি আবেদন</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {SCHOOL_INFO.nameBn}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Authentication Notice Box */}
        <div className="px-6 pt-5 pb-2">
          {!currentUser ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    অভিভাবকের জিমেইল সাইন-ইন আবশ্যক
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    আবেদনপত্রের নিরাপত্তা ও পরবর্তীতে আবেদনের অবস্থা ট্র্যাকিংয়ের জন্য জিমেইল লগইন প্রয়োজন।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onSignInWithGoogle}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 shadow-xs hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>জিমেইল দিয়ে সাইন-ইন করুন</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="w-7 h-7 rounded-full border border-emerald-400" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                )}
                <div>
                  <span className="font-bold text-emerald-950">যাচাইকৃত অভিভাবক: </span>
                  <span className="text-emerald-800">{currentUser.displayName || 'Guardian'}</span>
                  <span className="text-emerald-600 ml-1">({currentUser.email})</span>
                </div>
              </div>
              <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                কানেক্টেড
              </span>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Section 1: শিক্ষার্থীর তথ্য ও ছবি */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center justify-between text-sm font-bold text-emerald-800 mb-4 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-emerald-600" />
                <span>১. শিক্ষার্থীর সাধারণ তথ্য ও ছবি</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                পাসপোর্ট সাইজ ছবি সংযুক্ত করুন
              </span>
            </div>

            {/* Student Photo Upload Card */}
            <div className="mb-5 p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-200 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-28 h-32 rounded-xl border border-slate-300 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                {studentPhotoUrl ? (
                  <img src={studentPhotoUrl} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <Camera className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                    <span className="text-[10px] font-medium block">পাসপোর্ট সাইজ ছবি</span>
                  </div>
                )}

                {isProcessingPhoto === 'student' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold">
                    প্রসেস হচ্ছে...
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  শিক্ষার্থীর ছবি আপলোড (Student's Photo)
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  পরিষ্কার ও সদ্য তোলা পাসপোর্ট সাইজের ছবি নির্বাচন করুন। মোবাইল ক্যামেরা বা গ্যালারি থেকে যেকোনো ফরম্যাট (JPG/PNG) চলবে।
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <input
                    ref={studentFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'student')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => studentFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{studentPhotoUrl ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}</span>
                  </button>

                  {studentPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setStudentPhotoUrl('')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছে ফেলুন</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষার্থীর নাম (বাংলায়) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentNameBn"
                  required
                  placeholder="যেমন: তাহমিদ হাসান"
                  value={formData.studentNameBn}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student's Name (In English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentNameEn"
                  required
                  placeholder="e.g. Tahmid Hasan"
                  value={formData.studentNameEn}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ভর্তির শ্রেণি <span className="text-rose-500">*</span>
                </label>
                <select
                  name="admissionClass"
                  value={formData.admissionClass}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-emerald-900"
                >
                  {CLASS_OPTIONS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.labelBn} ({c.ageRange})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  লিঙ্গ <span className="text-rose-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="male">ছাত্র (ছেলে)</option>
                  <option value="female">ছাত্রী (মেয়ে)</option>
                  <option value="other">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জন্ম তারিখ (Date of Birth)
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  রক্তের গ্রুপ (Blood Group)
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                  <option value="জানা নেই">জানা নেই</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পূর্ববর্তী বিদ্যালয়ের নাম (প্রযোজ্য ক্ষেত্রে)
                </label>
                <input
                  type="text"
                  name="previousSchool"
                  placeholder="পূর্বে কোনো স্কুলে পড়ে থাকলে নাম উল্লেখ করুন"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: পিতা-মাতা ও অভিভাবকের তথ্য এবং ছবি */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center justify-between text-sm font-bold text-teal-800 mb-4 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-600" />
                <span>২. পিতা, মাতা ও অভিভাবকের তথ্য ও ছবি</span>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-md">
                পিতা ও মাতার ছবি (ঐচ্ছিক/সুবিধাজনক)
              </span>
            </div>

            {/* Parents Photo Upload Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              
              {/* Father Photo Box */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="relative w-16 h-20 rounded-xl border border-slate-300 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                  {fatherPhotoUrl ? (
                    <img src={fatherPhotoUrl} alt="Father" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-slate-300" />
                  )}
                  {isProcessingPhoto === 'father' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[9px]">
                      ...
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800">পিতার ছবি (Father)</div>
                  <div className="text-[10px] text-slate-500 truncate mb-1.5">পাসপোর্ট সাইজ বা স্পষ্ট ছবি</div>
                  
                  <input
                    ref={fatherFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'father')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fatherFileInputRef.current?.click()}
                      className="text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 cursor-pointer"
                    >
                      {fatherPhotoUrl ? 'পরিবর্তন' : 'ছবি সংযুক্ত'}
                    </button>
                    {fatherPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setFatherPhotoUrl('')}
                        className="text-[11px] text-rose-600 hover:underline"
                      >
                        মুছুন
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mother Photo Box */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="relative w-16 h-20 rounded-xl border border-slate-300 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                  {motherPhotoUrl ? (
                    <img src={motherPhotoUrl} alt="Mother" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-slate-300" />
                  )}
                  {isProcessingPhoto === 'mother' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[9px]">
                      ...
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800">মাতার ছবি (Mother)</div>
                  <div className="text-[10px] text-slate-500 truncate mb-1.5">পাসপোর্ট সাইজ বা স্পষ্ট ছবি</div>
                  
                  <input
                    ref={motherFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'mother')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => motherFileInputRef.current?.click()}
                      className="text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 cursor-pointer"
                    >
                      {motherPhotoUrl ? 'পরিবর্তন' : 'ছবি সংযুক্ত'}
                    </button>
                    {motherPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setMotherPhotoUrl('')}
                        className="text-[11px] text-rose-600 hover:underline"
                      >
                        মুছুন
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পিতার নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  required
                  placeholder="পিতার নাম লিখুন"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পিতার পেশা
                </label>
                <input
                  type="text"
                  name="fatherOccupation"
                  placeholder="যেমন: ব্যবসা / চাকরি / শিক্ষকতা"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মাতার নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="motherName"
                  required
                  placeholder="মাতার নাম লিখুন"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মাতার পেশা
                </label>
                <input
                  type="text"
                  name="motherOccupation"
                  placeholder="যেমন: গৃহিণী / শিক্ষিকা / চাকুরিজীবী"
                  value={formData.motherOccupation}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  অভিভাবকের প্রধান মোবাইল নম্বর (SMS যোগাযোগের জন্য) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="guardianPhone"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিকল্প যোগাযোগ নম্বর (যদি থাকে)
                </label>
                <input
                  type="tel"
                  name="fatherPhone"
                  placeholder="01XXXXXXXXX"
                  value={formData.fatherPhone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: ঠিকানা ও অন্যান্য */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-4 pb-2 border-b border-slate-200">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>৩. বর্তমান ও স্থায়ী ঠিকানা</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  গ্রাম / মহল্লা / বাড়ি নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="villageRoad"
                  required
                  placeholder="যেমন: ডাকবাংলো সংলগ্ন, সদর পাড়া"
                  value={formData.villageRoad}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ডাকঘর (Post Office)
                </label>
                <input
                  type="text"
                  name="postOffice"
                  placeholder="যেমন: বদলগাছী"
                  value={formData.postOffice}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  উপজেলা
                </label>
                <input
                  type="text"
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জেলা
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিশেষ মন্তব্য বা শিক্ষার্থীর কোনো বিশেষ আগ্রহ (ঐচ্ছিক)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="যেমন: শিশু ছবি আঁকা পছন্দ করে বা কোনো বিশেষ স্বাস্থ্যগত বিষয় থাকলে জানাতে পারেন"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
            <p className="text-[11px] text-slate-500">
              * তথ্য জমাদানের পর আপনার জন্য একটি অনলাইন ভর্তি স্লিপ প্রদান করা হবে।
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                বাতিল
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition-all shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <span>জমা দেওয়া হচ্ছে...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>আবেদনপত্র দাখিল করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
