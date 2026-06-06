import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let storage;
const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && 
                        process.env.CLOUDINARY_API_KEY && 
                        process.env.CLOUDINARY_API_SECRET);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const folder = 'aman_indra_classes';
      const cleanName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_');
      const publicId = `${Date.now()}-${cleanName}`;
      const format = path.extname(file.originalname).substring(1).toLowerCase() || 'png';
      
      return {
        folder: folder,
        public_id: publicId,
        format: format,
        resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      };
    },
  });
  console.log('Upload System: Configured for Cloudinary CDN uploads.');
} else {
  const uploadDir = './uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
      cb(null, `${Date.now()}-${cleanName}`);
    },
  });
  console.log('Upload System: Cloudinary keys missing. Falling back to local folder ./uploads.');
}

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Supported types: JPG, JPEG, PNG, WEBP, MP4.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size (useful for testimonials/videos)
  },
});

export { upload, cloudinary, useCloudinary };
