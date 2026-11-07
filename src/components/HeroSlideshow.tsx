/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  Search, 
  GraduationCap,
  Pause,
  Play
} from 'lucide-react';
import { HeroSlide, SCHOOL_INFO } from '../types';

interface HeroSlideshowProps {
  slides: HeroSlide[];
  onOpenAdmissionModal: () => void;
  onOpenTrackerModal: () => void;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  slides,
  onOpenAdmissionModal,
  onOpenTrackerModal,
}) => {
  const activeSlides = slides.filter(s => s.isActive);
  const displaySlides = activeSlides.length > 0 ? activeSlides : slides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = displaySlides.length;

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isPaused, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  if (displaySlides.length === 0) return null;

  const currentSlide = displaySlides[currentIndex];

  const handleCtaClick = (action?: string) => {
    if (action === 'apply') {
      onOpenAdmissionModal();
    } else if (action === 'explore') {
      const el = document.getElementById('facilities');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'contact') {
      const el = document.getElementById('contact');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenAdmissionModal();
    }
  };

  return (
    <div 
      className="relative overflow-hidden bg-slate-950 text-white min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with smooth fade */}
      {displaySlides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105 animate-in fade-in zoom-in-105 duration-1000"
            />
            {/* Gradient Dark Overlays for high readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-950/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
          </div>
        );
      })}

      {/* Slide Content Layer */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        <div className="max-w-2xl lg:max-w-3xl">
          
          {/* Top Badge */}
          {currentSlide.badgeText && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-bold mb-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{currentSlide.badgeText}</span>
            </div>
          )}

          {/* Slide Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            {currentSlide.title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-medium leading-relaxed mb-8 max-w-2xl drop-shadow-sm">
            {currentSlide.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={() => handleCtaClick(currentSlide.ctaAction)}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>{currentSlide.ctaText || 'অনলাইনে ভর্তি আবেদন'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={onOpenTrackerModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>আবেদনের অবস্থা জানুন</span>
            </button>
          </div>

          {/* Quick Direct Hotline Contact */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-2 border-t border-white/10">
            <span className="text-slate-400">সরাসরি যোগাযোগ:</span>
            <a 
              href="tel:01715844170" 
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>পরিচালক: 01715-844170</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <a 
              href="tel:01780678956" 
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              <span>শিক্ষক: 01780-678956</span>
            </a>
          </div>

        </div>
      </div>

      {/* Prev / Next Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Bottom Indicators & Autoplay indicator */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          {displaySlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all rounded-full ${
                idx === currentIndex
                  ? 'w-7 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}

          <div className="w-px h-3 bg-white/20 mx-1" />

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-slate-400 hover:text-white transition-colors"
            title={isPaused ? "অটোপ্লে চালু করুন" : "পজ করুন"}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>
      )}
    </div>
  );
};
