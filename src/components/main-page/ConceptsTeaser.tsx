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
    <section className="py-20 md:py-32 bg-background">
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
                className="bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-200 rounded-lg p-4 text-center border border-slate-700/50"
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
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
            >
              {t("concepts.button")}
              <span>→</span>
            </button>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
