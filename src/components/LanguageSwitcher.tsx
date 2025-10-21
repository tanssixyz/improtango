import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-lg p-1 border border-border/50">
      <motion.button 
        onClick={() => setLanguage('fi')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
          language === 'fi' 
            ? 'bg-teal-500 text-white shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        FI
      </motion.button>
      <motion.button 
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
          language === 'en' 
            ? 'bg-teal-500 text-white shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        EN
      </motion.button>
    </div>
  );
}