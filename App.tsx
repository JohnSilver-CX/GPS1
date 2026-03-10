
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation.tsx';
import FloatingContactButtons from './components/FloatingContactButtons.tsx';
import CursorTrail from './components/CursorTrail.tsx';
import { GamesSection } from './components/Games.tsx';
import { FAQSection } from './components/FAQ.tsx';
import { PageId } from './types.ts';
import { SCHOOL_INFO, THOUGHTS } from './constants.tsx';
import { ASSETS } from './assets.ts';
import { getDailyThought } from './services/geminiService.ts';

// --- Smart Image Component with Fallback ---
const SmartImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackKeyword?: string;
  loading?: "lazy" | "eager";
}> = ({ src, alt, className, fallbackKeyword = "school", loading = "lazy" }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(`https://picsum.photos/800/600?random=${fallbackKeyword || alt}`);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      onError={handleError}
      loading={loading}
    />
  );
};

// --- Mini Admission Form Component ---
const AdmissionForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    childName: '',
    dob: '',
    grade: '',
    parentName: '',
    phone: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `*New Admission Enquiry*%0A%0A` +
      `*Child's Name:* ${formData.childName}%0A` +
      `*DOB:* ${formData.dob}%0A` +
      `*Grade:* ${formData.grade}%0A` +
      `*Parent's Name:* ${formData.parentName}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Email:* ${formData.email}`;

    const cleanPhone = SCHOOL_INFO.phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    
    const emailSubject = "enquiry";
    const emailBody = `New Admission Enquiry\n\n` +
      `Child's Name: ${formData.childName}\n` +
      `DOB: ${formData.dob}\n` +
      `Grade: ${formData.grade}\n` +
      `Parent's Name: ${formData.parentName}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email}`;
    
    const mailtoUrl = `mailto:${SCHOOL_INFO.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Trigger Email client
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 500);

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-kids-xl border-4 border-kids-green animate-pop-in text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h3 className="text-3xl font-display font-bold text-kids-dark dark:text-white mb-4">Application Sent!</h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium">We've opened WhatsApp and your Email client to send the enquiry to {SCHOOL_INFO.name}. Our counselor will contact you soon!</p>
        <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-kids-green text-white rounded-full font-bold shadow-fun hover:translate-y-1 transition-all">Apply for another child</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] shadow-kids-xl border-4 border-kids-yellow space-y-6 transition-all">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-display font-bold text-kids-dark dark:text-white">Start the Adventure! 🚀</h3>
        <p className="text-gray-500 dark:text-gray-400 font-bold">Fill this little form to begin admission for 2024-25</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2 text-left">
          <label className="block text-sm font-black text-kids-purple dark:text-kids-purple uppercase tracking-widest ml-4">Child's Name</label>
          <input 
            required 
            type="text" 
            name="childName"
            value={formData.childName}
            onChange={handleChange}
            placeholder="e.g. Aarav Singh" 
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-kids-purple focus:bg-white dark:focus:bg-slate-700 outline-none transition-all font-bold dark:text-white" 
          />
        </div>
        <div className="space-y-2 text-left">
          <label className="block text-sm font-black text-kids-purple uppercase tracking-widest ml-4">Date of Birth</label>
          <input 
            required 
            type="date" 
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-kids-purple focus:bg-white dark:focus:bg-slate-700 outline-none transition-all font-bold dark:text-white" 
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2 text-left">
          <label className="block text-sm font-black text-kids-purple uppercase tracking-widest ml-4">Grade Applying For</label>
          <select 
            required 
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-kids-purple focus:bg-white dark:focus:bg-slate-700 outline-none transition-all font-bold dark:text-white"
          >
            <option value="">Select Class...</option>
            <option>Playgroup</option>
            <option>Nursery</option>
            <option>KG</option>
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 3</option>
            <option>Class 4</option>
            <option>Class 5</option>
          </select>
        </div>
        <div className="space-y-2 text-left">
          <label className="block text-sm font-black text-kids-purple uppercase tracking-widest ml-4">Parent's Name</label>
          <input 
            required 
            type="text" 
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            placeholder="e.g. Mr. Rajesh Singh" 
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-kids-purple focus:bg-white dark:focus:bg-slate-700 outline-none transition-all font-bold dark:text-white" 
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2 text-left">
          <label className="block text-sm font-black text-kids-purple uppercase tracking-widest ml-4">Phone Number</label>
          <input 
            required 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 9876543210" 
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-kids-purple focus:bg-white dark:focus:bg-slate-700 outline-none transition-all font-bold dark:text-white" 
          />
        </div>
        <div className="space-y-2 text-left">
          <label className="block text-sm font-black text-kids-purple uppercase tracking-widest ml-4">Parent's Email</label>
          <input 
            required 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. parent@example.com" 
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-kids-purple focus:bg-white dark:focus:bg-slate-700 outline-none transition-all font-bold dark:text-white" 
          />
        </div>
      </div>

      <button type="submit" className="w-full py-5 bg-kids-pink text-white text-xl font-display font-bold rounded-2xl shadow-fun hover:translate-x-1 hover:translate-y-1 transition-all mt-4">
        Submit Application 📝✨
      </button>
    </form>
  );
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [dailyThought, setDailyThought] = useState(THOUGHTS[0]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }

    const fetchThought = async () => {
      const thought = await getDailyThought();
      setDailyThought(thought || THOUGHTS[0]);
    };
    fetchThought();
  }, []);

  useEffect(() => {
    if (activePage === 'gallery') {
      const timer = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % ASSETS.gallery.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [activePage]);

  const renderHome = () => (
    <div className="animate-pop-in space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-20 lg:pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center bg-kids-blue/5 dark:bg-kids-midnight/20">
        <div className="absolute inset-0 -z-20 overflow-hidden">
          {!videoError ? (
            <video 
              key={ASSETS.videos.heroBackground}
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover scale-105 opacity-80 dark:opacity-40"
              poster={ASSETS.sections.schoolBuilding}
              onError={() => setVideoError(true)}
            >
              <source src={ASSETS.videos.heroBackground} type="video/mp4" />
            </video>
          ) : (
            <SmartImage 
              src={ASSETS.sections.schoolBuilding} 
              alt="School Hero Background" 
              className="w-full h-full object-cover scale-105 opacity-80 dark:opacity-40"
            />
          )}

          {/* Enhanced Background Animated Blobs */}
          <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-kids-blue/30 dark:bg-kids-blue/10 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[5%] right-[-10%] w-[45%] h-[45%] bg-kids-pink/35 dark:bg-kids-pink/15 rounded-full blur-[90px] animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[15%] right-[5%] w-[35%] h-[35%] bg-kids-yellow/30 dark:bg-kids-yellow/10 rounded-full blur-[110px] animate-blob" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-kids-green/25 dark:bg-kids-green/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '6s' }}></div>

          {/* Refined Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent lg:to-transparent dark:from-kids-midnight/90 dark:via-kids-midnight/50 dark:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 dark:to-kids-midnight"></div>
        </div>

        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="lg:w-3/5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 px-4 py-2 rounded-full shadow-md mb-8 border-2 border-kids-yellow animate-bounce-subtle">
              <span className="text-xl">🏆</span>
              <span className="font-bold text-sm text-kids-orange uppercase tracking-wider">No. 1 Primary School in Meerut cantt</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-display font-bold leading-[1.1] mb-6">
              <span className="text-kids-blue hero-glow-blue">Where Every Child </span><br/>
              <span className="text-kids-pink hero-glow-pink">is a Hero! </span>
              <span className="text-kids-orange inline-block animate-wiggle">✨</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-200 mb-10 font-medium leading-relaxed max-w-2xl">
              Since {SCHOOL_INFO.estd}, we've been blending <strong>Traditional Values</strong> with <strong>AI-Integrated Skills</strong> to nurture the leaders of tomorrow.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button onClick={() => setActivePage('contact')} className="group relative px-10 py-5 bg-kids-pink text-white text-xl font-display font-bold rounded-[2rem] shadow-fun hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden">
                <span className="relative z-10">Enroll Today 🚀</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </button>
              <button onClick={() => setActivePage('activities')} className="px-10 py-5 bg-white dark:bg-slate-800 text-kids-blue dark:text-kids-blue text-xl font-display font-bold rounded-[2rem] shadow-fun border-4 border-kids-blue hover:bg-blue-50 dark:hover:bg-slate-700 transition-all">
                Explore Fun Zone 🎮
              </button>
            </div>

            <div className="mt-12 group max-w-xl mx-auto lg:mx-0">
              <div className="glass-card p-6 rounded-[2.5rem] shadow-kids-xl border-l-[12px] border-kids-yellow transform group-hover:-rotate-1 transition-transform">
                <div className="flex gap-4">
                  <div className="text-3xl text-kids-yellow"><i className="fas fa-magic"></i></div>
                  <div>
                    <h4 className="text-[10px] font-black text-kids-purple uppercase tracking-widest mb-1">Magical Thought</h4>
                    <p className="text-gray-800 dark:text-gray-100 font-bold italic text-base md:text-xl leading-snug">"{dailyThought}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/5 relative hidden lg:block">
            <div className="relative z-10">
              <div className="absolute -inset-10 bg-kids-pink/40 dark:bg-kids-pink/20 rounded-full blur-[60px] animate-pulse"></div>
              <SmartImage 
                src={ASSETS.sections.heroKids} 
                alt="Happy Kids" 
                className="blob-shape w-full shadow-2xl border-[12px] border-white dark:border-slate-800 animate-float ring-8 ring-kids-blue/10 object-cover aspect-square"
              />
              <div className="absolute -bottom-8 -right-4 bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-xl border-4 border-kids-green animate-bounce">
                <p className="font-display font-bold text-kids-green text-center text-sm">
                  <span className="text-2xl">🤖</span><br/>AI Learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-kids-dark dark:text-white mb-4">Why Parents Love Us ❤️</h2>
            <div className="w-24 h-2 bg-kids-pink mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { color: 'bg-kids-blue', icon: '🛡️', title: 'Utmost Safety', text: 'CCTV surveillance & GPS tracked transport for peace of mind.' },
              { color: 'bg-kids-green', icon: '🧠', title: 'Holistic Growth', text: 'Yoga, Value Education, and Sports alongside core academics.' },
              { color: 'bg-kids-purple', icon: '💻', title: 'Future Ready', text: 'Innovative AI classes for kids from Class 1 onwards.' }
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 rounded-[3rem] shadow-fun hover:-translate-y-4 transition-all group">
                <div className={`${item.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl mb-6 shadow-lg transform group-hover:rotate-12 transition-transform text-white`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal Section */}
      <section className="py-20 bg-kids-purple/5 dark:bg-slate-900/40">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto glass-card rounded-[4rem] p-10 md:p-16 border-4 border-white dark:border-slate-800 shadow-kids-xl flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative transition-all duration-700">
            <div className="lg:w-1/3 text-center">
              <div className="relative inline-block">
                <SmartImage 
                  src={ASSETS.branding.prin} 
                  className="w-64 h-64 rounded-full border-[10px] border-white dark:border-slate-800 shadow-2xl mx-auto object-cover"
                  alt="Principal"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-kids-yellow text-kids-dark px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white dark:border-slate-800 whitespace-nowrap">
                  Principal's Desk
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-display font-bold text-kids-dark dark:text-white">{SCHOOL_INFO.principal}</h3>
                <p className="text-kids-purple font-black uppercase tracking-widest text-xs mt-1">Leading Gurukul since {SCHOOL_INFO.estd}</p>
              </div>
            </div>
            <div className="lg:w-2/3 space-y-6">
              <div className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-3xl border-l-8 border-kids-pink shadow-sm">
                <h4 className="text-xl font-display font-bold text-kids-pink mb-4 italic">"Dear Parents & My Dear Little Ones,"</h4>
                <p className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed text-lg">
                  Welcome to our family. Since <strong>{SCHOOL_INFO.estd}</strong>, Gurukul Public School has been a beacon of nurturing and innovation in Meerut Cantt. We believe that every child is unique, which is why we've introduced <strong>AI-integrated learning</strong> to prepare them for the 21st century.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Updates / Instagram Feed */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-kids-dark dark:text-white mb-4">Recent Updates 📸</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-6">Catch the latest smiles and activities from our campus!</p>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <i className="fab fa-instagram text-xl"></i> Follow @gurukulmeerut
            </a>
          </div>
          
          {/* Elfsight Instagram Feed Widget */}
          <div className="max-w-6xl mx-auto relative group mt-8">
            {/* Decorative floating elements */}
            <div className="absolute -top-8 -left-8 text-5xl animate-bounce z-10 hidden md:block drop-shadow-lg">✨</div>
            <div className="absolute -bottom-8 -right-8 text-5xl animate-wiggle z-10 hidden md:block drop-shadow-lg">🎨</div>
            <div className="absolute top-1/2 -right-12 text-4xl animate-float z-10 hidden lg:block drop-shadow-lg">🚀</div>
            <div className="absolute top-1/2 -left-12 text-4xl animate-float z-10 hidden lg:block drop-shadow-lg" style={{ animationDelay: '1s' }}>🌟</div>
            
            {/* Branded Glass Container */}
            <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-3 md:p-8 rounded-[3rem] shadow-kids-xl border-4 border-kids-pink/30 group-hover:border-kids-pink transition-all duration-500">
              {/* Inner wrapper to enforce border radius on the widget itself */}
              <div className="rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 shadow-inner">
                <div className="elfsight-app-1a9fefce-e8d8-4f71-a5f4-6087da24cb10" data-elfsight-app-lazy></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'home': return renderHome();
      case 'about': return (
        <section className="py-20 animate-pop-in container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center">
              <h2 className="text-5xl font-display font-bold text-kids-pink mb-4">Nurturing Since {SCHOOL_INFO.estd}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-3xl mx-auto">
                Discover the legacy, vision, and core values that make Gurukul Public School the best primary school in Meerut.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-12 bg-white/90 dark:bg-slate-800/90 p-10 rounded-[4rem] shadow-kids-xl border-4 border-white dark:border-slate-700 transition-all">
              <div className="lg:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  <SmartImage src={ASSETS.sections.event} className="rounded-[2rem] shadow-lg transform rotate-2 aspect-video object-cover" alt="Event" />
                  <SmartImage src={ASSETS.sections.classroom} className="rounded-[2rem] shadow-lg transform -rotate-3 aspect-video object-cover" alt="Class" />
                  <SmartImage src={ASSETS.sections.playground} className="rounded-[2rem] shadow-lg transform -rotate-2 mt-4 aspect-video object-cover" alt="Play" />
                  <SmartImage src={ASSETS.sections.schoolBuilding} className="rounded-[2rem] shadow-lg transform rotate-4 mt-2 aspect-video object-cover" alt="School" />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <h3 className="text-3xl font-display font-bold text-kids-blue mb-4">Our Mission 🎯</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-200 font-medium leading-relaxed italic border-l-4 border-kids-blue pl-4">
                    "To provide an environment that is not just a school, but a second home where discovery happens through play, love, and modern technology."
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl font-display font-bold text-kids-green mb-4">Our Vision 👁️</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                    To empower the next generation of thinkers, creators, and leaders by blending India's rich traditional values with cutting-edge AI and digital education, ensuring every child is future-ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values Section */}
            <div className="pt-10">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-display font-bold text-kids-dark dark:text-white mb-4">Our Core Values ⭐</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">The pillars that guide our educational philosophy.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Compassion', icon: '❤️', color: 'bg-kids-pink', desc: 'Fostering empathy and kindness in every interaction.' },
                  { title: 'Innovation', icon: '💡', color: 'bg-kids-yellow', desc: 'Encouraging creative thinking and problem-solving.' },
                  { title: 'Integrity', icon: '🛡️', color: 'bg-kids-blue', desc: 'Building strong moral character and honesty.' },
                  { title: 'Excellence', icon: '🏆', color: 'bg-kids-purple', desc: 'Striving for the best in academics and personal growth.' }
                ].map((value, idx) => (
                  <div key={idx} className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform border-b-8 border-transparent hover:border-current" style={{ color: `var(--color-${value.color.replace('bg-', '')})` }}>
                    <div className={`${value.color} w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl text-white mb-4 shadow-lg`}>
                      {value.icon}
                    </div>
                    <h4 className="text-xl font-display font-bold text-kids-dark dark:text-white mb-2">{value.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* History Section */}
            <div className="bg-kids-orange/10 dark:bg-slate-800/60 rounded-[4rem] p-10 md:p-16 border-2 border-kids-orange/20 flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-1/3 text-center">
                <div className="text-7xl mb-4">🏛️</div>
                <h3 className="text-3xl font-display font-bold text-kids-orange">Our Legacy</h3>
                <p className="text-kids-dark dark:text-white font-black text-xl mt-2">34+ Years of Excellence</p>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-4">
                  Founded in {SCHOOL_INFO.estd}, Gurukul Public School started with a simple dream: to make quality English-medium education accessible to the children of Meerut Cantt. Over the decades, we have grown from a small primary learning center into a pioneering institution.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                  Today, we stand proud as the first primary school in the region to integrate an AI School Curriculum, proving that while our roots are deeply traditional, our branches reach far into the future.
                </p>
              </div>
            </div>
          </div>
        </section>
      );
      case 'academics': return (
        <section className="py-20 animate-pop-in container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-20">
            <div className="text-center">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-kids-blue mb-4">Academic Excellence 🎓</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-3xl mx-auto">Blending global standards with heart-centered teaching for Playgroup to Class 5.</p>
            </div>

            {/* AI Spotlight Section */}
            <div className="bg-gradient-to-r from-kids-purple to-kids-pink p-1 rounded-[3rem] shadow-kids-xl transform hover:scale-[1.01] transition-transform">
              <div className="bg-white dark:bg-slate-800 rounded-[2.8rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/3">
                  <div className="bg-kids-purple/10 w-full aspect-square rounded-[3rem] flex items-center justify-center text-9xl animate-float">🤖</div>
                </div>
                <div className="lg:w-2/3 space-y-6">
                  <span className="bg-kids-yellow text-kids-dark px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest">Industry First</span>
                  <h3 className="text-4xl font-display font-bold text-kids-purple leading-tight">AI & Future-Ready Curriculum</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    We are pioneers in Meerut, introducing <strong>Artificial Intelligence and Logic-based Coding</strong> from Class 1. We prepare our students for a world where AI is everywhere, teaching them to be creators, not just consumers.
                  </p>
                  <ul className="grid grid-cols-2 gap-4">
                    <li className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400"><span className="text-kids-green text-xl">✔</span> Visual Coding</li>
                    <li className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400"><span className="text-kids-green text-xl">✔</span> Robotics Basics</li>
                    <li className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400"><span className="text-kids-green text-xl">✔</span> Critical Thinking</li>
                    <li className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400"><span className="text-kids-green text-xl">✔</span> AI Ethics for Kids</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Class 3-5 Advanced Module (NEW SECTION) */}
            <div className="py-12 bg-kids-blue/5 dark:bg-slate-800/40 rounded-[4rem] px-8 md:px-16 border-2 border-kids-blue/20">
              <div className="text-center mb-16">
                <div className="inline-block bg-kids-blue text-white px-6 py-2 rounded-full font-bold mb-4 shadow-md">Classes 3 to 5</div>
                <h3 className="text-4xl md:text-5xl font-display font-bold text-kids-dark dark:text-white">AI & Future Skills Module 🚀</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto mt-4">Scaling up digital intelligence for our senior primary stars with a focused three-pillar curriculum.</p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-10">
                {[
                  {
                    icon: 'fa-microchip',
                    title: 'Introduction to AI Concepts',
                    desc: 'Demystifying algorithms and machine learning through fun experiments and real-world examples. Kids learn how Netflix recommends movies or how Siri understands us!',
                    color: 'text-kids-blue',
                    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
                    borderColor: 'border-kids-blue'
                  },
                  {
                    icon: 'fa-brands fa-python',
                    title: 'Basic Python for Kids',
                    desc: 'Moving beyond simple blocks to real coding! Using Turtle graphics and child-friendly libraries, students write their first lines of Python code.',
                    color: 'text-kids-orange',
                    bgColor: 'bg-orange-100 dark:bg-orange-900/40',
                    borderColor: 'border-kids-orange'
                  },
                  {
                    icon: 'fa-user-shield',
                    title: 'Digital Citizenship',
                    desc: 'Nurturing responsible netizen behavior. We teach online safety, privacy protection, and the importance of being kind and ethical in the digital world.',
                    color: 'text-kids-pink',
                    bgColor: 'bg-pink-100 dark:bg-pink-900/40',
                    borderColor: 'border-kids-pink'
                  }
                ].map((item, i) => (
                  <div key={i} className={`group bg-white dark:bg-slate-800 p-10 rounded-[3.5rem] border-b-8 ${item.borderColor} shadow-kids-xl hover:-translate-y-3 transition-all flex flex-col items-center text-center relative overflow-hidden`}>
                    <div className={`${item.bgColor} ${item.color} w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner`}>
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <h4 className={`text-2xl font-display font-bold mb-4 ${item.color}`}>{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{item.desc}</p>
                    <div className={`absolute top-0 right-0 w-16 h-16 ${item.bgColor} opacity-20 rounded-bl-[3rem] transform translate-x-4 -translate-y-4`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Grade Overviews */}
            <div className="grid md:grid-cols-2 gap-12">
              <div className="glass-card p-10 rounded-[4rem] border-b-[12px] border-kids-blue shadow-kids-xl">
                <div className="text-5xl mb-6">🧸</div>
                <h3 className="text-3xl font-display font-bold text-kids-blue mb-4">Pre-Primary (Playgroup - KG)</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6">
                  Focusing on <strong>Social, Emotional, and Physical development</strong> through the Play-Way method. We emphasize fine motor skills and sensory play.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-blue-50 dark:bg-blue-900/40 text-kids-blue px-3 py-1 rounded-full text-xs font-bold">Phonics</span>
                  <span className="bg-blue-50 dark:bg-blue-900/40 text-kids-blue px-3 py-1 rounded-full text-xs font-bold">Art & Craft</span>
                  <span className="bg-blue-50 dark:bg-blue-900/40 text-kids-blue px-3 py-1 rounded-full text-xs font-bold">Rhymes</span>
                  <span className="bg-blue-50 dark:bg-blue-900/40 text-kids-blue px-3 py-1 rounded-full text-xs font-bold">Storytelling</span>
                </div>
              </div>

              <div className="glass-card p-10 rounded-[4rem] border-b-[12px] border-kids-green shadow-kids-xl">
                <div className="text-5xl mb-6">📝</div>
                <h3 className="text-3xl font-display font-bold text-kids-green mb-4">Primary (Class 1 - 2)</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6">
                  A robust academic foundation based on <strong>Activity-based Learning</strong>. We cultivate a love for languages, math, and basic computer logic.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-green-50 dark:bg-green-900/40 text-kids-green px-3 py-1 rounded-full text-xs font-bold">STEM</span>
                  <span className="bg-green-50 dark:bg-green-900/40 text-kids-green px-3 py-1 rounded-full text-xs font-bold">Grammar</span>
                  <span className="bg-green-50 dark:bg-green-900/40 text-kids-green px-3 py-1 rounded-full text-xs font-bold">EVS</span>
                  <span className="bg-green-50 dark:bg-green-900/40 text-kids-green px-3 py-1 rounded-full text-xs font-bold">Block Coding</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
      case 'facilities': return (
        <section className="py-20 animate-pop-in container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center">
              <h2 className="text-5xl font-display font-bold text-kids-green mb-4">Primary School Facilities 🏫</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">Providing a safe, nurturing, and high-tech environment for our little learners.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  icon: '👩‍🏫', 
                  title: '10:1 Student-Teacher Ratio', 
                  desc: 'Every child is seen! Our ultra-low ratio ensures individual attention and personalized guidance for every student.',
                  color: 'border-kids-yellow',
                  img: ASSETS.sections.classroom
                },
                { 
                  icon: '🤖', 
                  title: 'AI & Robotics Lab', 
                  desc: 'First in Meerut to provide hands-on AI learning tools for kids as young as 6 years old.',
                  color: 'border-kids-purple',
                  img: ASSETS.sections.event
                },
                { 
                  icon: '🎬', 
                  title: 'Interactive Smart Class', 
                  desc: 'Multi-touch interactive screens designed for primary education, making abstract concepts visible and fun.',
                  color: 'border-kids-blue',
                  img: ASSETS.sections.classroom
                },
                { 
                  icon: '🤸', 
                  title: 'Safe Play Zone', 
                  desc: 'Soft-padded outdoor playground and indoor activity rooms for safe physical growth.',
                  color: 'border-kids-green',
                  img: ASSETS.sections.playground
                },
                { 
                  icon: '🚌', 
                  title: 'GPS-Enabled Vans', 
                  desc: 'Dedicated school transport with GPS tracking and lady attendants for maximum safety.',
                  color: 'border-kids-orange',
                  img: ASSETS.sections.schoolBuilding
                },
                { 
                  icon: '🛡️', 
                  title: 'Child-Safe Campus', 
                  desc: 'Rounded edges, child-proofed furniture, and 24/7 CCTV surveillance throughout the campus.',
                  color: 'border-kids-pink',
                  img: ASSETS.branding.logo
                }
              ].map((facility, i) => (
                <div key={i} className={`glass-card rounded-[3rem] overflow-hidden border-b-[12px] ${facility.color} shadow-kids-xl hover:-translate-y-2 transition-transform group`}>
                  <div className="h-48 overflow-hidden">
                    <SmartImage src={facility.img} alt={facility.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-8">
                    <div className="text-4xl mb-4">{facility.icon}</div>
                    <h3 className="text-2xl font-display font-bold text-kids-dark dark:text-white mb-3">{facility.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{facility.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Feature Summary Focus on Ratio */}
            <div className="bg-kids-blue/10 dark:bg-kids-midnight rounded-[4rem] p-10 md:p-16 border-4 border-dashed border-kids-blue flex flex-col lg:flex-row items-center gap-10 transition-all">
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-block bg-kids-yellow text-kids-dark px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest">Our Top Advantage</div>
                <h3 className="text-4xl font-display font-bold text-kids-dark dark:text-white leading-tight">Meerut's Most Personalized Primary Experience 🌳</h3>
                <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  At Gurukul, we believe foundational years require direct care. That's why we maintain a strictly <strong className="text-kids-blue text-2xl">Low Student-Teacher Ratio of 10:1</strong>.
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium italic">
                  "In a class of just 10, no question goes unanswered and no talent goes unnoticed."
                </p>
                <div className="flex gap-4">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm text-center flex-1 transition-all border-b-4 border-kids-yellow">
                    <span className="block text-3xl mb-1 font-display font-bold text-kids-blue">10:1</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Class Ratio</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm text-center flex-1 transition-all border-b-4 border-kids-green">
                    <span className="block text-2xl mb-1">🚿</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Hygenic Campus</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm text-center flex-1 transition-all border-b-4 border-kids-pink">
                    <span className="block text-2xl mb-1">🧤</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Clean & Tidy</span>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <SmartImage src={ASSETS.sections.classroom} alt="Small Class" className="rounded-[3rem] shadow-2xl border-8 border-white dark:border-slate-800 transform rotate-2" />
                  <div className="absolute -bottom-6 -left-6 bg-kids-pink text-white p-6 rounded-3xl shadow-xl animate-bounce-subtle">
                    <p className="font-display font-bold text-xl">1 Teacher per<br/>10 Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
      case 'gallery': return (
        <section className="py-20 animate-pop-in container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-display font-bold text-kids-purple mb-4">Smiling Faces 📸</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Capture the joy and moments of our primary students.</p>
          </div>

          {/* Large Image Carousel */}
          <div className="mb-24">
            <h3 className="text-3xl font-display font-bold text-kids-blue mb-8 text-center">Moments in Time ✨</h3>
            <div className="relative max-w-5xl mx-auto rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-slate-800 transition-all bg-gray-100">
              <SmartImage 
                src={ASSETS.gallery[carouselIndex]} 
                className="w-full h-[300px] md:h-[500px] object-cover transition-opacity duration-700" 
                alt="Gallery" 
              />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-white/30 backdrop-blur-md rounded-full shadow-lg">
                {ASSETS.gallery.map((_, i) => (
                  <button key={i} onClick={() => setCarouselIndex(i)} className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all ${i === carouselIndex ? 'bg-kids-yellow w-8 md:w-10' : 'bg-white/60'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Video Catalog Section */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display font-bold text-kids-pink mb-4 italic underline decoration-kids-yellow decoration-4">Video Gallery 🎬</h3>
              <p className="text-gray-500 font-bold">Watch our little stars in action!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {ASSETS.galleryVideos.map((videoSrc, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-[3rem] shadow-kids-xl border-4 border-white dark:border-slate-700 hover:scale-[1.02] transition-transform overflow-hidden group">
                  <div className="aspect-video rounded-[2.2rem] overflow-hidden bg-kids-midnight relative">
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    >
                      <source src={videoSrc} type="video/mp4" />
                    </video>
                  </div>
                  <div className="mt-4 px-4 pb-2">
                    <h4 className="font-display font-bold text-lg text-kids-dark dark:text-white">Active Learning Session #{idx + 1}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium italic">Playful discovery on our vibrant campus</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
      case 'contact': return (
        <section className="py-20 animate-pop-in container mx-auto px-4 max-w-5xl">
           <div className="text-center mb-16 space-y-4">
             <h2 className="text-5xl font-display font-bold text-kids-pink">Admission Form 🎒</h2>
             <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Join Meerut's most loved Primary School. Limited seats available for 2024-25!</p>
           </div>
           
           <div className="flex flex-col lg:flex-row gap-12 items-start">
             <div className="lg:w-3/5 w-full">
               <AdmissionForm />
             </div>
             
             <div className="lg:w-2/5 w-full space-y-8">
               <div className="glass-card p-8 rounded-[3rem] border-l-[12px] border-kids-blue shadow-kids-xl transition-all">
                 <h4 className="text-2xl font-display font-bold text-kids-blue mb-4">Our Location 📍</h4>
                 <p className="text-gray-700 dark:text-gray-200 font-bold mb-2">{SCHOOL_INFO.address}</p>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium">Located conveniently near Hazari Ka Piyau, ensuring easy access for parents in Meerut Cantt.</p>
                 <a href="#" className="text-kids-blue font-black underline hover:text-kids-dark dark:hover:text-white transition-colors">View on Google Maps →</a>
               </div>

               <div className="glass-card p-8 rounded-[3rem] border-l-[12px] border-kids-green shadow-kids-xl transition-all">
                 <h4 className="text-2xl font-display font-bold text-kids-green mb-4">Contact Us 📞</h4>
                 <p className="text-gray-700 dark:text-gray-200 font-bold mb-1">Office: {SCHOOL_INFO.phone}</p>
                 <p className="text-gray-700 dark:text-gray-200 font-bold mb-6">Email: admissions@gurukulmeerut.com</p>
                 <div className="flex gap-4">
                   <button className="bg-kids-green text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition">Call Now</button>
                   <button className="bg-white dark:bg-slate-700 border-2 border-kids-green text-kids-green dark:text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition">WhatsApp</button>
                 </div>
               </div>

               <div className="bg-kids-purple text-white p-8 rounded-[3rem] shadow-kids-xl relative overflow-hidden transition-all">
                 <div className="relative z-10">
                   <h4 className="text-2xl font-display font-bold mb-2">Age Criteria 🎂</h4>
                   <ul className="space-y-2 text-sm font-bold opacity-90">
                     <li>Playgroup: 2+ Years</li>
                     <li>Nursery: 3+ Years</li>
                     <li>KG: 4+ Years</li>
                     <li>Class 1: 5+ Years</li>
                   </ul>
                 </div>
                 <div className="absolute -bottom-4 -right-4 text-7xl opacity-20">🧸</div>
               </div>
             </div>
           </div>
        </section>
      );
      case 'activities': return <section className="py-20 container mx-auto px-4 transition-all"><GamesSection /></section>;
      case 'faq': return <FAQSection />;
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden transition-all duration-700">
      <CursorTrail />
      <div className="fixed inset-0 -z-30 bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-kids-midnight transition-all duration-700"></div>
      <Navigation 
        activePage={activePage} 
        onNavigate={setActivePage} 
        isDarkMode={isDarkMode} 
        onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
      />
      <main className="flex-grow relative z-10 pt-28 md:pt-36">{renderContent()}</main>
      
      <footer className="bg-kids-dark dark:bg-black text-white pt-20 pb-12 text-center transition-all duration-700">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl mb-2 text-kids-yellow">{SCHOOL_INFO.name}</h2>
          <p className="opacity-80 text-sm mb-6">{SCHOOL_INFO.address}</p>
          
          <div className="bg-white/5 inline-block px-6 py-3 rounded-2xl mb-8 border border-white/10">
            <p className="text-[10px] md:text-xs font-black tracking-widest uppercase opacity-70">
              BSA Recognized | UDISE+ Registered | Recognition No: MEE09078453699
            </p>
          </div>
          
          <div className="mb-8 flex flex-wrap justify-center gap-2 opacity-70 max-w-3xl mx-auto">
            <span className="text-[10px] md:text-xs bg-white/10 hover:bg-white/20 cursor-pointer transition-colors rounded-full px-3 py-1.5">Best School in Meerut</span>
            <span className="text-[10px] md:text-xs bg-white/10 hover:bg-white/20 cursor-pointer transition-colors rounded-full px-3 py-1.5">AI School Curriculum</span>
            <span className="text-[10px] md:text-xs bg-white/10 hover:bg-white/20 cursor-pointer transition-colors rounded-full px-3 py-1.5">Top 5 Schools in Meerut</span>
            <span className="text-[10px] md:text-xs bg-white/10 hover:bg-white/20 cursor-pointer transition-colors rounded-full px-3 py-1.5">Primary School Meerut Cantt</span>
            <span className="text-[10px] md:text-xs bg-white/10 hover:bg-white/20 cursor-pointer transition-colors rounded-full px-3 py-1.5">Academic Excellence</span>
          </div>
          
          <div className="mb-10 text-lg font-display font-bold flex items-center justify-center gap-2">
            Made with <span className="inline-block animate-heart-flash text-kids-pink drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">❤️</span> for kids
          </div>

          <p className="text-[10px] opacity-40 font-bold tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Gurukul Public School - Nurturing Stars for Over 34 Years
          </p>
        </div>
      </footer>
      
      <FloatingContactButtons />
    </div>
  );
};

export default App;
