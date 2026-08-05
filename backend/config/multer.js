const multer = require("multer");
const path = require("path");
const fs = require("fs");

const carpeta = path.join(__dirname, "../uploads/productos");

if (!fs.existsSync(carpeta)) {
  fs.mkdirSync(carpeta, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpeta);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const nombre = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

    cb(null, nombre);
  }
});

const fileFilter = (req, file, cb) => {

  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg"
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;