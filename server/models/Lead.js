import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String, default: 'Admin' }
});

const leadSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    class: {
      type: String,
      required: true,
      trim: true,
    },
    schoolName: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Follow Up', 'Interested', 'Converted', 'Not Interested'],
      default: 'New',
    },
    type: {
      type: String,
      enum: ['Enquiry', 'Scholarship'],
      default: 'Enquiry',
    },
    purpose: {
      type: String,
      enum: ['Enquiry', 'Follow-up'],
      default: 'Enquiry',
    },
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
