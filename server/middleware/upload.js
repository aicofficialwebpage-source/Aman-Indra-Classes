import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
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
  console.log('Upload System: Cloudinary config loaded. Files will be validated locally then uploaded to Cloudinary.');
} else {
  console.log('Upload System: Cloudinary keys missing. Falling back to local folder ./uploads.');
}

// Multer always saves locally first to allow magic bytes signature validation
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

// Magic bytes signature checker
const checkSignature = (buffer) => {
  const hex = buffer.toString('hex').toUpperCase();
  if (hex.startsWith('FFD8FF')) return 'image/jpeg';
  if (hex.startsWith('89504E470D0A1A0A')) return 'image/png';
  if (hex.startsWith('52494646') && hex.substring(16, 24) === '57454250') return 'image/webp';
  if (hex.substring(8, 16) === '66747970') return 'video/mp4';
  return null;
};

// Security middleware to validate signatures on disk and optionally upload to Cloudinary
export const securityUploadMiddleware = async (req, res, next) => {
  const filesToProcess = [];

  if (req.file) {
    filesToProcess.push({ file: req.file, type: 'single' });
  }
  if (req.files) {
    if (Array.isArray(req.files)) {
      req.files.forEach(f => filesToProcess.push({ file: f, type: 'array' }));
    } else {
      Object.keys(req.files).forEach(key => {
        req.files[key].forEach(f => filesToProcess.push({ file: f, type: 'array_field', field: key }));
      });
    }
  }

  try {
    for (const item of filesToProcess) {
      const { file } = item;
      const filePath = file.path;

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found on disk: ${filePath}`);
      }

      // 1. Read first 12 bytes
      const buffer = Buffer.alloc(12);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, 12, 0);
      fs.closeSync(fd);

      // 2. Validate signature
      const detectedMimeType = checkSignature(buffer);
      if (!detectedMimeType) {
        // Delete invalid file from disk
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        console.warn(`[Security Alert] Blocked upload of file with invalid signature: ${file.originalname}`);
        return res.status(400).json({ message: 'Invalid file signature. Uploaded file content does not match allowed types (JPG, PNG, WEBP, MP4).' });
      }

      // 3. If Cloudinary is enabled, upload to Cloudinary and delete local temp file
      if (useCloudinary) {
        const folder = 'aman_indra_classes';
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_');
        const publicId = `${Date.now()}-${cleanName}`;
        const resourceType = detectedMimeType.startsWith('video/') ? 'video' : 'image';

        const result = await cloudinary.uploader.upload(filePath, {
          folder: folder,
          public_id: publicId,
          resource_type: resourceType
        });

        // Delete local temp file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Overwrite file properties so downstream routes remain functional
        file.path = result.secure_url;
        file.filename = result.public_id;
      }
    }
    next();
  } catch (err) {
    console.error('File signature validation or Cloudinary upload error:', err);
    // Cleanup any uploaded files
    filesToProcess.forEach(item => {
      const filePath = item.file.path;
      if (filePath && !filePath.startsWith('http') && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupErr) {
          // ignore
        }
      }
    });
    return res.status(500).json({ message: 'Error processing uploaded file.' });
  }
};

export { upload, cloudinary, useCloudinary };
