import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Cookie } from "lucide-react";

export function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted privacy policy
    const hasAccepted = localStorage.getItem("privacy-accepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacy-accepted", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("privacy-accepted", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-border shadow-2xl"
      >
        <div className="container mx-auto px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <div className="shrink-0">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-500/20 rounded-full">
                <Shield className="w-5 h-5 text-teal-500" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <Cookie className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-foreground font-medium">
                  Yksityisyys ja evästeet
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Käytämme ainoastaan välttämättömiä teknisiä evästeitä sivuston
                toimivuuden varmistamiseksi. Emme kerää henkilökohtaisia tietoja
                tai käytä seurantaevästeitä.
                <a
                  href="/privacy"
                  className="text-teal-500 hover:text-teal-600 underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lue lisää tietosuojasta
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-border/80 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Kieltäydyn
              </motion.button>
              <motion.button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Hyväksyn
              </motion.button>
              <motion.button
                onClick={handleDecline}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Sulje banneri"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
