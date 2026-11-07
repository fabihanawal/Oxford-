/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider, fetchHeroSlides } from './firebase/config';
import { AdmissionApplication, AdmissionClass, HeroSlide, SUPER_ADMIN_EMAIL } from './types';
import { Navbar } from './components/Navbar';
import { HeroSlideshow } from './components/HeroSlideshow';
import { Hero } from './components/Hero';
import { AboutAndValues } from './components/AboutAndValues';
import { Facilities } from './components/Facilities';
import { ClassesOffered } from './components/ClassesOffered';
import { AdmissionNotice } from './components/AdmissionNotice';
import { ContactAndLocation } from './components/ContactAndLocation';
import { Footer } from './components/Footer';
import { AdmissionFormModal } from './components/AdmissionFormModal';
import { ApplicationSlipModal } from './components/ApplicationSlipModal';
import { ApplicationTrackerModal } from './components/ApplicationTrackerModal';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);
  
  // Slides state
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  // Modals state
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [preselectedClass, setPreselectedClass] = useState<AdmissionClass | undefined>(undefined);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [slipApplication, setSlipApplication] = useState<AdmissionApplication | null>(null);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Slides
  const refreshSlides = async () => {
    try {
      const data = await fetchHeroSlides();
      setSlides(data);
    } catch (err) {
      console.error('Failed to load hero slides', err);
    }
  };

  useEffect(() => {
    refreshSlides();
  }, []);

  // Admin access validation
  const isAdmin = (currentUser?.email === SUPER_ADMIN_EMAIL) || isDemoAdmin;

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.warn('Google Sign-in popup cancelled or blocked:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDemoAdmin(false);
    } catch (e) {
      console.error('Sign out error', e);
    }
  };

  const handleOpenAdmissionWithClass = (cls: AdmissionClass) => {
    setPreselectedClass(cls);
    setIsAdmissionOpen(true);
  };

  const handleSuccessSubmission = (app: AdmissionApplication) => {
    setSlipApplication(app);
  };

  // If Admin Panel is open
  if (isAdminPanelOpen) {
    return (
      <AdminPanel
        currentUser={currentUser}
        isAdmin={isAdmin}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
        onClose={() => setIsAdminPanelOpen(false)}
        onViewApplicationSlip={(app) => setSlipApplication(app)}
        onToggleDemoAdmin={() => setIsDemoAdmin(!isDemoAdmin)}
        isDemoAdminActive={isDemoAdmin}
        onSlidesUpdated={refreshSlides}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenAdmissionModal={() => {
          setPreselectedClass(undefined);
          setIsAdmissionOpen(true);
        }}
        onOpenTrackerModal={() => setIsTrackerOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Interactive Hero Slideshow Banner */}
        <HeroSlideshow
          slides={slides}
          onOpenAdmissionModal={() => {
            setPreselectedClass(undefined);
            setIsAdmissionOpen(true);
          }}
          onOpenTrackerModal={() => setIsTrackerOpen(true)}
        />

        {/* Detailed School Brand and Values Hero */}
        <Hero
          onOpenAdmissionModal={() => {
            setPreselectedClass(undefined);
            setIsAdmissionOpen(true);
          }}
          onOpenTrackerModal={() => setIsTrackerOpen(true)}
        />

        <AboutAndValues />

        <Facilities />

        <ClassesOffered
          onSelectClassAndApply={handleOpenAdmissionWithClass}
        />

        <AdmissionNotice
          onOpenAdmissionModal={() => {
            setPreselectedClass(undefined);
            setIsAdmissionOpen(true);
          }}
        />

        <ContactAndLocation />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmissionModal={() => {
          setPreselectedClass(undefined);
          setIsAdmissionOpen(true);
        }}
        onOpenTrackerModal={() => setIsTrackerOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* Modals */}
      <AdmissionFormModal
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
        currentUser={currentUser}
        onSignInWithGoogle={handleSignInWithGoogle}
        preselectedClass={preselectedClass}
        onSuccessSubmission={handleSuccessSubmission}
      />

      <ApplicationSlipModal
        application={slipApplication}
        onClose={() => setSlipApplication(null)}
      />

      <ApplicationTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onSelectApplication={(app) => setSlipApplication(app)}
      />

    </div>
  );
}
