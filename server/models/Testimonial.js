import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    photo: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['Text', 'Video'],
      default: 'Text',
    },
    videoUrl: {
      type: String, // E.g., YouTube embed URL or uploaded MP4 URL
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Published',
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
