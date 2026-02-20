const multer     = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const modelFilter = (req, file, cb) => {
  const allowed = [".stl", ".obj", ".3mf", ".step", ".stp"];
  const ext = "." + file.originalname.split(".").pop().toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error(`Unsupported file type. Accepted: ${allowed.join(", ")}`), false);
};

const gcodeFilter = (req, file, cb) => {
  const ext = "." + file.originalname.split(".").pop().toLowerCase();
  if (ext === ".gcode") cb(null, true);
  else cb(new Error("Only .gcode files are allowed"), false);
};

const uploadImage = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadModel = multer({ storage, fileFilter: modelFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadGcode = multer({ storage, fileFilter: gcodeFilter, limits: { fileSize: 50 * 1024 * 1024 } });

const streamToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result.secure_url);
    });
    Readable.from(buffer).pipe(uploadStream);
  });

module.exports = { uploadImage, uploadModel, uploadGcode, streamToCloudinary };