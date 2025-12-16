const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext !== '.md') {
    return cb(new Error('Only .md files are allowed'), false);
  }

  const allowedMimeTypes = ['text/markdown', 'text/plain', 'application/octet-stream'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit
  },
});

const uploadFormFile = upload.single('formFile');

module.exports = {
  uploadFormFile,
};
