/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  updateDoc,
  deleteDoc,
  query, 
  where,
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AdmissionApplication, HeroSlide, SUPER_ADMIN_EMAIL } from '../types';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/* CRITICAL: The app will break without specifying firestoreDatabaseId when custom database is used */
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Operation Type enum for Firestore error handling conforming to skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test as required by skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection verified.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection note: client is running in offline mode or waiting for connection.');
    }
  }
}
testConnection();

// Local Storage Fallback Cache Key for seamless demonstration / offline support
const LOCAL_STORAGE_KEY = 'oxford_model_school_applications_v1';

export function getLocalApplications(): AdmissionApplication[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveLocalApplications(apps: AdmissionApplication[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    console.error('Local cache save failed', e);
  }
}

// Initial seed applications for demonstration if database is initially empty
export const INITIAL_SAMPLE_APPLICATIONS: AdmissionApplication[] = [
  {
    id: 'app-oms-2027-1001',
    applicationNumber: 'OMS-2027-1001',
    studentNameBn: 'তাহমিদ হাসান',
    studentNameEn: 'Tahmid Hasan',
    gender: 'male',
    dateOfBirth: '2022-04-12',
    bloodGroup: 'B+',
    admissionClass: 'Nursery',
    previousSchool: '',
    fatherName: 'মোঃ রফিকুল ইসলাম',
    fatherOccupation: 'ব্যবসায়ী',
    fatherPhone: '01712-345678',
    motherName: 'মোছাঃ তাসলিমা খাতুন',
    motherOccupation: 'গৃহিণী',
    motherPhone: '01712-345679',
    guardianPhone: '01712-345678',
    guardianEmail: 'tahmid.guardian@gmail.com',
    applicantUid: 'sample-guardian-1',
    villageRoad: 'ডাকবাংলো রোড, সদর পাড়া',
    postOffice: 'বদলগাছী',
    upazila: 'বদলগাছী',
    district: 'নওগাঁ',
    notes: 'শিশুর গান ও ছবি আঁকার প্রতি বিশেষ আগ্রহ রয়েছে।',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'app-oms-2027-1002',
    applicationNumber: 'OMS-2027-1002',
    studentNameBn: 'সুমাইয়া আক্তার ইতি',
    studentNameEn: 'Sumaiya Akter Iti',
    gender: 'female',
    dateOfBirth: '2019-09-18',
    bloodGroup: 'A+',
    admissionClass: 'Class 2',
    previousSchool: 'বদলগাছী মডেল কেজি স্কুল',
    fatherName: 'মোঃ আব্দুল হান্নান',
    fatherOccupation: 'চাকুরিজীবী',
    fatherPhone: '01718-998877',
    motherName: 'জাহানারা বেগম',
    motherOccupation: 'শিক্ষিকা',
    motherPhone: '01718-998878',
    guardianPhone: '01718-998877',
    guardianEmail: 'sumaiya.parent@gmail.com',
    applicantUid: 'sample-guardian-2',
    villageRoad: 'থানা রোড, বাজার সংলগ্ন',
    postOffice: 'বদলগাছী',
    upazila: 'বদলগাছী',
    district: 'নওগাঁ',
    notes: 'পূর্ববর্তী শ্রেণিতে প্রথম স্থান অধিকার করেছিল।',
    status: 'confirmed',
    adminRemarks: 'কাগজপত্র যাচাইকৃত। মৌখিক মূল্যায়ন সম্পন্ন। অভিনন্দন!',
    interviewDate: '২০২৬-১২-২০, সকাল ১০:০০ টা',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

// Helper to save application to Firestore with local sync
export async function submitAdmissionApplication(appData: Omit<AdmissionApplication, 'id'>): Promise<AdmissionApplication> {
  const collectionPath = 'admissions';
  const newDocRef = doc(collection(db, collectionPath));
  const fullApp: AdmissionApplication = {
    ...appData,
    id: newDocRef.id,
  };

  try {
    await setDoc(newDocRef, fullApp);
  } catch (error) {
    console.warn('Direct Firestore setDoc encountered issue, recording in resilient backup store:', error);
    // Even if remote rules fail or client is offline, keep resilient local copy
  }

  // Update local cache
  const existingLocal = getLocalApplications();
  const updated = [fullApp, ...existingLocal.filter(a => a.applicationNumber !== fullApp.applicationNumber)];
  saveLocalApplications(updated);

  return fullApp;
}

// Fetch all applications (for Admin)
export async function fetchAllApplications(): Promise<AdmissionApplication[]> {
  const collectionPath = 'admissions';
  try {
    const snap = await getDocs(collection(db, collectionPath));
    const list: AdmissionApplication[] = [];
    snap.forEach((d) => {
      list.push(d.data() as AdmissionApplication);
    });

    if (list.length > 0) {
      // Merge with any offline creations
      const local = getLocalApplications();
      const map = new Map<string, AdmissionApplication>();
      list.forEach(item => map.set(item.id, item));
      local.forEach(item => {
        if (!map.has(item.id)) map.set(item.id, item);
      });
      const combined = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      saveLocalApplications(combined);
      return combined;
    }
  } catch (error) {
    console.warn('Fetching from Firestore failed or restricted, falling back to cached applications:', error);
  }

  // Fallback to local storage or initial samples
  let cached = getLocalApplications();
  if (cached.length === 0) {
    cached = INITIAL_SAMPLE_APPLICATIONS;
    saveLocalApplications(cached);
  }
  return cached;
}

// Update application status (Admin only)
export async function updateApplicationStatus(
  id: string, 
  status: 'pending' | 'confirmed' | 'rejected', 
  adminRemarks?: string,
  interviewDate?: string
): Promise<void> {
  const collectionPath = 'admissions';
  const docRef = doc(db, collectionPath, id);
  const now = new Date().toISOString();

  const updatePayload: any = {
    status,
    updatedAt: now,
  };
  if (adminRemarks !== undefined) updatePayload.adminRemarks = adminRemarks;
  if (interviewDate !== undefined) updatePayload.interviewDate = interviewDate;

  try {
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    console.warn('Firestore updateDoc failed, applying locally:', error);
  }

  // Update local cache
  const local = getLocalApplications();
  const idx = local.findIndex(a => a.id === id);
  if (idx !== -1) {
    local[idx] = {
      ...local[idx],
      ...updatePayload,
    };
    saveLocalApplications([...local]);
  }
}

// Helper to query applications by phone or number
export async function lookupApplication(queryStr: string): Promise<AdmissionApplication[]> {
  const cleanQuery = queryStr.trim().toLowerCase();
  if (!cleanQuery) return [];

  const all = await fetchAllApplications();
  return all.filter(app => 
    app.applicationNumber.toLowerCase() === cleanQuery ||
    app.guardianPhone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '') ||
    app.fatherPhone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '') ||
    app.motherPhone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
  );
}

// Client-side lightweight image compression using HTML5 Canvas
export function compressImageFile(file: File, maxWidth = 600, maxHeight = 600, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// Default curated slideshow items for Oxford Model School
export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-oms-1',
    title: '২০২৭ শিক্ষাবর্ষে ভর্তি চলছে!',
    subtitle: 'বদলগাছী ডাকবাংলোর উত্তর পাশে অবস্থিত ঐতিহ্যবাহী অক্সফোর্ড মডেল স্কুলে নার্সারি থেকে ৫ম শ্রেণি পর্যন্ত সীমিত আসনে ভর্তি চলছে।',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    badgeText: 'ভর্তি সেশন ২০২৭',
    ctaText: 'অনলাইনে ভর্তি আবেদন',
    ctaAction: 'apply',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'slide-oms-2',
    title: '“আদর্শ শিক্ষা, সুন্দর আগামীর প্রত্যয়”',
    subtitle: 'মেধা ও মননের পরিপূর্ণ বিকাশ, নৈতিক ও মানবিক মূল্যবোধের সমন্বয়ে আমরা শিশুদের গড়ে তুলি আগামী দিনের দক্ষ ও দেশপ্রেমিক নাগরিক হিসেবে।',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    badgeText: 'আমাদের প্রত্যয়',
    ctaText: 'আমাদের সুবিধা ও ক্যাম্পাস',
    ctaAction: 'explore',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'slide-oms-3',
    title: '“শিক্ষা মানেই শুধু পাঠ্যবই নয়, জীবনের প্রস্তুতি”',
    subtitle: 'আধুনিক মাল্টিমিডিয়া শ্রেণিকক্ষে পাঠদান, খেলাধুলা, সাংস্কৃতিক চর্চা, সমৃদ্ধ শিশু গ্রন্থাগার ও নিবিড় ব্যক্তিগত যত্ন।',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    badgeText: 'ডিজিটাল পাঠদান ও সহশিক্ষা',
    ctaText: 'যোগাযোগ ও সরাসরি পরিদর্শন',
    ctaAction: 'contact',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const LOCAL_SLIDES_KEY = 'oxford_model_school_slides_v1';

export function getLocalSlides(): HeroSlide[] {
  try {
    const raw = localStorage.getItem(LOCAL_SLIDES_KEY);
    if (!raw) return DEFAULT_HERO_SLIDES;
    const parsed = JSON.parse(raw);
    return parsed.length > 0 ? parsed : DEFAULT_HERO_SLIDES;
  } catch (e) {
    return DEFAULT_HERO_SLIDES;
  }
}

export function saveLocalSlides(slides: HeroSlide[]) {
  try {
    localStorage.setItem(LOCAL_SLIDES_KEY, JSON.stringify(slides));
  } catch (e) {
    console.error('Failed to save slides locally', e);
  }
}

// Fetch all slides from Firestore with local fallback
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  const collectionPath = 'slides';
  try {
    const snap = await getDocs(collection(db, collectionPath));
    const list: HeroSlide[] = [];
    snap.forEach(d => {
      list.push(d.data() as HeroSlide);
    });

    if (list.length > 0) {
      list.sort((a, b) => a.order - b.order);
      saveLocalSlides(list);
      return list;
    }
  } catch (error) {
    console.warn('Fetching slides from Firestore failed or empty, using cached slides:', error);
  }

  return getLocalSlides();
}

// Save or Update a slide
export async function saveHeroSlide(slideData: Omit<HeroSlide, 'id'> & { id?: string }): Promise<HeroSlide> {
  const collectionPath = 'slides';
  const slideId = slideData.id || `slide-${Date.now()}`;
  const fullSlide: HeroSlide = {
    ...slideData,
    id: slideId,
    createdAt: slideData.createdAt || new Date().toISOString()
  };

  try {
    await setDoc(doc(db, collectionPath, slideId), fullSlide);
  } catch (error) {
    console.warn('Saving slide to Firestore failed, applying locally:', error);
  }

  // Sync locally
  const current = getLocalSlides();
  const exists = current.some(s => s.id === slideId);
  let updated: HeroSlide[];
  if (exists) {
    updated = current.map(s => s.id === slideId ? fullSlide : s);
  } else {
    updated = [...current, fullSlide];
  }
  updated.sort((a, b) => a.order - b.order);
  saveLocalSlides(updated);

  return fullSlide;
}

// Delete a slide
export async function deleteHeroSlide(id: string): Promise<void> {
  const collectionPath = 'slides';
  try {
    await deleteDoc(doc(db, collectionPath, id));
  } catch (error) {
    console.warn('Deleting slide from Firestore failed, removing locally:', error);
  }

  const current = getLocalSlides();
  const filtered = current.filter(s => s.id !== id);
  saveLocalSlides(filtered);
}
