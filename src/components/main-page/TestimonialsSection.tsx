import { FeaturedTestimonial } from "./FeaturedTestimonial";
import { TestimonialCard } from "./TestimonialCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  quote: string;
  title?: string;
  featured: boolean;
}

interface TestimonialData {
  featured: Testimonial[];
  grid: Testimonial[];
}

export function TestimonialsSection() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<TestimonialData>({ featured: [], grid: [] });
  const [loading, setLoading] = useState(true);
  
  // Load testimonials when language changes
  useEffect(() => {
    const loadTestimonials = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/content/${language}/testimonials.json`);
        if (!response.ok) {
          // Fallback to Finnish if English fails
          if (language !== 'fi') {
            const fallbackResponse = await fetch('/content/fi/testimonials.json');
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              setData(fallbackData);
            }
          }
          throw new Error(`Failed to load testimonials for ${language}`);
        }
        const testimonials = await response.json();
        setData(testimonials);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        // Use empty data as fallback
        setData({ featured: [], grid: [] });
      } finally {
        setLoading(false);
      }
    };
    
    loadTestimonials();
  }, [language]);
  
  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">{t('common.loading')}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <AnimatedSection delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('testimonials.title')}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('testimonials.subtitle')}
            </p>
          </AnimatedSection>
        </div>

        {/* Featured Testimonials */}
        <div className="grid gap-8 lg:gap-12 mb-16">
          {data.featured.map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={0.6 + (index * 0.2)}>
              <FeaturedTestimonial 
                title={testimonial.title || ''}
                quote={testimonial.quote}
              />
            </AnimatedSection>
          ))}
        </div>

        {/* Grid Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {data.grid.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: 1.0 + (index * 0.2),
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
            >
              <TestimonialCard quote={testimonial.quote} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}