
import React from 'react';
import { SCHOOL_INFO } from '../constants.tsx';

const FloatingContactButtons: React.FC = () => {
  const cleanPhone = SCHOOL_INFO.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}`;
  const callUrl = `tel:${SCHOOL_INFO.phone}`;
  const emailUrl = `mailto:admissions@gurukulmeerut.com`;

  const buttons = [
    { 
      id: 'whatsapp', 
      icon: 'fab fa-whatsapp', 
      color: 'bg-green-500', 
      hoverColor: 'hover:bg-green-600',
      url: whatsappUrl,
      label: 'WhatsApp Us'
    },
    { 
      id: 'call', 
      icon: 'fas fa-phone-alt', 
      color: 'bg-kids-blue', 
      hoverColor: 'hover:bg-blue-600',
      url: callUrl,
      label: 'Call Us'
    },
    { 
      id: 'email', 
      icon: 'fas fa-envelope', 
      color: 'bg-kids-pink', 
      hoverColor: 'hover:bg-pink-600',
      url: emailUrl,
      label: 'Email Us'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 animate-pop-in">
      {buttons.map((btn) => (
        <a
          key={btn.id}
          href={btn.url}
          target={btn.id === 'whatsapp' ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className={`${btn.color} ${btn.hoverColor} w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl shadow-kids-xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 group relative`}
          aria-label={btn.label}
        >
          <i className={btn.icon}></i>
          
          {/* Tooltip */}
          <span className="absolute right-full mr-4 px-3 py-1 bg-kids-dark text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
            {btn.label}
          </span>
        </a>
      ))}
    </div>
  );
};

export default FloatingContactButtons;
