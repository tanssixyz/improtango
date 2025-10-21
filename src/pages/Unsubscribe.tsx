import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SEO } from "@/components/SEO";
import { useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message: string;
}

export default function UnsubscribePage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const unsubscribe = useMutation(api.newsletter.unsubscribe);
  const sendUnsubscribeNotification = useAction(
    api.newsletter.sendUnsubscribeNotification
  );
  const checkSubscription = useQuery(
    api.newsletter.checkSubscription,
    emailFromUrl ? { email: emailFromUrl } : "skip"
  );

  const [email, setEmail] = useState(emailFromUrl || "");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });
  const [hasUnsubscribed, setHasUnsubscribed] = useState(false);

  // Auto-unsubscribe if email is provided in URL and is subscribed
  useEffect(() => {
    const autoUnsubscribe = async () => {
      if (emailFromUrl && checkSubscription?.isSubscribed && !hasUnsubscribed) {
        await handleUnsubscribe(emailFromUrl);
      }
    };
    autoUnsubscribe();
  }, [emailFromUrl, checkSubscription?.isSubscribed, hasUnsubscribed]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError(t("unsubscribe.email_required"));
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t("unsubscribe.email_invalid"));
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleUnsubscribe = async (emailToUnsubscribe?: string) => {
    const targetEmail = emailToUnsubscribe || email;

    if (!emailToUnsubscribe && !validateEmail(targetEmail)) {
      return;
    }

    setStatus({
      type: "loading",
      message: t("unsubscribe.status_loading"),
    });
    setHasUnsubscribed(true);

    try {
      // 1. Unsubscribe from newsletter (mutation)
      await unsubscribe({ email: targetEmail });

      // 2. Send admin notification (action) - don't fail if this fails
      try {
        await sendUnsubscribeNotification({ email: targetEmail });
      } catch (notificationError) {
        console.warn(
          "Failed to send unsubscribe notification to admin:",
          notificationError
        );
        // Continue with success even if admin notification fails
      }

      setStatus({
        type: "success",
        message: t("unsubscribe.status_success"),
      });
      setEmail("");
      setEmailError("");
    } catch (error) {
      console.error("Unsubscribe error:", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : t("unsubscribe.status_error"),
      });
      setHasUnsubscribed(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUnsubscribe();
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError("");
    }
  };

  // If URL has email and it's not subscribed, show appropriate message
  const showNotSubscribed =
    emailFromUrl &&
    checkSubscription &&
    !checkSubscription.isSubscribed &&
    !hasUnsubscribed;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={t("unsubscribe.seo.title")}
        description={t("unsubscribe.seo.description")}
        url="https://improtango.fi/unsubscribe"
        type="website"
      />

      <main className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
                <Mail className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("unsubscribe.title")}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("unsubscribe.subtitle")}
              </p>
            </div>

            {/* Main Content */}
            <ErrorBoundary>
              <div className="bg-background rounded-2xl shadow-2xl p-8 md:p-12 border border-border/50">
                {/* Show not subscribed message */}
                {showNotSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl flex items-center gap-3 font-medium text-base bg-blue-500/20 text-blue-700 dark:text-blue-300 border-2 border-blue-500/40 mb-6"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>
                      Sähköpostiosoite {emailFromUrl} {t("unsubscribe.not_subscribed")}
                    </span>
                  </motion.div>
                )}

                {/* Unsubscribe Form */}
                {!showNotSubscribed && status.type !== "success" && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="unsubscribe-email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t("unsubscribe.email_label")}
                      </label>
                      <input
                        type="email"
                        id="unsubscribe-email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                          emailError
                            ? "border-red-500"
                            : "border-border hover:border-red-500/50"
                        }`}
                        placeholder={t("unsubscribe.email_placeholder")}
                        disabled={status.type === "loading" || !!emailFromUrl}
                        readOnly={!!emailFromUrl}
                      />
                      <AnimatePresence>
                        {emailError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {emailError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={status.type === "loading"}
                      className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-medium py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      whileHover={{
                        scale: status.type === "loading" ? 1 : 1.02,
                      }}
                      whileTap={{ scale: status.type === "loading" ? 1 : 0.98 }}
                    >
                      {status.type === "loading" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t("unsubscribe.button_loading")}
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          {t("unsubscribe.button")}
                        </>
                      )}
                    </motion.button>
                  </form>
                )}

                {/* Status Messages */}
                <AnimatePresence>
                  {status.type !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`p-5 rounded-xl flex items-start gap-3 font-medium text-base ${
                        status.type === "success"
                          ? "bg-green-500/20 text-green-700 dark:text-green-300 border-2 border-green-500/40"
                          : status.type === "error"
                            ? "bg-red-500/20 text-red-700 dark:text-red-300 border-2 border-red-500/40"
                            : "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-2 border-blue-500/40"
                      } ${status.type !== "success" ? "mt-6" : ""}`}
                    >
                      {status.type === "success" && (
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      )}
                      {status.type === "error" && (
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      )}
                      {status.type === "loading" && (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                      )}
                      <span>{status.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Actions */}
                {status.type === "success" && (
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-4">
                      {t("unsubscribe.resubscribe_text")}
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t("unsubscribe.back_home")}
                    </Link>
                  </div>
                )}

                {/* Help Text */}
                {status.type === "idle" && (
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      {t("unsubscribe.help_text")}{" "}
                      <a
                        href="mailto:info@improtango.fi"
                        className="text-teal-500 hover:text-teal-600"
                      >
                        info@improtango.fi
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
}
