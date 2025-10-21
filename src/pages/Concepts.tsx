import { ConceptSection } from "@/components/concepts/ConceptSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import {
  getConceptIntro,
  getConceptsAsConceptData,
  type ConceptData,
} from "@/lib/concepts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const { language, t } = useLanguage();
  const [concepts, setConcepts] = useState<ConceptData[]>([]);
  const [intro, setIntro] = useState<{
    quote: string;
    author: string;
    content: string;
  }>({
    quote: "",
    author: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);

  // Load concepts data when language changes
  useEffect(() => {
    const loadConceptsData = async () => {
      setLoading(true);
      try {
        const [conceptsData, introData] = await Promise.all([
          getConceptsAsConceptData(language),
          getConceptIntro(language),
        ]);
        setConcepts(conceptsData);
        setIntro(introData);
      } catch (error) {
        console.error("Error loading concepts data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConceptsData();
  }, [language]);

  // Ensure page scrolls to top when navigating to this route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">{t("common.loading")}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={t("concepts.seo.title")}
        description={t("concepts.seo.description")}
        url="https://improtango.fi/konseptit"
        keywords={[
          "improtango konseptit",
          "tango filosofia",
          "paritanssi periaatteet",
          "improvisaatio",
          "modernit tanssikonseptit",
          "Minna Tuovinen",
          "Martin Heslop",
        ]}
        type="article"
      />
      {/* Intro Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero-2.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Nietzsche Quote */}
          <motion.blockquote
            className="text-2xl md:text-3xl lg:text-4xl leading-relaxed italic text-white mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.5,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            <motion.span
              className="text-4xl md:text-5xl lg:text-6xl text-teal-400 leading-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              "
            </motion.span>
            {intro.quote}
            <motion.span
              className="text-4xl md:text-5xl lg:text-6xl text-teal-400 leading-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 1.5,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              "
            </motion.span>

            {/* Author */}
            <motion.cite
              className="block text-lg md:text-xl text-slate-300 not-italic mt-6 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.8,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              — {intro.author}
            </motion.cite>
          </motion.blockquote>

          {/* Intro Paragraph */}
          <motion.div
            className="prose prose-lg prose-invert max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 2.2,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            <div
              className="text-lg md:text-xl leading-relaxed text-slate-200"
              dangerouslySetInnerHTML={{
                __html: intro.content
                  .split("\\n\\n")
                  .map((p) => `<p>${p}</p>`)
                  .join(""),
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Seven Concept Sections */}
      {concepts.map((concept) => (
        <ConceptSection
          key={concept.number}
          number={concept.number}
          title={concept.title}
          quote={concept.quote}
          author={concept.author}
          content={concept.content}
          image={concept.image}
          isReversed={concept.number % 2 === 0}
        />
      ))}
    </div>
  );
}
