import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    subject: {
      type: String, // e.g. "Physics", "Chemistry"
      required: true,
      trim: true,
    },
    qualification: {
      type: String, // e.g. "B.Tech, IIT Roorkee"
      required: true,
      trim: true,
    },
    experience: {
      type: String, // e.g. "12+ Years"
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;
