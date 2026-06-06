import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const FloatingButtons: React.FC = () => {
  const { settings } = useSettings();

  const phone = settings.contactPhone || '+91 99361 74852';
  const whatsappNum = settings.whatsappNumber || '919936174852';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=Hello%20Aman%20Indra%20Classes%2C%20I%20want%20to%20know%20more%20about%20your%20coaching%20programs%20and%20admissions.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Phone Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="flex items-center justify-center w-14 h-14 bg-brand-dark text-white rounded-full shadow-2xl hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 active:translate-y-0 group relative"
        aria-label="Call Us"
      >
        <Phone size={24} className="animate-pulse" />
        <span className="absolute right-16 bg-brand-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md border border-slate-700">
          Call: {phone}
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba56] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 active:translate-y-0 group relative"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="absolute right-16 bg-white text-brand-dark text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg border border-slate-100">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};

export default FloatingButtons;
