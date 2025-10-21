import { motion } from "framer-motion";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

interface PhotoStripProps {
  images: string[]; // Array of 5 image paths
  id: string;       // Strip identifier
  animationVariant?: "fade-scale" | "slide-stagger" | "rotate-reveal";
}

// Color overlays in the exact order specified
const colorOverlays = [
  "bg-emerald-500", // Photo 1: Green (emerald-500)
  "bg-rose-500",    // Photo 2: Red (rose-500)
  "bg-blue-500",    // Photo 3: Blue (blue-500)
  "bg-purple-500",  // Photo 4: Purple (purple-500)
  "bg-orange-500",  // Photo 5: Orange (orange-500)
];

// Animation variants
const getAnimationProps = (variant: PhotoStripProps['animationVariant'] = "fade-scale", index: number) => {
  switch (variant) {
    case "slide-stagger":
      return {
        initial: { opacity: 0, x: index % 2 === 0 ? -60 : 60, y: 20 },
        animate: { opacity: 1, x: 0, y: 0 },
        transition: {
          duration: 0.8,
          delay: index * 0.15,
          ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
        }
      };
    
    case "rotate-reveal":
      return {
        initial: { opacity: 0, rotateY: 45, scale: 0.8 },
        animate: { opacity: 1, rotateY: 0, scale: 1 },
        transition: {
          duration: 0.9,
          delay: index * 0.12,
          ease: [0.23, 1, 0.32, 1] as [number, number, number, number]
        }
      };
    
    case "fade-scale":
    default:
      return {
        initial: { opacity: 0, scale: 1.1 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 0.8,
          delay: index * 0.1,
          ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number]
        }
      };
  }
};

export function PhotoStrip({ images, id, animationVariant = "fade-scale" }: PhotoStripProps) {
  return (
    <div
      className="w-full overflow-hidden"
      data-photo-strip-id={id}
    >
      {/* Display 5 square images horizontally on desktop, stacked on mobile */}
      <div className="flex flex-col sm:flex-row gap-0">
        {images.slice(0, 5).map((image, index) => {
          const animationProps = getAnimationProps(animationVariant, index);
          
          return (
            <motion.div
              key={`${id}-image-${index}`}
              className="relative flex-1 aspect-square overflow-hidden"
              initial={animationProps.initial}
              whileInView={animationProps.animate}
              viewport={{ 
                once: true, 
                amount: 0.2,
                margin: "-50px"
              }}
              transition={animationProps.transition}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Base image with responsive loading */}
              <ResponsiveImage
                src={image}
                alt={`Photo strip ${id} image ${index + 1}`}
                className="w-full h-full object-cover"
                sizes="(max-width: 640px) 300px, (max-width: 768px) 200px, (max-width: 1024px) 250px, 300px"
              />
              {/* Color overlay with blend mode */}
              <div 
                className={`absolute inset-0 ${colorOverlays[index]} opacity-30`}
                style={{ mixBlendMode: 'overlay' }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}