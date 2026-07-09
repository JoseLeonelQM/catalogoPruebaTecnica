/**
 * Optimiza una imagen en el navegador del cliente reduciendo peso y dimensiones.
 * Transforma el archivo a formato WebP para la máxima eficiencia exigida en la prueba.
 */
export const optimizeImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado debe ser una imagen válida.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIDE = 1280; // Restricción del PDF de la prueba

        // Redimensionamiento proporcional
        if (width > MAX_SIDE || height > MAX_SIDE) {
          if (width > height) {
            height = Math.round((height * MAX_SIDE) / width);
            width = MAX_SIDE;
          } else {
            width = Math.round((width * MAX_SIDE) / height);
            height = MAX_SIDE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No se pudo inicializar el Canvas.'));

        ctx.drawImage(img, 0, 0, width, height);

        // Exportar a WebP con calidad del 80%
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Error al procesar el archivo comprimido.'));
            
            const optimizedFile = new File(
              [blob], 
              `${file.name.substring(0, file.name.lastIndexOf('.')) || file.name}.webp`, 
              { type: 'image/webp', lastModified: Date.now() }
            );
            resolve(optimizedFile);
          },
          'image/webp',
          0.8
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};