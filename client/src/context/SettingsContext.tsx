import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

interface Settings {
  heroHeadline?: string;
  heroSubheadline?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  workingHours?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  googleMapEmbedUrl?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string;
  whatsappNumber?: string;
  heroImageUrl?: string;
  heroTagline?: string;
  heroShowTopper?: string;
  heroTopperScore?: string;
  heroTopperName?: string;
  heroTopperText?: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  reloadSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Backup fallbacks
const defaultSettings: Settings = {
  heroHeadline: 'Transform Potential Into Results',
  heroSubheadline: "Kanpur's Trusted Coaching Institute for Classes 6–12, IIT-JEE & NEET Preparation Since 2014.",
  contactPhone: '+91 99361 74852',
  contactEmail: 'admissions@amanindraclasses.com',
  contactAddress: '123/456, Block C, Govind Nagar, Kanpur, Uttar Pradesh - 208006',
  workingHours: 'Monday - Saturday: 11:00 AM - 8:00 PM | Sunday: 9:00 AM - 1:00 PM',
  socialFacebook: 'https://facebook.com/amanindraclasses',
  socialInstagram: 'https://instagram.com/amanindraclasses',
  socialYoutube: 'https://youtube.com/amanindraclasses',
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d223.2685117185874!2d80.28700527479934!3d26.44618000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47bda36740ef%3A0xdb53971ab28c86a!2sAman%20Indra%20Classes%20-%20Best%20PCM%20Coaching%20in%20Ratan%20Lal%20Nagar!5e0!3m2!1sen!2sin!4v1780909702425!5m2!1sen!2sin',
  seoMetaTitle: 'Aman Indra Classes (AIC) - Best Coaching in Govind Nagar, Kanpur',
  seoMetaDescription: "Aman Indra Classes (AIC) is Kanpur's premier institute for Class 6th-12th CBSE/ICSE boards, IIT-JEE, and NEET prep. Join Kanpur's toppers today!",
  seoKeywords: 'Best Coaching Institute in Kanpur, IIT JEE Coaching in Kanpur, NEET Coaching in Kanpur, Class 9th 10th Coaching Kanpur, Class 11th 12th Coaching Kanpur, Foundation Coaching Kanpur',
  whatsappNumber: '919936174852',
  heroImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
  heroTagline: "★ Kanpur's Premier Coaching Institute",
  heroShowTopper: 'true',
  heroTopperScore: '99.2%',
  heroTopperName: 'Shraddha Chaturvedi',
  heroTopperText: 'Swarup Public School Topper'
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  const reloadSettings = async () => {
    try {
      const data = await api.get('/settings');
      // Merge with defaults to ensure we have all fields
      setSettings(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.warn('Could not load custom settings, using default configurations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, reloadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
