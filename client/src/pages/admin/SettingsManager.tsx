import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export const SettingsManager: React.FC = () => {
  const { addToast } = useToast();
  const { settings, reloadSettings } = useSettings();
  const [form, setForm] = useState({
    heroHeadline: '',
    heroSubheadline: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    workingHours: '',
    socialFacebook: '',
    socialInstagram: '',
    socialYoutube: '',
    googleMapEmbedUrl: '',
    seoMetaTitle: '',
    seoMetaDescription: '',
    seoKeywords: '',
    whatsappNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setForm({
        heroHeadline: settings.heroHeadline || '',
        heroSubheadline: settings.heroSubheadline || '',
        contactPhone: settings.contactPhone || '',
        contactEmail: settings.contactEmail || '',
        contactAddress: settings.contactAddress || '',
        workingHours: settings.workingHours || '',
        socialFacebook: settings.socialFacebook || '',
        socialInstagram: settings.socialInstagram || '',
        socialYoutube: settings.socialYoutube || '',
        googleMapEmbedUrl: settings.googleMapEmbedUrl || '',
        seoMetaTitle: settings.seoMetaTitle || '',
        seoMetaDescription: settings.seoMetaDescription || '',
        seoKeywords: settings.seoKeywords || '',
        whatsappNumber: settings.whatsappNumber || ''
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await api.put('/settings', form);
      setSuccess(true);
      addToast('Settings Synced', 'Website settings updated and synchronized successfully.', 'success');
      await reloadSettings(); // Force instant site-wide layout refresh
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update website configurations.');
      addToast('Error saving settings', err.message || 'Failed to sync settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm text-xs flex flex-col gap-6 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="font-extrabold text-brand-dark text-lg flex items-center gap-2">
          <Settings className="text-brand-accent" size={20} />
          Website Dynamic Settings CMS
        </h3>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-2 font-bold animate-fade-in">
          <CheckCircle size={15} />
          <span>Website settings updated and synchronized successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Hero Section settings */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-800 border-b pb-1 text-sm">1. Hero Section Layout</h4>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600" htmlFor="setHeroHead">Hero Title Headline *</label>
            <input
              id="setHeroHead"
              type="text"
              name="heroHeadline"
              value={form.heroHeadline}
              onChange={handleChange}
              placeholder="e.g. Transform Potential Into Results"
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600" htmlFor="setHeroSub">Hero Subheading description *</label>
            <textarea
              id="setHeroSub"
              name="heroSubheadline"
              value={form.heroSubheadline}
              onChange={handleChange}
              rows={3}
              placeholder="Kanpur's Trusted Coaching Institute..."
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl resize-none focus:border-brand-accent text-xs bg-white leading-relaxed"
            />
          </div>
        </div>

        {/* Contact Info settings */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-800 border-b pb-1 text-sm">2. Contact Information Desk</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600" htmlFor="setPhone">Telephone/Phone Display</label>
              <input
                id="setPhone"
                type="text"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                placeholder="+91 99361 74852"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600" htmlFor="setWhatsApp">WhatsApp Trigger Number (Digits with country code, no space)</label>
              <input
                id="setWhatsApp"
                type="text"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                placeholder="919936174852"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600" htmlFor="setEmail">Official Email ID</label>
              <input
                id="setEmail"
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="admissions@amanindraclasses.com"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600" htmlFor="setHours">Office Timings hours</label>
              <input
                id="setHours"
                type="text"
                name="workingHours"
                value={form.workingHours}
                onChange={handleChange}
                placeholder="Monday - Saturday: 11:00 AM - 8:00 PM..."
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600" htmlFor="setAddr">Full Address description</label>
            <input
              id="setAddr"
              type="text"
              name="contactAddress"
              value={form.contactAddress}
              onChange={handleChange}
              placeholder="Full physical location details..."
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600" htmlFor="setMap">Google Maps Embed URL src attribute</label>
            <input
              id="setMap"
              type="text"
              name="googleMapEmbedUrl"
              value={form.googleMapEmbedUrl}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/embed?..."
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
            />
          </div>
        </div>

        {/* Social settings */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-800 border-b pb-1 text-sm">3. Social Channels Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600" htmlFor="setFB">Facebook Page URL</label>
              <input
                id="setFB"
                type="text"
                name="socialFacebook"
                value={form.socialFacebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600" htmlFor="setIG">Instagram Username URL</label>
              <input
                id="setIG"
                type="text"
                name="socialInstagram"
                value={form.socialInstagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600" htmlFor="setYT">YouTube Channel URL</label>
              <input
                id="setYT"
                type="text"
                name="socialYoutube"
                value={form.socialYoutube}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* SEO settings */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-800 border-b pb-1 text-sm">4. Global SEO Metadata Tags</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600" htmlFor="setSEOTitle">Global Meta Title (Tabs bar heading)</label>
              <input
                id="setSEOTitle"
                type="text"
                name="seoMetaTitle"
                value={form.seoMetaTitle}
                onChange={handleChange}
                placeholder="e.g. Aman Indra Classes (AIC) - Kanpur"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600" htmlFor="setSEOKeys">Global Keywords (Separated by commas)</label>
              <input
                id="setSEOKeys"
                type="text"
                name="seoKeywords"
                value={form.seoKeywords}
                onChange={handleChange}
                placeholder="Best coaching Kanpur, IIT JEE Kanpur, NEET coaching Kanpur..."
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs bg-white"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600" htmlFor="setSEODesc">Global Meta Description summary</label>
            <textarea
              id="setSEODesc"
              name="seoMetaDescription"
              value={form.seoMetaDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Aman Indra Classes (AIC) is Kanpur's premier..."
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl resize-none focus:border-brand-accent text-xs bg-white leading-relaxed"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 border-t pt-5 mt-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-dark hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Synchronizing Settings...
              </>
            ) : (
              <>
                <Save size={15} />
                Save Dynamic Configurations
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsManager;
