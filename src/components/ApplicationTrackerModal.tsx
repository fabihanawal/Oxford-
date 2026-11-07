/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Printer, 
  PhoneCall,
  Calendar,
  Sparkles
} from 'lucide-react';
import { AdmissionApplication } from '../types';
import { lookupApplication } from '../firebase/config';

interface ApplicationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApplication: (app: AdmissionApplication) => void;
}

export const ApplicationTrackerModal: React.FC<ApplicationTrackerModalProps> = ({
  isOpen,
  onClose,
  onSelectApplication,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<AdmissionApplication[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const found = await lookupApplication(searchQuery);
      setResults(found);
    } catch (e) {
      console.error('Lookup failed', e);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>কনফার্ম / অনুমোদিত</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>বাতিলকৃত</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>অপেক্ষমাণ / যাচাই চলছে</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 font-bold border border-white/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                আবেদনের অবস্থা ট্র্যাকিং
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                আবেদন ট্র্যাকিং নম্বর অথবা মোবাইল নম্বর দিয়ে অনুসন্ধান করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search input form */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="যেমন: OMS-2027-1001 অথবা 01712345678"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isSearching ? (
                  <span>খোঁজা হচ্ছে...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>খুঁজুন</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              * পরামর্শ: আপনার ভর্তি আবেদন স্লিপে উল্লেখিত নম্বর অথবা আবেদনে দেওয়া মোবাইল নম্বর ব্যবহার করুন।
            </p>
          </form>

          {/* Results list */}
          {hasSearched && (
            <div className="space-y-4">
              {results && results.length > 0 ? (
                results.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {app.applicationNumber}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {app.studentNameBn} ({app.studentNameEn})
                        </h4>
                        <p className="text-xs text-slate-600">
                          ভর্তির শ্রেণি: <strong className="text-emerald-800">{app.admissionClass}</strong> • অভিভাবক মোবাইল: {app.guardianPhone}
                        </p>
                      </div>

                      <div>{getStatusBadge(app.status)}</div>
                    </div>

                    {/* Admin remarks / interview date */}
                    {(app.interviewDate || app.adminRemarks) && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-100 text-xs">
                        {app.interviewDate && (
                          <div className="text-emerald-900 font-semibold flex items-center gap-1.5 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span>সাক্ষাৎকারের তারিখ: {app.interviewDate}</span>
                          </div>
                        )}
                        {app.adminRemarks && (
                          <p className="text-slate-600">
                            মন্তব্য: {app.adminRemarks}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        আবেদনের তারিখ: {new Date(app.createdAt).toLocaleDateString('bn-BD')}
                      </span>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectApplication(app);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>ভর্তি স্লিপ দেখুন</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">কোনো আবেদন পাওয়া যায়নি</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    দয়া করে আবেদন নম্বর বা মোবাইল নম্বরটি সঠিক কিনা মিলিয়ে পুনরায় চেষ্টা করুন অথবা প্রয়োজনে হেল্পলাইনে যোগাযোগ করুন।
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick Helpline Info */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>হেল্পলাইন: 01715-844170</span>
            <span className="font-semibold text-emerald-700">অক্সফোর্ড মডেল স্কুল</span>
          </div>
        </div>

      </div>
    </div>
  );
};
