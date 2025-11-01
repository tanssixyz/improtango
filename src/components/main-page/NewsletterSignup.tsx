import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useLanguage } from "@/lib/language-context";

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message: string;
}

export function NewsletterSignup() {
  const { t } = useLanguage();
  const subscribe = useMutation(api.newsletter.subscribe);
  const sendWelcomeEmail = useAction(api.newsletter.sendWelcomeEmail);
  const sendAdminNotification = useAction(api.newsletter.sendAdminNotification);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError(t("errors.validation.email_required"));
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t("errors.validation.email_invalid"));
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setStatus({
      type: "loading",
      message: "Lisätään uutiskirjeen tilaajiin...",
    });

    try {
      // 1. Subscribe to newsletter (mutation) - must complete first
      await subscribe({ email });

      // 2. Send emails (actions) - can run in parallel after subscription
      await Promise.all([
        sendWelcomeEmail({ email }),
        sendAdminNotification({ email }),
      ]);

      setStatus({
        type: "success",
        message:
          "Kiitos! Olet nyt tilannut uutiskirjeemme. Tarkista sähköpostisi vahvistusta varten.",
      });
      setEmail("");
      setEmailError("");

      // Auto-clear success message after 7 seconds
      setTimeout(() => {
        setStatus({ type: "idle", message: "" });
      }, 7000);
    } catch (error) {
      console.error("Newsletter signup error:", error);

      // Extract and translate error messages
      let errorMessage = t("errors.newsletter.general");
      
      if (error instanceof Error) {
        const errorText = error.message;
        
        // Look for ConvexError pattern in the message
        const convexErrorMatch = errorText.match(/ConvexError: (.+?)(?:\s+at|$)/);
        if (convexErrorMatch && convexErrorMatch[1]) {
          const extractedMessage = convexErrorMatch[1].trim();
          
          // Map specific error messages to translation keys
          if (extractedMessage.includes('jo tilattu uutiskirjeelle') || extractedMessage.includes('already subscribed')) {
            errorMessage = t("errors.newsletter.already_subscribed");
          } else if (extractedMessage.includes('Rate limit exceeded') || extractedMessage.includes('uutiskirjetilauksen')) {
            // Extract minutes from rate limit message
            const minutesMatch = extractedMessage.match(/(\d+)\s*minuutin?/);
            const minutes = minutesMatch ? minutesMatch[1] : '60';
            errorMessage = t("errors.newsletter.rate_limit").replace('{minutes}', minutes);
          } else {
            // Use the extracted message as-is for other ConvexErrors
            errorMessage = extractedMessage;
          }
        } else if (errorText.includes('ConvexError:')) {
          const parts = errorText.split('ConvexError: ');
          if (parts.length > 1) {
            errorMessage = parts[1].split(' at ')[0].trim();
          }
        }
      }

      setStatus({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  return (
    <section
      id="newsletter"
      className="py-16 md:py-24 bg-linear-to-br from-teal-500/10 via-background to-emerald-500/10 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-r from-teal-500/5 to-emerald-500/5 animate-pulse opacity-50"></div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <AnimatedSection delay={0.2}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-teal-500/30 to-emerald-500/30 rounded-full mb-6 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 hover:scale-110">
                  <Mail className="w-8 h-8 text-teal-400 drop-shadow-lg" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {t("newsletter.title")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {t("newsletter.subtitle")}
                </p>
              </div>
            </AnimatedSection>

            {/* Newsletter Form */}
            <AnimatedSection delay={0.4}>
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-900/20 p-8 md:p-12 border border-border/50 hover:shadow-3xl hover:shadow-slate-900/30 transition-all duration-500 hover:border-teal-500/30">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="newsletter-email" className="sr-only">
                        {t("newsletter.email.placeholder")}
                      </label>
                      <input
                        type="email"
                        id="newsletter-email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`w-full px-6 py-4 rounded-xl border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-300 text-lg hover:bg-background/70 ${
                          emailError
                            ? "border-red-500 shadow-lg shadow-red-500/20"
                            : "border-border hover:border-teal-500/50"
                        }`}
                        placeholder={t("newsletter.email.placeholder")}
                        disabled={status.type === "loading"}
                      />
                      <AnimatePresence>
                        {emailError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm mt-2"
                          >
                            {emailError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={status.type === "loading"}
                      className="px-8 py-4 bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-teal-500/50 disabled:to-emerald-500/50 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105"
                      whileHover={{
                        scale: status.type === "loading" ? 1 : 1.02,
                      }}
                      whileTap={{ scale: status.type === "loading" ? 1 : 0.98 }}
                    >
                      {status.type === "loading" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t("newsletter.subscribing")}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t("newsletter.subscribe")}
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {status.type !== "idle" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`p-5 rounded-xl flex items-center gap-3 font-medium text-base ${
                          status.type === "success"
                            ? "bg-green-500/20 text-green-700 dark:text-green-300 border-2 border-green-500/40"
                            : status.type === "error"
                              ? "bg-red-500/20 text-red-700 dark:text-red-300 border-2 border-red-500/40"
                              : "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-2 border-teal-500/40"
                        }`}
                      >
                        {status.type === "success" && (
                          <CheckCircle className="w-5 h-5 shrink-0" />
                        )}
                        {status.type === "error" && (
                          <AlertCircle className="w-5 h-5 shrink-0" />
                        )}
                        {status.type === "loading" && (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
                        )}
                        <span>{status.message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Privacy Note */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("newsletter.privacy")}
                    </p>
                  </div>
                </form>
              </div>
            </AnimatedSection>

            {/* Features */}
            <AnimatedSection delay={0.6}>
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500/20 rounded-full mb-4">
                    <Mail className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t("newsletter.feature1.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("newsletter.feature1.desc")}
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t("newsletter.feature2.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("newsletter.feature2.desc")}
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-4">
                    <Send className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t("newsletter.feature3.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("newsletter.feature3.desc")}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
