import mongoose from 'mongoose';

const achieverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String, // Cloudinary or local path image URL
      default: '',
    },
    school: {
      type: String,
      trim: true,
    },
    marks: {
      type: String, // e.g. "98.4%", "345/360"
      trim: true,
    },
    rank: {
      type: String, // e.g. "AIR 142", "District Rank 3"
      trim: true,
    },
    achievement: {
      type: String, // e.g. "CBSE Class 12th Topper", "JEE Advanced Qualified"
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['JEE', 'NEET', 'Boards', 'Foundation'],
      required: true,
    },
    year: {
      type: String, // e.g. "2023", "2024"
      default: new Date().getFullYear().toString(),
    },
  },
  {
    timestamps: true,
  }
);

const Achiever = mongoose.model('Achiever', achieverSchema);
export default Achiever;
