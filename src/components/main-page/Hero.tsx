import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";

export function Hero() {
  const { t } = useLanguage();
  
  const quotes = [
    t('hero.quote1'),
    t('hero.quote2'),
    t('hero.quote3'),
    t('hero.quote4'),
    t('hero.quote5')
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/hero-1.webp)",
        }}
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-slate-950/60" />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div>
          {/* Main Heading */}
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-slate-50 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              ease: [0.21, 0.47, 0.32, 0.98]
            }}
          >
            Improtango
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl text-slate-300 mb-8 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.8,
              ease: [0.21, 0.47, 0.32, 0.98]
            }}
          >
{t('hero.subtitle')}
          </motion.p>

          {/* Animated Quotes */}
          <motion.div 
            className="relative min-h-32 max-w-4xl mx-auto flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 1.1,
              ease: [0.21, 0.47, 0.32, 0.98]
            }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={`quote-${currentQuote}`}
                className="text-xl md:text-2xl text-slate-200 leading-relaxed text-center italic font-light px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                "{quotes[currentQuote]}"
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          delay: 1.5,
          ease: [0.21, 0.47, 0.32, 0.98]
        }}
      >
        <motion.div 
          className="flex flex-col items-center text-slate-300"
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-sm mb-2 hidden sm:block">Scroll</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
