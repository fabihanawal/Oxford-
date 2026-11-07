/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AdmissionClass = 
  | 'Nursery' 
  | 'KG' 
  | 'Class 1' 
  | 'Class 2' 
  | 'Class 3' 
  | 'Class 4' 
  | 'Class 5';

export type ApplicationStatus = 'pending' | 'confirmed' | 'rejected';

export type Gender = 'male' | 'female' | 'other';

export interface AdmissionApplication {
  id: string;
  applicationNumber: string; // e.g. OMS-2027-1045
  studentNameBn: string;
  studentNameEn: string;
  gender: Gender;
  dateOfBirth: string; // YYYY-MM-DD
  bloodGroup: string;
  admissionClass: AdmissionClass;
  previousSchool?: string;
  
  // Photos
  studentPhotoUrl?: string; // Passport size photo data URL or URL
  fatherPhotoUrl?: string;
  motherPhotoUrl?: string;
  
  // Parents info
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  
  // Guardian / Primary contact
  guardianPhone: string;
  guardianEmail: string;
  applicantUid: string;
  
  // Address
  villageRoad: string;
  postOffice: string;
  upazila: string;
  district: string;
  
  // Additional notes
  notes?: string;
  
  // Administration
  status: ApplicationStatus;
  adminRemarks?: string;
  interviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badgeText?: string;
  ctaText?: string;
  ctaAction?: 'apply' | 'explore' | 'contact' | 'notice';
  order: number;
  isActive: boolean;
  createdAt: string;
}

export const SUPER_ADMIN_EMAIL = 'rstsbd@gmail.com';

export const SCHOOL_INFO = {
  nameBn: 'অক্সফোর্ড মডেল স্কুল',
  nameEn: 'Oxford Model School',
  address: 'বদলগাছী ডাকবাংলোর উত্তর পাশে, বদলগাছী, নওগাঁ',
  upazila: 'বদলগাছী',
  district: 'নওগাঁ',
  slogan1: 'আদর্শ শিক্ষা, সুন্দর আগামীর প্রত্যয়।',
  slogan2: 'শিক্ষা মানেই শুধু পাঠ্যবই নয়, এটি জীবনের প্রস্তুতি।',
  session: '২০২৭ শিক্ষাবর্ষ',
  classRange: 'নার্সারি থেকে ৫ম শ্রেণি পর্যন্ত',
  contacts: [
    { title: 'পরিচালক', phone: '01715-844170', raw: '01715844170' },
    { title: 'শিক্ষক', phone: '01780-678956', raw: '01780678956' },
  ],
  adminEmail: SUPER_ADMIN_EMAIL,
};

export const CLASS_OPTIONS: { id: AdmissionClass; labelBn: string; ageRange: string; desc: string }[] = [
  { id: 'Nursery', labelBn: 'নার্সারি', ageRange: '৩ - ৪ বছর', desc: 'বর্ণমালা পরিচয়, ছবির মাধ্যমে শব্দজ্ঞান ও আনন্দঘন পরিবেশ' },
  { id: 'KG', labelBn: 'কেজি (KG)', ageRange: '৪ - ৫ বছর', desc: 'ইংরেজি ও বাংলা সহজ উচ্চারণ, সংখ্যাজ্ঞান ও প্রাথমিক গণনা' },
  { id: 'Class 1', labelBn: '১ম শ্রেণি', ageRange: '৫ - ৬ বছর', desc: 'প্রাথমিক পাঠ্যক্রম, সুন্দর হস্তলিপি ও গণিতের মৌলিক ভিত্তি' },
  { id: 'Class 2', labelBn: '২য় শ্রেণি', ageRange: '৬ - ৭ বছর', desc: 'পঠন ও লিখন দক্ষতা বৃদ্ধি এবং সহশিক্ষা কার্যক্রমে সংযুক্তি' },
  { id: 'Class 3', labelBn: '৩য় শ্রেণি', ageRange: '৭ - ৮ বছর', desc: 'বিজ্ঞান ও পরিবেশ সচেতনতা, বিষয়ভিত্তিক সুদৃঢ় প্রস্তুতি' },
  { id: 'Class 4', labelBn: '৪র্থ শ্রেণি', ageRange: '৮ - ৯ বছর', desc: 'উন্নত মূল্যায়ন পদ্ধতি, সাধারণ জ্ঞান ও যুক্তিবোধ বিকাশ' },
  { id: 'Class 5', labelBn: '৫ম শ্রেণি', ageRange: '৯ - ১০ বছর', desc: 'প্রাথমিক সমাপনী দক্ষতা, মেধা যাচাই ও উচ্চস্তরের প্রস্তুতি' },
];
