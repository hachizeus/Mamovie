import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const LazyImage = ({ src, alt, sx = {}, placeholder = null }) => {
  const [imageSrc, setImageSrc] = useState(placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"%3E%3Crect fill="%23333" width="400" height="600"/%3E%3C/svg%3E');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <Box
      component="img"
      src={imageSrc}
      alt={alt}
      sx={{
        opacity: isLoading ? 0.6 : 1,
        transition: 'opacity 0.3s ease-in-out',
        ...sx
      }}
      loading="lazy"
    />
  );
};

export default LazyImage;
