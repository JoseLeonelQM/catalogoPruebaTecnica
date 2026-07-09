import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const uploadAndOptimizeImage = async (file: Express.Multer.File): Promise<string> => {
  // 1. ✨ Comprimir y pasar a WebP con Sharp (Para que pese menos de 200 KB)
  const optimizedBuffer = await sharp(file.buffer)
    .resize({ width: 800, withoutEnlargement: true }) 
    .webp({ quality: 80 }) 
    .toBuffer();

  const uniqueName = `${crypto.randomUUID()}.webp`;

  // 2. Subir directamente a tu bucket 'imagesCatalog'
  const { error } = await supabase.storage
    .from('imagesCatalog') // <-- Nombre exacto de tu captura
    .upload(uniqueName, optimizedBuffer, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Error al subir imagen a Supabase: ${error.message}`);
  }

  // 3. Obtener la URL de internet del archivo
  const { data: publicUrlData } = supabase.storage
    .from('imagesCatalog')
    .getPublicUrl(uniqueName);

  return publicUrlData.publicUrl;
};