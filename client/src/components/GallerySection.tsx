import React, { useState, useEffect } from 'react';
import { Eye, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';

interface GalleryItem {
  _id: string;
  imageUrl: string;
  category: 'Classroom' | 'Events' | 'Results' | 'Faculty' | 'Activities';
}

const fallbackImages: GalleryItem[] = [
  {
    _id: 'fb1',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
    category: 'Classroom'
  },
  {
    _id: 'fb2',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    category: 'Classroom'
  },
  {
    _id: 'fb3',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    category: 'Events'
  },
  {
    _id: 'fb4',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800',
    category: 'Activities'
  }
];

export const GallerySection: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Classroom', 'Events', 'Results', 'Faculty', 'Activities'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.get('/gallery');
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems(fallbackImages);
        }
      } catch (err) {
        console.warn('Failed to load gallery items, using defaults:', err);
        setItems(fallbackImages);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    if (category === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === category));
    }
  }, [category, items]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  };

  const getImageUrl = (photoUrl?: string) => {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http')) return photoUrl;
    const serverOrigin = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${serverOrigin}${photoUrl}`;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Category Toggles */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs md:text-sm font-bold py-2 px-5 rounded-full border transition-all duration-300 cursor-pointer ${
              category === cat
                ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 animate-pulse">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-slate-100 aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <ImageIcon size={30} className="text-slate-300" />
          <h4 className="font-bold text-sm text-brand-dark">No Photos Available</h4>
          <p className="text-xs text-brand-muted">There are no uploaded images in the "{category}" category yet.</p>
        </div>
      ) : (
        /* Image Grid (Masonry / Flex styled grid) */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item._id || idx}
              onClick={() => handleOpenLightbox(idx)}
              className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden aspect-[4/3] relative group shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img
                src={getImageUrl(item.imageUrl)}
                alt={`${item.category} media`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Blur Overlay with Icon on Hover */}
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300">
                <div className="w-10 h-10 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Eye size={18} />
                </div>
                <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-wider text-slate-100 bg-black/40 py-0.5 px-2.5 rounded-full border border-white/10">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal slider */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 md:p-8"
          onClick={handleCloseLightbox}
        >
          {/* Close button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X size={20} />
          </button>

          {/* Left arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Core Image view */}
          <div 
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center gap-3 z-10 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(filteredItems[lightboxIndex].imageUrl)}
              alt="Lightbox display"
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/5 bg-slate-900"
            />
            <div className="text-center">
              <span className="inline-block bg-brand-accent/25 text-brand-accent font-extrabold text-[10px] tracking-widest uppercase border border-brand-accent/30 py-1 px-4 rounded-full mt-2">
                {filteredItems[lightboxIndex].category} Gallery
              </span>
              <p className="text-slate-400 text-xs mt-1.5 font-medium">
                Image {lightboxIndex + 1} of {filteredItems.length}
              </p>
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
