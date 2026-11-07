/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle, 
  Clock, 
  XCircle, 
  GraduationCap, 
  Phone, 
  Calendar, 
  MapPin, 
  Mail,
  Download
} from 'lucide-react';
import { AdmissionApplication, SCHOOL_INFO } from '../types';

interface ApplicationSlipModalProps {
  application: AdmissionApplication | null;
  onClose: () => void;
}

export const ApplicationSlipModal: React.FC<ApplicationSlipModalProps> = ({
  application,
  onClose,
}) => {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>ভর্তি কনফার্ম / অনুমোদিত</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>বাতিলকৃত</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>পর্যালোচনাধীন / অপেক্ষমাণ</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="no-print bg-slate-100 px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">ভর্তি আবেদন পত্র ও রসিদ</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
              সফলভাবে প্রাপ্ত
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / সেভ করুন</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Admission Slip Content */}
        <div id="printable-admission-slip" className="p-6 sm:p-8 bg-white text-slate-900">
          
          {/* Slip Header with School Crest */}
          <div className="text-center border-b-2 border-emerald-800 pb-5 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-emerald-900 tracking-tight leading-none">
                  {SCHOOL_INFO.nameBn}
                </h1>
                <p className="text-xs font-bold text-emerald-700 tracking-wider uppercase mt-0.5">
                  {SCHOOL_INFO.nameEn}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              {SCHOOL_INFO.address}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              হটলাইন: 01715-844170, 01780-678956
            </p>

            <div className="inline-block mt-3 px-4 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-full font-bold text-xs uppercase tracking-wide">
              ভর্তি আবেদন স্লিপ — শিক্ষাবর্ষ ২০২৭
            </div>
          </div>

          {/* Application ID & Status Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                আবেদন ট্র্যাকিং নম্বর (Application ID)
              </span>
              <span className="text-xl font-mono font-black text-emerald-900">
                {application.applicationNumber}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                আবেদনের বর্তমান অবস্থা
              </span>
              {getStatusBadge(application.status)}
            </div>
          </div>

          {/* Student Profile & Photo Header Card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 mb-6">
            <div className="w-24 h-28 rounded-xl border-2 border-emerald-700 bg-white shadow-xs overflow-hidden flex items-center justify-center shrink-0">
              {application.studentPhotoUrl ? (
                <img 
                  src={application.studentPhotoUrl} 
                  alt={application.studentNameEn} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <GraduationCap className="w-8 h-8 mx-auto text-slate-300" />
                  <span className="text-[9px] block text-slate-400 mt-1">ছবি সংযুক্ত নেই</span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                ভর্তির শ্রেণি: {application.admissionClass}
              </span>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {application.studentNameBn}
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                {application.studentNameEn}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 mt-2">
                <span>লিঙ্গ: <strong>{application.gender === 'male' ? 'ছাত্র' : application.gender === 'female' ? 'ছাত্রী' : 'অন্যান্য'}</strong></span>
                <span>•</span>
                <span>রক্তের গ্রুপ: <strong>{application.bloodGroup || 'N/A'}</strong></span>
                <span>•</span>
                <span>জন্ম তারিখ: <strong>{application.dateOfBirth || 'N/A'}</strong></span>
              </div>
            </div>

            {/* Parents mini thumbnail previews */}
            {(application.fatherPhotoUrl || application.motherPhotoUrl) && (
              <div className="hidden sm:flex flex-col gap-2 shrink-0 border-l border-emerald-200/80 pl-4 text-center">
                {application.fatherPhotoUrl && (
                  <div>
                    <img 
                      src={application.fatherPhotoUrl} 
                      alt="Father" 
                      className="w-10 h-12 rounded-lg object-cover border border-slate-300 mx-auto" 
                    />
                    <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">পিতা</span>
                  </div>
                )}
                {application.motherPhotoUrl && (
                  <div>
                    <img 
                      src={application.motherPhotoUrl} 
                      alt="Mother" 
                      className="w-10 h-12 rounded-lg object-cover border border-slate-300 mx-auto" 
                    />
                    <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">মাতা</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Student Dossier Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6 text-xs sm:text-sm">
            <div className="bg-emerald-800 text-white font-bold px-4 py-2 text-xs">
              শিক্ষার্থীর প্রাথমিক বিবরণ
            </div>
            
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="w-1/3 py-2.5 px-4 bg-slate-50 font-semibold text-slate-600">শিক্ষার্থীর নাম (বাংলা)</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{application.studentNameBn}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-600">Student Name (English)</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{application.studentNameEn}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-600">ভর্তির শ্রেণি</td>
                  <td className="py-2.5 px-4 font-black text-emerald-800">{application.admissionClass}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-600">লিঙ্গ ও রক্তের গ্রুপ</td>
                  <td className="py-2.5 px-4 text-slate-800">
                    {application.gender === 'male' ? 'ছাত্র' : application.gender === 'female' ? 'ছাত্রী' : 'অন্যান্য'} 
                    {application.bloodGroup ? ` • রক্তের গ্রুপ: ${application.bloodGroup}` : ''}
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-600">পিতার নাম ও পেশা</td>
                  <td className="py-2.5 px-4 text-slate-800">{application.fatherName} ({application.fatherOccupation || 'ব্যবসায়ী/চাকুরিজীবী'})</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-600">মাতার নাম ও পেশা</td>
                  <td className="py-2.5 px-4 text-slate-800">{application.motherName} ({application.motherOccupation || 'গৃহিণী'})</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-600">অভিভাবকের মোবাইল</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{application.guardianPhone}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-600">অভিভাবকের জিমেইল</td>
                  <td className="py-2.5 px-4 text-slate-700">{application.guardianEmail}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-600">বর্তমান ঠিকানা</td>
                  <td className="py-2.5 px-4 text-slate-800">
                    {application.villageRoad}, {application.postOffice}, {application.upazila}, {application.district}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Admin Feedback / Remarks if present */}
          {(application.adminRemarks || application.interviewDate) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-xs sm:text-sm">
              <h4 className="font-bold text-amber-950 mb-1">কর্তৃপক্ষের নির্দেশনা ও সাক্ষাৎকার:</h4>
              {application.interviewDate && (
                <p className="text-amber-900 font-semibold">
                  📅 নির্ধারিত সাক্ষাৎকারের সময়: {application.interviewDate}
                </p>
              )}
              {application.adminRemarks && (
                <p className="text-amber-800 mt-1">
                  মন্তব্য: {application.adminRemarks}
                </p>
              )}
            </div>
          )}

          {/* Instructions for parents */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1 mb-8">
            <p className="font-bold text-slate-800">অভিভাবকদের জন্য নির্দেশনাবলী:</p>
            <p>১. এই স্লিপটি সংরক্ষণ করুন অথবা স্ক্রিনশট নিয়ে রাখুন।</p>
            <p>২. সাক্ষাৎকারের দিন শিক্ষার্থীর ডিজিটাল জন্ম নিবন্ধন সনদ ও ২ কপি পাসপোর্ট সাইজ ছবি সাথে আনতে হবে।</p>
            <p>৩. আবেদনের সর্বশেষ অবস্থা জানতে ওয়েবসাইটের &quot;আবেদন যাচাই&quot; বাটনে ক্লিক করে মোবাইল বা আবেদন নম্বর দিয়ে ট্র্যাকিং করুন।</p>
          </div>

          {/* Signatures Footer */}
          <div className="pt-8 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200">
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <span>অভিভাবকের স্বাক্ষর</span>
            </div>

            <div className="text-center text-[10px] text-slate-400">
              আবেদনের সময়: {new Date(application.createdAt).toLocaleDateString('bn-BD')}
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-emerald-800 mb-1" />
              <span className="font-bold text-emerald-900">ভর্তি শাখা / অধ্যক্ষ</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <p className="text-xs text-slate-500">
            অক্সফোর্ড মডেল স্কুল, বদলগাছী, নওগাঁ
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
