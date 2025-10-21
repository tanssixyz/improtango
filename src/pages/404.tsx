import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Mail } from "lucide-react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";

export default function NotFoundPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={t("404.seo.title")}
        description={t("404.seo.description")}
        type="website"
      />

      <main className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated 404 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-8xl md:text-9xl font-bold text-teal-500/20 mb-4">
                404
              </h1>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-500/20 rounded-full mb-8">
                <Search className="w-12 h-12 text-teal-500" />
              </div>
            </motion.div>

            {/* Main Content */}
            <ErrorBoundary>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {t("404.title")}
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                  {t("404.subtitle")}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              >
                <Link to="/">
                  <motion.button
                    className="inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-600 text-white font-medium py-4 px-8 rounded-xl transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Home className="w-5 h-5" />
                    {t("404.back_home")}
                  </motion.button>
                </Link>

                <Link to="/concepts">
                  <motion.button
                    className="inline-flex items-center gap-3 bg-background hover:bg-muted text-foreground border border-border font-medium py-4 px-8 rounded-xl transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Search className="w-5 h-5" />
                    {t("404.explore_concepts")}
                  </motion.button>
                </Link>
              </motion.div>

              {/* Helpful Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-background rounded-2xl shadow-2xl p-8 md:p-12 border border-border/50"
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {t("404.helpful_links")}
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <Link to="/about" className="group">
                    <div className="p-6 rounded-xl border border-border hover:border-teal-500/50 transition-colors duration-200">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500/20 rounded-full mb-4 group-hover:bg-teal-500/30 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-teal-500" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {t("404.about_link")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("404.about_desc")}
                      </p>
                    </div>
                  </Link>

                  <Link to="/concepts" className="group">
                    <div className="p-6 rounded-xl border border-border hover:border-teal-500/50 transition-colors duration-200">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full mb-4 group-hover:bg-emerald-500/30 transition-colors">
                        <Search className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {t("404.concepts_link")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("404.concepts_desc")}
                      </p>
                    </div>
                  </Link>

                  <div className="p-6 rounded-xl border border-border">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-4">
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {t("404.contact_link")}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t("404.contact_desc")}
                    </p>
                    <a
                      href="mailto:info@improtango.fi"
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                    >
                      info@improtango.fi
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Inspirational Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-16 p-8 rounded-2xl bg-linear-to-br from-teal-500/5 via-background to-emerald-500/5 border border-teal-500/20"
              >
                <blockquote className="text-xl italic text-muted-foreground mb-4">
                  "{t("404.quote")}"
                </blockquote>
                <cite className="text-teal-500 font-medium">
                  {t("404.quote_attribution")}
                </cite>
              </motion.div>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
}
