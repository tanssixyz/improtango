import { useNavigate } from "react-router-dom";
import { AnimatedSection } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

const conceptIds = [1, 2, 3, 4, 5, 6, 7];

export function ConceptsTeaser() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleNavigateToKonseptit = () => {
    navigate("concepts");
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50/30 via-background to-teal-50/20 dark:from-slate-900/30 dark:via-background dark:to-teal-950/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-teal-500/5 to-transparent opacity-50"></div>
      <div className="relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {t("concepts.title")}
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              {t("concepts.subtitle")}
            </p>
          </AnimatedSection>

          {/* Concepts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
            {conceptIds.map((conceptId, index) => (
              <motion.div
                key={conceptId}
                className="bg-slate-800/30 hover:bg-gradient-to-br hover:from-teal-900/20 hover:to-emerald-900/20 transition-all duration-300 rounded-lg p-4 text-center border border-slate-700/50 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6 + index * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                whileHover={{
                  y: -2,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="text-sm font-mono text-teal-400 mb-2">
                  {conceptId.toString().padStart(2, "0")}
                </div>
                <div className="text-sm font-medium text-slate-200">
                  {t(`concepts.${conceptId}`)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <AnimatedSection delay={1.3}>
            <button
              onClick={handleNavigateToKonseptit}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 cursor-pointer shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105"
            >
              {t("concepts.button")}
              <span>→</span>
            </button>
          </AnimatedSection>
        </div>
      </div>
      </div>
    </section>
  );
}
