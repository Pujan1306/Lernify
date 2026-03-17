import multer from "multer";
import path from "path";

// Document upload configuration
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/documents');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const documentFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
}

// Profile image upload configuration
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/profileImage');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const profileFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed"), false);
  }
}

// Export separate upload configurations
export const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10 MB for documents
  }
});

export const profileUpload = multer({
  storage: profileStorage,
  fileFilter: profileFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB for profile images
  }
});

// Default export for backward compatibility (documents)
const upload = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10 MB file size limit
  }
})

export default upload