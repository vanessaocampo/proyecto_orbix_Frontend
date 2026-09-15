
/**
 * Obtiene la URL de una imagen.
 * En producción, utiliza una URL de CDN (Cloudinary/S3) si está configurada en las variables de entorno.
 * Si no está configurada, utiliza la ruta local de la carpeta "public".
 */
export const getImageUrl = (imagePath: string): string => {
  const cdnUrl = import.meta.env.VITE_CDN_URL;
  
  if (cdnUrl) {
    // Si la ruta ya tiene un slash inicial, evitar el doble slash
    const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    const cleanCdn = cdnUrl.endsWith("/") ? cdnUrl : `${cdnUrl}/`;
    return `${cleanCdn}${cleanPath}`;
  }

  // Fallback a los archivos estáticos de la carpeta public
  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
};

