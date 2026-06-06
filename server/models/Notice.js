import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Admissions Open', 'Scholarship Tests', 'New Batch Launch', 'Exam Schedule', 'Parent Meetings'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    scheduleDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
