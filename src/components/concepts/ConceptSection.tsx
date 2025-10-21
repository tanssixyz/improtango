import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";

interface ConceptSectionProps {
  number: number;
  title: string;
  quote: string;
  author: string;
  content: string;
  image: string;
  isReversed?: boolean;
}

export function ConceptSection({
  number,
  title,
  quote,
  author,
  content,
  image,
  isReversed
}: ConceptSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to strip HTML tags for length calculation
  const stripHtml = (html: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // Server-side fallback - simple regex approach
      return html.replace(/<[^>]*>/g, '');
    }
    
    try {
      const tmp = document.createElement('div');
      if (!tmp) {
        return html.replace(/<[^>]*>/g, '');
      }
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    } catch (error) {
      console.warn('stripHtml failed, using regex fallback:', error);
      return html.replace(/<[^>]*>/g, '');
    }
  };

  // Truncate content for collapsed state
  const textContent = stripHtml(content);
  const shouldTruncate = textContent.length > 200;
  
  // Create truncated HTML by taking first 200 chars of text content
  const truncatedContent = shouldTruncate && !isExpanded 
    ? content.substring(0, content.indexOf(' ', 200)) + '...'
    : content;

  return (
    <section className={`py-20 md:py-32 ${isReversed ? 'bg-muted/30' : 'bg-background'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Content Side */}
          <div className={`space-y-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
            <AnimatedSection 
              delay={0.2}
              direction={isReversed ? "right" : "left"}
            >
              <div className="inline-flex items-center gap-3 text-teal-400 font-mono text-sm">
                <span className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center text-xs font-bold">
                  {number.toString().padStart(2, '0')}
                </span>
                Käsite {number}
              </div>
            </AnimatedSection>

            <AnimatedSection 
              delay={0.4}
              direction={isReversed ? "right" : "left"}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                {title}
              </h2>
            </AnimatedSection>

            <AnimatedSection 
              delay={0.6}
              direction={isReversed ? "right" : "left"}
            >
              <blockquote className="border-l-4 border-teal-400 pl-6 py-4">
                <p className="text-lg md:text-xl italic text-muted-foreground leading-relaxed">
                  "{quote}"
                </p>
                <cite className="block text-sm text-muted-foreground/80 mt-2 not-italic">
                  — {author}
                </cite>
              </blockquote>
            </AnimatedSection>

            <AnimatedSection 
              delay={0.8}
              direction={isReversed ? "right" : "left"}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isExpanded ? 'expanded' : 'collapsed'}
                  className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-p:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: truncatedContent }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }}
                />
              </AnimatePresence>
            </AnimatedSection>

            {shouldTruncate && (
              <AnimatedSection 
                delay={1.0}
                direction={isReversed ? "right" : "left"}
              >
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isExpanded ? 'Näytä vähemmän' : 'Lue lisää'}
                  <motion.svg 
                    className="w-4 h-4"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ 
                      rotate: isExpanded ? 180 : 0 
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.21, 0.47, 0.32, 0.98]
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>
              </AnimatedSection>
            )}
          </div>

          {/* Image Side */}
          <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
            <AnimatedSection 
              delay={0.3}
              direction={isReversed ? "left" : "right"}
            >
              <motion.div 
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: isReversed ? -2 : 2,
                  rotateX: 1
                }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <img
                  src={image}
                  alt={`Concept ${number}: ${title}`}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Number overlay */}
                <motion.div 
                  className="absolute top-6 right-6 w-12 h-12 bg-teal-400/90 rounded-full flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }}
                >
                  <span className="text-white font-bold text-lg">
                    {number}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatedSection>
          </div>

        </div>
      </div>
    </section>
  );
}