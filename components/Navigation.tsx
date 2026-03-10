
import React, { useState } from 'react';
import { PageId } from '../types.ts';
import { SCHOOL_INFO } from '../constants.tsx';
import { ASSETS } from '../assets.ts';

interface NavigationProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const ThemeToggle: React.FC<{ isDark: boolean; onToggle: () => void }> = ({ isDark, onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className="relative w-16 h-8 md:w-20 md:h-10 rounded-full p-1 transition-all duration-500 focus:outline-none bg-blue-100 dark:bg-slate-700 shadow-inner group overflow-hidden border-2 border-transparent hover:border-kids-yellow/50"
      aria-label="Toggle Theme"
    >
      <div 
        className={`absolute top-1 left-1 w-6 h-6 md:w-8 md:h-8 rounded-full shadow-lg transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center justify-center
        ${isDark ? 'translate-x-8 md:translate-x-10 bg-slate-100 rotate-[360deg]' : 'translate-x-0 bg-kids-yellow rotate-0'}`}
      >
        {isDark ? (
          <i className="fas fa-moon text-kids-midnight text-[10px] md:text-sm animate-pop-in"></i>
        ) : (
          <i className="fas fa-sun text-white text-[10px] md:text-sm animate-spin-slow"></i>
        )}
      </div>
      <div className="flex justify-between items-center h-full px-2 opacity-20 pointer-events-none">
        <i className="fas fa-sun text-[10px] md:text-xs"></i>
        <i className="fas fa-moon text-[10px] md:text-xs"></i>
      </div>
    </button>
  );
};

const Navigation: React.FC<NavigationProps> = ({ activePage, onNavigate, isDarkMode, onToggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { label: string; id: PageId; color: string; icon: string }[] = [
    { label: 'Home', id: 'home', color: 'kids-blue', icon: '🏠' },
    { label: 'About', id: 'about', color: 'kids-pink', icon: '📖' },
    { label: 'Academics', id: 'academics', color: 'kids-teal', icon: '✏️' },
    { label: 'Facilities', id: 'facilities', color: 'kids-green', icon: '🏫' },
    { label: 'Activities', id: 'activities', color: 'kids-yellow', icon: '⚽' },
    { label: 'Gallery', id: 'gallery', color: 'kids-purple', icon: '🖼️' },
    { label: 'FAQ', id: 'faq', color: 'kids-orange', icon: '❓' },
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700">
      {/* Top Highlight Bar */}
      <div className="bg-kids-dark dark:bg-black text-white py-1.5 px-4 text-[8px] md:text-[10px] font-bold text-center flex items-center justify-center gap-2 md:gap-4 shadow-md transition-colors duration-700 overflow-hidden">
        <span className="flex items-center gap-1 whitespace-nowrap">BSA Recognized | UDISE+ Registered | Recognition No: MEE09078453699</span>
        <span className="hidden lg:inline opacity-30">|</span>
        <span className="hidden lg:flex items-center gap-1 whitespace-nowrap"><span className="hidden sm:inline">🤖</span> FREE AI Classes for Kids</span>
        <span className="hidden lg:inline opacity-30">|</span>
        <span className="hidden md:flex items-center gap-1 whitespace-nowrap"><span className="hidden sm:inline">📞</span> {SCHOOL_INFO.phone}</span>
      </div>

      {/* Main Nav Bar with Glassmorphism */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-kids-xl border-b-4 border-kids-yellow relative h-20 md:h-24 flex items-center transition-all duration-700">
        <div className="container mx-auto px-4 flex justify-between items-center w-full">
          
          {/* Circular Hanging Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="relative cursor-pointer z-[60]"
          >
            <div className="absolute top-0 left-0 w-24 h-24 md:w-36 md:h-36 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-kids-xl overflow-hidden border-4 border-kids-pink ring-8 ring-white/40 dark:ring-slate-700/40 transition-all duration-700">
              <img 
                src={ASSETS.branding.logo} 
                alt="Gurukul Logo" 
                className="w-[85%] h-[85%] object-cover rounded-full" 
              />
            </div>
            
            <div className="ml-28 md:ml-40">
              <h1 className="text-lg md:text-2xl font-display font-bold text-kids-dark dark:text-white leading-none hover:text-kids-pink transition">
                {SCHOOL_INFO.name}
              </h1>
              <p className="text-[8px] md:text-[10px] font-black text-kids-green uppercase tracking-widest mt-0.5 whitespace-nowrap">
                {SCHOOL_INFO.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:flex space-x-1 font-bold text-gray-700 dark:text-gray-200 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all hover:bg-${item.color}/10 ${activePage === item.id ? `bg-${item.color}/20 text-kids-dark dark:text-white ring-2 ring-${item.color}/30` : 'hover:scale-105'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-lg font-display font-bold tracking-tight">{item.label}</span>
              </button>
            ))}
            
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-3 transition-colors"></div>
            
            <ThemeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
            
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-3 transition-colors"></div>
            
            <button 
              onClick={() => handleNavClick('contact')}
              className="px-5 py-2.5 bg-kids-yellow text-kids-dark rounded-xl shadow-fun hover:shadow-fun-hover hover:translate-x-0.5 hover:translate-y-0.5 transition-all border-2 border-kids-dark font-display font-bold uppercase tracking-wider text-base"
            >
              Apply 🚀
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="xl:hidden flex items-center gap-3">
            <ThemeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="bg-kids-blue/10 p-2 rounded-xl text-kids-blue text-xl hover:bg-kids-blue/20 transition-colors"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="xl:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b-8 border-kids-blue p-4 shadow-2xl animate-pop-in rounded-b-[2rem] transition-all duration-700">
          <div className="grid grid-cols-2 gap-3 font-bold text-center">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-colors ${activePage === item.id ? 'bg-kids-blue/10 text-kids-blue dark:text-white' : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200'}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-base font-display uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
            <button 
              onClick={() => handleNavClick('contact')}
              className="col-span-2 bg-kids-pink text-white py-3.5 rounded-2xl shadow-fun font-display font-bold text-xl"
            >
              Enroll Now 🎒
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
