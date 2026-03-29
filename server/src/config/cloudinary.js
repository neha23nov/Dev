import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tell multer to store files in Cloudinary, not on your server disk
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'devhire/gigs',       // organised folder in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, quality: 'auto' }],  // auto-compress on upload
  },
});

export const upload = multer({ storage });
export default cloudinary;