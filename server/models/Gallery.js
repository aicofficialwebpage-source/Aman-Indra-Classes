import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Classroom', 'Events', 'Results', 'Faculty', 'Activities'],
      required: true,
    },
    publicId: {
      type: String, // Cloudinary file tracking ID
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
