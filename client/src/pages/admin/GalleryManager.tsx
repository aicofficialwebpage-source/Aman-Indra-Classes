import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

interface GalleryItem {
  _id: string;
  imageUrl: string;
  category: 'Classroom' | 'Events' | 'Results' | 'Faculty' | 'Activities';
}

export const GalleryManager: React.FC = () => {
  const { addToast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'Classroom' | 'Events' | 'Results' | 'Faculty' | 'Activities'>('Classroom');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const categories = ['Classroom', 'Events', 'Results', 'Faculty', 'Activities'];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await api.get('/gallery');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      addToast('Validation Error', 'Please choose at least one image to upload.', 'error');
      return;
    }

    setUploading(true);
    const count = selectedFiles.length;
    const formData = new FormData();
    formData.append('category', category);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    try {
      await api.post('/gallery', formData, true);
      setSelectedFiles(null);
      
      // Reset input element
      const fileInput = document.getElementById('galleryFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      addToast('Gallery Item Uploaded', `Successfully uploaded ${count} image(s) to "${category}".`, 'success');
      fetchGallery();
    } catch (err: any) {
      addToast('Upload Failed', err.message || 'Failed to upload images.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      addToast('Gallery Item Deleted', 'Image deleted from gallery.', 'success');
      fetchGallery();
    } catch (err) {
      addToast('Delete Failed', 'Failed to delete image.', 'error');
    }
  };

  const getImageUrl = (photoUrl?: string) => {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http')) return photoUrl;
    const serverOrigin = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${serverOrigin}${photoUrl}`;
  };

  return (
    <div className="flex flex-col gap-6 text-xs animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-extrabold text-brand-dark text-lg flex items-center gap-2">
          <ImageIcon className="text-brand-accent" size={20} />
          Media Gallery & Photo Manager
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Upload Form Box Left */}
        <div className="lg:col-span-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
          <h4 className="font-bold text-brand-dark text-sm border-b border-slate-50 pb-2">Upload Campus Media</h4>
          
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Select Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white focus:border-brand-accent text-xs"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Choose Images (Multiple allowed)</label>
              <label className="border border-dashed border-slate-300 hover:bg-slate-50 py-5 px-4 rounded-xl cursor-pointer flex flex-col items-center gap-2 text-center text-slate-500 font-medium transition-all">
                <Upload size={20} className="text-slate-400" />
                <span>Drag files here or click to browse</span>
                <input 
                  id="galleryFileInput"
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              <div className="text-[10px] text-slate-400 mt-1">
                {selectedFiles && selectedFiles.length > 0 ? (
                  <span className="text-green-600 font-bold">Selected: {selectedFiles.length} file(s) ready</span>
                ) : (
                  <span>PNG, JPG, WEBP formats. Up to 10 files in bulk.</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-brand-dark hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Uploading images...
                </>
              ) : (
                'Upload Selected Files'
              )}
            </button>

          </form>
        </div>

        {/* Gallery Items Grid View Right */}
        <div className="lg:col-span-8 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
          <h4 className="font-bold text-brand-dark text-sm border-b border-slate-50 pb-2">Uploaded Images ({items.length})</h4>

          {loading ? (
            <div className="py-10 text-center animate-pulse">
              <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 text-slate-450 italic">No media items cataloged yet. Use the upload desk.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item._id} className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 border shadow-inner">
                  <img src={getImageUrl(item.imageUrl)} alt="Campus media item" className="w-full h-full object-cover" />
                  
                  {/* Category label */}
                  <span className="absolute top-2 left-2 text-[8px] font-bold bg-black/60 text-slate-100 py-0.5 px-2 rounded-md border border-white/5 uppercase">
                    {item.category}
                  </span>

                  {/* Hover trash button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 hover:bg-red-755 text-white p-2 rounded-full shadow-lg transform translate-y-1.5 group-hover:translate-y-0 transition-transform cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GalleryManager;
