/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  RefreshCw, 
  LogIn, 
  LogOut, 
  Calendar, 
  FileText, 
  Printer, 
  AlertCircle,
  Sparkles,
  BookOpen,
  Phone,
  Mail,
  Home,
  HelpCircle,
  Save,
  Check,
  User as UserIcon,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  UploadCloud,
  Layers,
  Camera,
  ExternalLink
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  AdmissionApplication, 
  AdmissionClass, 
  ApplicationStatus, 
  CLASS_OPTIONS, 
  SCHOOL_INFO, 
  SUPER_ADMIN_EMAIL,
  HeroSlide 
} from '../types';
import { 
  fetchAllApplications, 
  updateApplicationStatus,
  fetchHeroSlides,
  saveHeroSlide,
  deleteHeroSlide,
  compressImageFile
} from '../firebase/config';

interface AdminPanelProps {
  currentUser: User | null;
  isAdmin: boolean;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
  onClose: () => void;
  onViewApplicationSlip: (app: AdmissionApplication) => void;
  onToggleDemoAdmin?: () => void;
  isDemoAdminActive?: boolean;
  onSlidesUpdated?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  isAdmin,
  onSignInWithGoogle,
  onSignOut,
  onClose,
  onViewApplicationSlip,
  onToggleDemoAdmin,
  isDemoAdminActive,
  onSlidesUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'slides'>('applications');

  // Application states
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected application for review modal
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [adminRemarkInput, setAdminRemarkInput] = useState('');
  const [interviewDateInput, setInterviewDateInput] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Slideshow management states
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideFormData, setSlideFormData] = useState({
    title: '',
    subtitle: '',
    badgeText: 'ভর্তি বিজ্ঞপ্তি ২০২৭',
    imageUrl: '',
    ctaText: 'অনলাইনে ভর্তি আবেদন',
    ctaAction: 'apply' as 'apply' | 'explore' | 'contact' | 'notice',
    order: 1,
    isActive: true
  });
  const [isCompressingSlideImage, setIsCompressingSlideImage] = useState(false);
  const slideFileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllApplications();
      setApplications(data);
    } catch (e) {
      console.error('Failed to load applications', e);
    } finally {
      setLoading(false);
    }
  };

  const loadSlides = async () => {
    setLoadingSlides(true);
    try {
      const slideList = await fetchHeroSlides();
      setSlides(slideList);
    } catch (e) {
      console.error('Failed to load slides', e);
    } finally {
      setLoadingSlides(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
      loadSlides();
    }
  }, [isAdmin]);

  const handleStatusChange = async (
    app: AdmissionApplication, 
    newStatus: ApplicationStatus, 
    remark?: string, 
    interviewDate?: string
  ) => {
    setIsUpdatingStatus(true);
    try {
      await updateApplicationStatus(app.id, newStatus, remark, interviewDate);
      
      // Update local state
      setApplications(prev => prev.map(item => {
        if (item.id === app.id) {
          return {
            ...item,
            status: newStatus,
            adminRemarks: remark !== undefined ? remark : item.adminRemarks,
            interviewDate: interviewDate !== undefined ? interviewDate : item.interviewDate,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      }));

      if (selectedApp && selectedApp.id === app.id) {
        setSelectedApp({
          ...selectedApp,
          status: newStatus,
          adminRemarks: remark !== undefined ? remark : selectedApp.adminRemarks,
          interviewDate: interviewDate !== undefined ? interviewDate : selectedApp.interviewDate,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) return;

    const headers = [
      'Application Number',
      'Student Name (Bn)',
      'Student Name (En)',
      'Class',
      'Gender',
      'Date of Birth',
      'Blood Group',
      'Father Name',
      'Father Phone',
      'Mother Name',
      'Guardian Phone',
      'Guardian Email',
      'Address',
      'Status',
      'Interview Date',
      'Remarks',
      'Created At'
    ];

    const rows = applications.map(app => [
      `"${app.applicationNumber}"`,
      `"${app.studentNameBn}"`,
      `"${app.studentNameEn}"`,
      `"${app.admissionClass}"`,
      `"${app.gender}"`,
      `"${app.dateOfBirth}"`,
      `"${app.bloodGroup || ''}"`,
      `"${app.fatherName}"`,
      `"${app.fatherPhone || ''}"`,
      `"${app.motherName}"`,
      `"${app.guardianPhone}"`,
      `"${app.guardianEmail}"`,
      `"${app.villageRoad}, ${app.postOffice}, ${app.upazila}, ${app.district}"`,
      `"${app.status}"`,
      `"${app.interviewDate || ''}"`,
      `"${app.adminRemarks || ''}"`,
      `"${new Date(app.createdAt).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Oxford_Model_School_Admissions_2027_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredApps = applications.filter(app => {
    const matchesQuery = 
      app.studentNameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.guardianPhone.includes(searchQuery) ||
      app.guardianEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = classFilter === 'all' || app.admissionClass === classFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesQuery && matchesClass && matchesStatus;
  });

  // Analytics counters
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const confirmedCount = applications.filter(a => a.status === 'confirmed').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  // Slide Management Helpers
  const handleOpenNewSlideModal = () => {
    setEditingSlideId(null);
    setSlideFormData({
      title: '',
      subtitle: '',
      badgeText: 'ভর্তি বিজ্ঞপ্তি ২০২৭',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'অনলাইনে ভর্তি আবেদন',
      ctaAction: 'apply',
      order: slides.length + 1,
      isActive: true
    });
    setIsSlideModalOpen(true);
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlideId(slide.id);
    setSlideFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      badgeText: slide.badgeText || '',
      imageUrl: slide.imageUrl,
      ctaText: slide.ctaText || 'অনলাইনে ভর্তি আবেদন',
      ctaAction: slide.ctaAction || 'apply',
      order: slide.order,
      isActive: slide.isActive
    });
    setIsSlideModalOpen(true);
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingSlideImage(true);
    try {
      const compressed = await compressImageFile(file, 1200, 700, 0.82);
      setSlideFormData(prev => ({ ...prev, imageUrl: compressed }));
    } catch (err) {
      console.error('Slide image upload failed', err);
    } finally {
      setIsCompressingSlideImage(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideFormData.title.trim() || !slideFormData.imageUrl) return;

    try {
      const saved = await saveHeroSlide({
        ...(editingSlideId ? { id: editingSlideId } : {}),
        title: slideFormData.title.trim(),
        subtitle: slideFormData.subtitle.trim(),
        badgeText: slideFormData.badgeText.trim(),
        imageUrl: slideFormData.imageUrl,
        ctaText: slideFormData.ctaText.trim(),
        ctaAction: slideFormData.ctaAction,
        order: Number(slideFormData.order) || 1,
        isActive: slideFormData.isActive,
        createdAt: new Date().toISOString()
      });

      await loadSlides();
      onSlidesUpdated?.();
      setIsSlideModalOpen(false);
    } catch (err) {
      console.error('Failed to save slide', err);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই স্লাইডটি মুছে ফেলতে চান?')) return;
    try {
      await deleteHeroSlide(id);
      await loadSlides();
      onSlidesUpdated?.();
    } catch (err) {
      console.error('Failed to delete slide', err);
    }
  };

  const handleToggleSlideActive = async (slide: HeroSlide) => {
    try {
      await saveHeroSlide({
        ...slide,
        isActive: !slide.isActive
      });
      await loadSlides();
      onSlidesUpdated?.();
    } catch (err) {
      console.error('Failed to toggle slide status', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-white">
                  অ্যাডমিন ড্যাশবোর্ড
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  সুপার অ্যাডমিন
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {SCHOOL_INFO.nameBn} • শিক্ষাবর্ষ ২০২৭
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Documentation & Setup Guide button */}
            <button
              onClick={() => setShowDocsModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>সেটআপ নির্দেশিকা</span>
            </button>

            {/* Back to Website */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>ওয়েবসাইটে ফিরুন</span>
            </button>

            {/* Sign Out */}
            {currentUser && (
              <button
                onClick={onSignOut}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                title="লগআউট"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* If Not Admin Gate */}
        {!isAdmin ? (
          <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              সংরক্ষিত অ্যাডমিন প্রবেশদ্বার
            </h3>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              এই ড্যাশবোর্ডটি শুধুমাত্র অনুমোদিত অ্যাডমিন ইমেইল <strong>{SUPER_ADMIN_EMAIL}</strong> দ্বারা পরিচালিত।
            </p>

            {currentUser && currentUser.email !== SUPER_ADMIN_EMAIL && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-left">
                <span className="font-bold">বর্তমান অ্যাকাউন্ট:</span> {currentUser.email}
                <p className="mt-1 text-[11px] text-rose-600">
                  অনুমোদিত অ্যাডমিন ইমেইল ({SUPER_ADMIN_EMAIL}) দিয়ে লগইন করতে নিচের বাটনে ক্লিক করুন।
                </p>
              </div>
            )}

            <button
              onClick={onSignInWithGoogle}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-black transition-colors shadow-md cursor-pointer mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{SUPER_ADMIN_EMAIL} দিয়ে সাইন-ইন</span>
            </button>

            {/* Quick Demo Switch */}
            {onToggleDemoAdmin && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onToggleDemoAdmin}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline"
                >
                  {isDemoAdminActive ? 'ডেমো অ্যাডমিন নিষ্ক্রিয় করুন' : 'প্রিভিউ / ডেমো অ্যাডমিন সক্রিয় করুন'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            
            {/* Admin Header with Navigation Tabs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    লাইভ কন্ট্রোল প্যানেল
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  অক্সফোর্ড মডেল স্কুল অ্যাডমিন সেন্টার
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  অনুমোদিত প্রশাসক: <strong>{currentUser?.email || SUPER_ADMIN_EMAIL}</strong>
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'applications'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ভর্তি আবেদনসমূহ ({applications.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('slides')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'slides'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>হোম স্লাইড শো ({slides.length})</span>
                </button>
              </div>
            </div>

            {/* TAB 1: APPLICATIONS MANAGEMENT */}
            {activeTab === 'applications' && (
              <div>
                {/* Action buttons bar */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-slate-800">
                    আবেদন তালিকা ও শিক্ষার্থী তথ্য
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={loadData}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>রিফ্রেশ</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>এক্সেল / CSV ডাউনলোড</span>
                    </button>
                  </div>
                </div>

                {/* Analytics Counters */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">মোট আবেদন</span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{totalCount}</div>
                    <div className="text-[11px] text-slate-400 mt-1">সর্বমোট প্রাপ্ত আবেদন</div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-700">অপেক্ষমাণ (Pending)</span>
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-amber-900">{pendingCount}</div>
                    <div className="text-[11px] text-amber-600 mt-1">পর্যালোচনা প্রয়োজন</div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-700">কনফার্ম / অনুমোদিত</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-emerald-900">{confirmedCount}</div>
                    <div className="text-[11px] text-emerald-600 mt-1">ভর্তি নিশ্চিতকরণ সম্পন্ন</div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-rose-700">বাতিলকৃত (Rejected)</span>
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                        <XCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-rose-900">{rejectedCount}</div>
                    <div className="text-[11px] text-rose-500 mt-1">বাতিল আবেদন</div>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="নাম, আবেদন নম্বর বা মোবাইল..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-semibold">শ্রেণি:</span>
                      <select
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                      >
                        <option value="all">সকল শ্রেণি</option>
                        {CLASS_OPTIONS.map(c => (
                          <option key={c.id} value={c.id}>{c.labelBn}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-semibold">স্ট্যাটাস:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                      >
                        <option value="all">সকল অবস্থা</option>
                        <option value="pending">অপেক্ষমাণ (Pending)</option>
                        <option value="confirmed">কনফার্ম (Confirmed)</option>
                        <option value="rejected">বাতিল (Rejected)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                          <th className="py-3.5 px-4">ছবি</th>
                          <th className="py-3.5 px-4">আইডি</th>
                          <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                          <th className="py-3.5 px-4">শ্রেণি</th>
                          <th className="py-3.5 px-4">পিতা / অভিভাবক</th>
                          <th className="py-3.5 px-4">যোগাযোগ নম্বর</th>
                          <th className="py-3.5 px-4">বর্তমান অবস্থা</th>
                          <th className="py-3.5 px-4 text-right">কার্যক্রম (Action)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loading ? (
                          <tr>
                            <td colSpan={8} className="text-center py-12 text-slate-500">
                              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                              <span>আবেদনসমূহ লোড হচ্ছে...</span>
                            </td>
                          </tr>
                        ) : filteredApps.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-12 text-slate-500">
                              কোনো আবেদন খুঁজে পাওয়া যায়নি।
                            </td>
                          </tr>
                        ) : (
                          filteredApps.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4">
                                <div className="w-9 h-11 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                  {app.studentPhotoUrl ? (
                                    <img src={app.studentPhotoUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <UserIcon className="w-4 h-4 text-slate-300" />
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                                {app.applicationNumber}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-900">{app.studentNameBn}</div>
                                <div className="text-[11px] text-slate-400">{app.studentNameEn}</div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs">
                                  {app.admissionClass}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="text-slate-800 font-medium">{app.fatherName}</div>
                                <div className="text-[11px] text-slate-500">{app.guardianEmail}</div>
                              </td>
                              <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                                {app.guardianPhone}
                              </td>
                              <td className="py-3.5 px-4">
                                {app.status === 'confirmed' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                    <Check className="w-3 h-3" /> কনফার্ম
                                  </span>
                                ) : app.status === 'rejected' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                                    <XCircle className="w-3 h-3" /> বাতিল
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                                    <Clock className="w-3 h-3" /> অপেক্ষমাণ
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedApp(app);
                                      setAdminRemarkInput(app.adminRemarks || '');
                                      setInterviewDateInput(app.interviewDate || '');
                                    }}
                                    className="p-1.5 text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-slate-200 transition-colors"
                                    title="ছবি, বিস্তারিত ও অবস্থা পর্যালোচনা"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => onViewApplicationSlip(app)}
                                    className="p-1.5 text-slate-600 hover:text-teal-700 rounded-lg hover:bg-slate-200 transition-colors"
                                    title="ভর্তি স্লিপ প্রিন্ট"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SLIDESHOW BANNER MANAGER */}
            {activeTab === 'slides' && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      হোম পেজ স্লাইড শো ব্যবস্থাপনা (Hero Carousel)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ওয়েবসাইটের মূল ব্যানারে প্রদর্শিত স্লাইডগুলোর ছবি ও লেখা সংযোজন, পরিবর্তন বা অপসারণ করুন।
                    </p>
                  </div>

                  <button
                    onClick={handleOpenNewSlideModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন স্লাইড যুক্ত করুন</span>
                  </button>
                </div>

                {/* Slides List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {slides.map((slide) => (
                    <div 
                      key={slide.id}
                      className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                        slide.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60'
                      }`}
                    >
                      <div>
                        {/* Slide image preview */}
                        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                          <img 
                            src={slide.imageUrl} 
                            alt={slide.title} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="bg-slate-900/80 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                              ক্রম: #{slide.order}
                            </span>
                            {slide.badgeText && (
                              <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {slide.badgeText}
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => handleToggleSlideActive(slide)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs transition-colors ${
                                slide.isActive 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {slide.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Off)'}
                            </button>
                          </div>
                        </div>

                        {/* Slide Info */}
                        <div className="p-4">
                          <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                            {slide.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {slide.subtitle}
                          </p>

                          {slide.ctaText && (
                            <div className="mt-3 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                              বাটন: {slide.ctaText}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                        <span className="text-[10px] text-slate-400">
                          {new Date(slide.createdAt).toLocaleDateString('bn-BD')}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditSlide(slide)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Slide Add/Edit Modal */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">
                  {editingSlideId ? 'স্লাইড সম্পাদনা' : 'নতুন স্লাইড সংযোজন'}
                </h3>
              </div>
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              
              {/* Image Preview & Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  স্লাইডের ব্যানার ছবি <span className="text-rose-500">*</span>
                </label>
                <div className="relative aspect-video w-full rounded-2xl bg-slate-900 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center mb-2">
                  {slideFormData.imageUrl ? (
                    <img src={slideFormData.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4 text-slate-400">
                      <ImageIcon className="w-10 h-10 mx-auto text-slate-400 mb-1" />
                      <span>কোনো ছবি নির্বাচিত নেই</span>
                    </div>
                  )}

                  {isCompressingSlideImage && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                      ছবি প্রসেস হচ্ছে...
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={slideFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSlideImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => slideFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-black transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  প্রধান শিরোনাম (Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ২০২৭ শিক্ষাবর্ষে ভর্তি চলছে!"
                  value={slideFormData.title}
                  onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  উপশিরোনাম ও বর্ণনা (Subtitle)
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: বদলগাছী ডাকবাংলোর উত্তর পাশে অবস্থিত অক্সফোর্ড মডেল স্কুল..."
                  value={slideFormData.subtitle}
                  onChange={(e) => setSlideFormData({ ...slideFormData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Badge & Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ব্যাজ টেক্সট (Highlight Badge)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ভর্তি বিজ্ঞপ্তি"
                    value={slideFormData.badgeText}
                    onChange={(e) => setSlideFormData({ ...slideFormData, badgeText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    প্রদর্শনের ক্রম (Order Index)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={slideFormData.order}
                    onChange={(e) => setSlideFormData({ ...slideFormData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* CTA button details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বাটন লেবেল (Button Text)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: অনলাইনে ভর্তি আবেদন"
                    value={slideFormData.ctaText}
                    onChange={(e) => setSlideFormData({ ...slideFormData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বাটনের অ্যাকশন
                  </label>
                  <select
                    value={slideFormData.ctaAction}
                    onChange={(e) => setSlideFormData({ ...slideFormData, ctaAction: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="apply">ভর্তি ফরম ওপেন করুন</option>
                    <option value="explore">ক্যাম্পাস সুবিধায় স্ক্রোল করুন</option>
                    <option value="contact">যোগাযোগ সেকশনে যান</option>
                  </select>
                </div>
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="slideIsActive"
                  checked={slideFormData.isActive}
                  onChange={(e) => setSlideFormData({ ...slideFormData, isActive: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded-sm"
                />
                <label htmlFor="slideIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  হোম পেজে স্লাইডটি সক্রিয় রাখুন
                </label>
              </div>

              {/* Modal footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingSlideId ? 'আপডেট করুন' : 'স্লাইড যুক্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Status Update Modal (with Student & Parents Photos) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-md">
                  {selectedApp.applicationNumber}
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  আবেদন পর্যালোচনা: {selectedApp.studentNameBn}
                </h3>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Student & Parents Photos Gallery */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>সংযুক্ত ফটো ভেরিফিকেশন (Photo Verification)</span>
                </h4>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {/* Student Photo */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="aspect-3/4 rounded-lg bg-slate-100 overflow-hidden mb-1.5 flex items-center justify-center border border-slate-200">
                      {selectedApp.studentPhotoUrl ? (
                        <img src={selectedApp.studentPhotoUrl} alt="Student" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-900 block">শিক্ষার্থীর ছবি</span>
                    <span className="text-[9px] text-slate-400">
                      {selectedApp.studentPhotoUrl ? 'সংযুক্ত' : 'অনুপস্থিত'}
                    </span>
                  </div>

                  {/* Father Photo */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="aspect-3/4 rounded-lg bg-slate-100 overflow-hidden mb-1.5 flex items-center justify-center border border-slate-200">
                      {selectedApp.fatherPhotoUrl ? (
                        <img src={selectedApp.fatherPhotoUrl} alt="Father" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 block">পিতার ছবি</span>
                    <span className="text-[9px] text-slate-400">
                      {selectedApp.fatherPhotoUrl ? 'সংযুক্ত' : 'অনুপস্থিত'}
                    </span>
                  </div>

                  {/* Mother Photo */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="aspect-3/4 rounded-lg bg-slate-100 overflow-hidden mb-1.5 flex items-center justify-center border border-slate-200">
                      {selectedApp.motherPhotoUrl ? (
                        <img src={selectedApp.motherPhotoUrl} alt="Mother" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 block">মাতার ছবি</span>
                    <span className="text-[9px] text-slate-400">
                      {selectedApp.motherPhotoUrl ? 'সংযুক্ত' : 'অনুপস্থিত'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student details grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold block">শিক্ষার্থীর নাম (En):</span>
                  <span className="font-bold text-slate-800">{selectedApp.studentNameEn}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">ভর্তির শ্রেণি:</span>
                  <span className="font-black text-emerald-800">{selectedApp.admissionClass}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">পিতার নাম ও পেশা:</span>
                  <span className="font-medium text-slate-800">{selectedApp.fatherName} ({selectedApp.fatherOccupation || 'ব্যবসায়ী'})</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">মাতার নাম:</span>
                  <span className="font-medium text-slate-800">{selectedApp.motherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">অভিভাবকের মোবাইল:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedApp.guardianPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">অভিভাবকের ইমেইল:</span>
                  <span className="text-slate-700">{selectedApp.guardianEmail}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 font-semibold block">ঠিকানা:</span>
                  <span className="text-slate-700">
                    {selectedApp.villageRoad}, {selectedApp.postOffice}, {selectedApp.upazila}, {selectedApp.district}
                  </span>
                </div>
                {selectedApp.notes && (
                  <div className="col-span-2 bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-semibold block">অভিভাবকের মন্তব্য:</span>
                    <span className="text-slate-700 italic">{selectedApp.notes}</span>
                  </div>
                )}
              </div>

              {/* Status Action Controls */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
                <h4 className="text-sm font-bold text-slate-900">
                  আবেদনের অবস্থা পরিবর্তন করুন (Update Status)
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedApp, 'confirmed', adminRemarkInput, interviewDateInput)}
                    disabled={isUpdatingStatus}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      selectedApp.status === 'confirmed'
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>কনফার্ম (Confirm)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedApp, 'pending', adminRemarkInput, interviewDateInput)}
                    disabled={isUpdatingStatus}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      selectedApp.status === 'pending'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>অপেক্ষমাণ (Pending)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedApp, 'rejected', adminRemarkInput, interviewDateInput)}
                    disabled={isUpdatingStatus}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      selectedApp.status === 'rejected'
                        ? 'bg-rose-700 text-white shadow-sm'
                        : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>বাতিল (Reject)</span>
                  </button>
                </div>

                {/* Interview date schedule */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সাক্ষাৎকার / মৌখিক পরীক্ষার তারিখ (যদি কনফার্ম করা হয়)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ২০২৬-১২-২৫, সকাল ১০:০০ টা"
                    value={interviewDateInput}
                    onChange={(e) => setInterviewDateInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Administrative remark */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অ্যাডমিন মন্তব্য বা নির্দেশনা (অভিভাবক দেখতে পারবেন)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="যেমন: প্রয়োজনীয় কাগজপত্রসহ নির্ধারিত দিনে উপস্থিত থাকতে হবে।"
                    value={adminRemarkInput}
                    onChange={(e) => setAdminRemarkInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedApp, selectedApp.status, adminRemarkInput, interviewDateInput)}
                    disabled={isUpdatingStatus}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>মন্তব্য ও সময় সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  onViewApplicationSlip(selectedApp);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
              >
                <Printer className="w-4 h-4" />
                <span>অফিসিয়াল ভর্তি স্লিপ খুলুন</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Setup Guide & Documentation Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  ফায়ারবেস ও অ্যাডমিন কনফিগারেশন নির্দেশিকা
                </h3>
              </div>
              <button
                onClick={() => setShowDocsModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-xs text-slate-700 space-y-4 max-h-[70vh] overflow-y-auto leading-relaxed">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <h4 className="font-bold text-emerald-950 mb-1">
                  ১. অনুমোদিত সুপার অ্যাডমিন ইমেইল:
                </h4>
                <p>
                  সিস্টেমে স্থায়ীভাবে <code>{SUPER_ADMIN_EMAIL}</code> ইমেইলটিকে সুপার অ্যাডমিন হিসেবে নির্ধারণ করা হয়েছে। ফায়ারবেস অথেনটিকেশনের মাধ্যমে এই অ্যাকাউন্টে সাইন-ইন করলে সম্পূর্ণ অ্যাডমিন ক্ষমতা সক্রিয় হয়।
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  ২. ফায়ারবেস ফায়ারস্টোর ও সিকিউরিটি রুলস:
                </h4>
                <p>
                  - <code>/admissions/&#123;applicationId&#125;</code>: অভিভাবকরা শুধুমাত্র নিজের আবেদন ও ফটো দাখিল করতে পারেন (প্রাথমিক স্ট্যাটাস <code>pending</code>)।
                  <br />
                  - <code>/slides/&#123;slideId&#125;</code>: হোম পেজের স্লাইড শো ব্যানার যে কেউ দেখতে পারবেন, তবে সংযোজন, বিয়োজন ও আপলোড শুধুমাত্র সুপার অ্যাডমিন (<code>{SUPER_ADMIN_EMAIL}</code>) করতে পারেন।
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">
                  ৩. ছবি আপলোড ও কম্প্রেশন:
                </h4>
                <p>
                  শিক্ষার্থী ও অভিভাবকদের ফটো এবং স্লাইডের ছবিগুলো স্বয়ংক্রিয়ভাবে ক্লায়েন্ট সাইড ক্যানভাসে অপ্টিমাইজড ও কম্প্রেসড হয়ে ফায়ারস্টোরে সংরক্ষিত হয়।
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-200">
              <button
                onClick={() => setShowDocsModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                বুঝেছি
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
