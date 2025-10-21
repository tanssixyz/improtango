import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  srcSet?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes,
  srcSet,
  placeholder = "/images/placeholder.svg",
  onLoad,
  onError,
}: LazyImageProps) {
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

  // Generate WebP srcSet if original is JPG/PNG
  const getOptimizedSrcSet = (originalSrc: string, originalSrcSet?: string) => {
    if (originalSrcSet) return originalSrcSet;

    const isJpgOrPng = /\.(jpg|jpeg|png)$/i.test(originalSrc);
    if (!isJpgOrPng) return undefined;

    const basePath = originalSrc.replace(/\.(jpg|jpeg|png)$/i, "");
    return `${basePath}.webp, ${originalSrc}`;
  };

  const shouldLoad = isInView || priority;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      <img
        ref={imgRef}
        src={shouldLoad ? (hasError ? placeholder : src) : placeholder}
        srcSet={shouldLoad ? getOptimizedSrcSet(src, srcSet) : undefined}
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

      {/* Loading placeholder */}
      {!isLoaded && shouldLoad && (
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse",
            className
          )}
        />
      )}
    </div>
  );
}
