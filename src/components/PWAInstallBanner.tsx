import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";
import { PWAInstallManager } from "@/lib/pwa";
import type { PWAInstallState } from "@/lib/pwa";

let pwaManager: PWAInstallManager | null = null;

export function PWAInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Initialize PWA manager
    if (!pwaManager) {
      pwaManager = new PWAInstallManager();
    }

    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Listen to install state changes
    const handleStateChange = (state: PWAInstallState) => {
      setIsVisible(state.isInstallable && !state.isInstalled && !isDismissed);
    };

    pwaManager.onStateChange(handleStateChange);

    return () => {
      if (pwaManager) {
        pwaManager.removeListener(handleStateChange);
      }
    };
  }, [isDismissed]);

  const handleInstall = async () => {
    if (pwaManager) {
      const success = await pwaManager.promptInstall();
      if (success) {
        setIsVisible(false);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-sm sm:max-w-md md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-border shadow-2xl rounded-2xl p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="shrink-0">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-500/20 rounded-full">
                <Smartphone className="w-5 h-5 text-teal-500" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <Download className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-foreground font-medium">
                  Asenna Improtango
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lisää Improtango kotinäytölle nopeampaa käyttöä varten. Toimii
                myös offline-tilassa!
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                onClick={handleInstall}
                className="px-3 py-1.5 text-xs font-medium bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Asenna
              </motion.button>
              <motion.button
                onClick={handleDismiss}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Sulje"
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
