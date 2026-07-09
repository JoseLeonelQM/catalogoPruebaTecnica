import multer from 'multer';
import type { Request } from 'express';

// Guardamos en memoria (Buffer) para poder procesarlo directamente con Sharp sin escribir en el disco duro
const storage = multer.memoryStorage();

// Filtro de validación para asegurar que solo suban imágenes
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo cargado no es una imagen válida.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite máximo inicial de 5MB antes de la optimización
  },
});