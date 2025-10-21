import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function ResponsiveImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes = "(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1920px",
  onLoad,
  onError,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate optimized srcSet
  const generateSrcSet = (originalSrc: string) => {
    const basePath = originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    const ext = originalSrc
      .match(/\.(jpg|jpeg|png|webp)$/i)?.[1]
      ?.toLowerCase();
    const filename = basePath.split("/").pop();

    // For photo strip images, use the original path as fallback
    if (originalSrc.includes("/images/strips/")) {
      return {
        webpSrcSet: originalSrc,
        fallbackSrcSet: originalSrc,
      };
    }

    // Check if we have optimized versions for other images
    const sizes = [640, 768, 1024, 1280, 1920];
    const webpSrcSet = sizes
      .map((size) => `/images/optimized/${filename}-${size}w.webp ${size}w`)
      .join(", ");

    const fallbackSrcSet = sizes
      .map((size) => `/images/optimized/${filename}-${size}w.${ext} ${size}w`)
      .join(", ");

    return { webpSrcSet, fallbackSrcSet };
  };

  const shouldLoad = isInView || priority;
  const { webpSrcSet, fallbackSrcSet } = generateSrcSet(src);

  if (!shouldLoad) {
    return (
      <div
        ref={imgRef}
        className={cn(
          "bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse",
          className
        )}
        style={{ width, height }}
      />
    );
  }

  return (
    <picture className={cn("block", className)}>
      {/* WebP sources */}
      <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />

      {/* AVIF sources (if available) - only for non-strip images */}
      {!src.includes("/images/strips/") && (
        <source
          srcSet={`/images/optimized/${src
            .split("/")
            .pop()
            ?.replace(/\.(jpg|jpeg|png)$/i, ".avif")}`}
          type="image/avif"
        />
      )}

      {/* Fallback image */}
      <img
        ref={imgRef}
        src={
          hasError
            ? "/images/placeholder.svg"
            : src.includes("/images/strips/")
              ? src
              : `/images/optimized/${
                  src
                    .split("/")
                    .pop()
                    ?.replace(/\.(jpg|jpeg|png)$/i, "-optimized.$1") || src
                }`
        }
        srcSet={fallbackSrcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
      />

      {/* Loading placeholder overlay */}
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse",
            className
          )}
        />
      )}
    </picture>
  );
}
