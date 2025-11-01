import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useLanguage } from "@/lib/language-context";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message: string;
}

export function ContactForm() {
  const { t } = useLanguage();
  const sendContactMessage = useAction(api.contact.sendContactMessage);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("errors.validation.name_required");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("errors.validation.email_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("errors.validation.email_invalid");
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t("errors.validation.subject_required");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("errors.validation.message_required");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("errors.validation.message_too_short");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus({ type: "loading", message: "Lähetetään viestiä..." });

    try {
      await sendContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setStatus({
        type: "success",
        message:
          "Kiitos viestistäsi! Otamme sinuun yhteyttä pian. Olet saanut vahvistuksen sähköpostiisi.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setStatus({ type: "idle", message: "" });
      }, 5000);
    } catch (error) {
      console.error("Contact form error:", error);

      // Extract and translate error messages
      let errorMessage = t("errors.contact.general");
      
      if (error instanceof Error) {
        const errorText = error.message;
        
        // Look for ConvexError pattern in the message
        const convexErrorMatch = errorText.match(/ConvexError: (.+?)(?:\s+at|$)/);
        if (convexErrorMatch && convexErrorMatch[1]) {
          const extractedMessage = convexErrorMatch[1].trim();
          
          // Map specific error messages to translation keys
          if (extractedMessage.includes('Rate limit exceeded') || extractedMessage.includes('yhteydenottolomakkeen')) {
            // Extract minutes from rate limit message
            const minutesMatch = extractedMessage.match(/(\d+)\s*minuutin?/);
            const minutes = minutesMatch ? minutesMatch[1] : '60';
            errorMessage = t("errors.contact.rate_limit").replace('{minutes}', minutes);
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-linear-to-br from-slate-50/50 via-muted/30 to-teal-50/30 dark:from-slate-900/50 dark:via-muted/30 dark:to-teal-900/30 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-t from-muted/20 to-transparent animate-pulse opacity-30"></div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <AnimatedSection delay={0.2}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {t("contact.title")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {t("contact.subtitle")}
                </p>
              </div>
            </AnimatedSection>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left Column - Contact Info */}
              <AnimatedSection delay={0.4}>
                <div className="space-y-8">
                  {/* Contact Message */}
                  <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-900/10 p-8 border border-border/50 hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-500 hover:border-teal-500/30">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {t("contact.response")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("contact.response.text")}
                    </p>
                  </div>

                  {/* Email Contact */}
                  <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-900/10 p-8 border border-border/50 hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-500 hover:border-teal-500/30">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-teal-500/10 rounded-lg">
                        <Mail className="w-6 h-6 text-teal-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {t("contact.email")}
                        </h4>
                        <a
                          href="mailto:info@improtango.fi"
                          className="text-teal-500 hover:text-teal-600 transition-colors"
                        >
                          info@improtango.fi
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-900/10 p-8 border border-border/50 hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-500 hover:border-teal-500/30">
                    <h4 className="font-semibold text-foreground mb-6">
                      {t("contact.social")}
                    </h4>
                    <div className="flex gap-4">
                      <a
                        href="https://facebook.com/improtango"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors group"
                      >
                        <Facebook className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                      </a>
                      <a
                        href="https://instagram.com/improtango"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg transition-colors group"
                      >
                        <Instagram className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Right Column - Contact Form */}
              <AnimatedSection delay={0.6}>
                <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-900/20 p-8 border border-border/50 hover:shadow-3xl hover:shadow-slate-900/30 transition-all duration-500 hover:border-teal-500/30">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    {t("contact.send")}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          <User className="inline w-4 h-4 mr-2" />
                          {t("contact.form.name")} *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`w-full px-4 py-3 rounded-lg border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-300 hover:bg-background/70 ${
                            errors.name
                              ? "border-red-500 shadow-lg shadow-red-500/20"
                              : "border-border hover:border-teal-500/50"
                          }`}
                          placeholder={t("contact.form.name.placeholder")}
                          disabled={status.type === "loading"}
                        />
                        <AnimatePresence>
                          {errors.name && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 text-sm mt-1"
                            >
                              {errors.name}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          <Mail className="inline w-4 h-4 mr-2" />
                          {t("contact.form.email")} *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`w-full px-4 py-3 rounded-lg border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-300 hover:bg-background/70 ${
                            errors.email
                              ? "border-red-500 shadow-lg shadow-red-500/20"
                              : "border-border hover:border-teal-500/50"
                          }`}
                          placeholder={t("contact.form.email.placeholder")}
                          disabled={status.type === "loading"}
                        />
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 text-sm mt-1"
                            >
                              {errors.email}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        <MessageSquare className="inline w-4 h-4 mr-2" />
                        {t("contact.form.subject")} *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        className={`w-full px-4 py-3 rounded-lg border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-300 hover:bg-background/70 ${
                          errors.subject
                            ? "border-red-500 shadow-lg shadow-red-500/20"
                            : "border-border hover:border-teal-500/50"
                        }`}
                        placeholder={t("contact.form.subject.placeholder")}
                        disabled={status.type === "loading"}
                      />
                      <AnimatePresence>
                        {errors.subject && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.subject}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t("contact.form.message")} *
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        className={`w-full px-4 py-3 rounded-lg border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:shadow-lg focus:shadow-teal-500/20 transition-all duration-300 resize-none hover:bg-background/70 ${
                          errors.message
                            ? "border-red-500 shadow-lg shadow-red-500/20"
                            : "border-border hover:border-teal-500/50"
                        }`}
                        placeholder={t("contact.form.message.placeholder")}
                        disabled={status.type === "loading"}
                      />
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
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
                            <CheckCircle className="w-5 h-5" />
                          )}
                          {status.type === "error" && (
                            <AlertCircle className="w-5 h-5" />
                          )}
                          {status.type === "loading" && (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          )}
                          <span>{status.message}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        disabled={status.type === "loading"}
                        className="w-full bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:from-teal-500/50 disabled:to-emerald-500/50 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105"
                        whileHover={{
                          scale: status.type === "loading" ? 1 : 1.02,
                        }}
                        whileTap={{
                          scale: status.type === "loading" ? 1 : 0.98,
                        }}
                      >
                        {status.type === "loading" ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t("contact.form.sending")}
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {t("contact.send")}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
