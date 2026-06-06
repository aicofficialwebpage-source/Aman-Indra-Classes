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
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.8427515093766!2d80.29749557620138!3d26.428581676939943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47a34e0ea901%3A0xd60d84c16196ad99!2sGovind%20Nagar%2C%20Kanpur%2C%20Uttar%20Pradesh%20208006!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  seoMetaTitle: 'Aman Indra Classes (AIC) - Best Coaching in Govind Nagar, Kanpur',
  seoMetaDescription: "Aman Indra Classes (AIC) is Kanpur's premier institute for Class 6th-12th CBSE/ICSE boards, IIT-JEE, and NEET prep. Join Kanpur's toppers today!",
  seoKeywords: 'Best Coaching Institute in Kanpur, IIT JEE Coaching in Kanpur, NEET Coaching in Kanpur, Class 9th 10th Coaching Kanpur, Class 11th 12th Coaching Kanpur, Foundation Coaching Kanpur',
  whatsappNumber: '919936174852'
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
