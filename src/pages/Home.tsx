import { SEO } from "@/components/SEO";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import {
  loadAllMainPageSections,
  type MainPageSection,
} from "@/lib/main-page-content";
import { PhotoStrip } from "@/components/main-page/PhotoStrip";
import { Hero } from "@/components/main-page/Hero";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Section } from "@/components/main-page/Section";
import { danceSchoolSchema, organizationSchema } from "@/lib/seo-schemas";
import { getPhotoStrips } from "@/lib/photo-strips";
import { TestimonialsSection } from "@/components/main-page/TestimonialsSection";
import { ConceptsTeaser } from "@/components/main-page/ConceptsTeaser";
import { PrivacyBanner } from "@/components/PrivacyBanner";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import { registerServiceWorker } from "@/lib/pwa";
import { NewsletterSignup } from "@/components/main-page/NewsletterSignup";
import { ContactForm } from "@/components/main-page/ContactForm";

export default function Home() {
  const { language, t } = useLanguage();
  const [content, setContent] = useState<{
    intro?: MainPageSection;
    philosophy?: MainPageSection;
    journey?: MainPageSection;
    communication?: MainPageSection;
    whoFor?: MainPageSection;
  }>({});

  let photoStrips: { images: string[]; id: string }[] = [];
  let strip1, strip2, strip3, strip4, strip5, strip6;

  // Load main page content when language changes
  useEffect(() => {
    loadAllMainPageSections(language).then(setContent);
  }, [language]);
  try {
    photoStrips = getPhotoStrips();

    // Get strips by index
    strip1 = photoStrips[0];
    strip2 = photoStrips[1];
    strip3 = photoStrips[2];
    strip4 = photoStrips[3];
    strip5 = photoStrips[4] || photoStrips[0]; // Fallback
    strip6 = photoStrips[5] || photoStrips[1]; // Fallback
  } catch (error) {
    console.error("Error loading photo strips:", error);
    // Provide fallback empty strips to prevent crashes
    strip1 = strip2 = strip3 = strip4 = strip5 = strip6 = null;
  }
  // Register service worker for PWA
  useEffect(() => {
    registerServiceWorker();
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Improtango - Moderni paritanssin tanssimuoto | Minna Tuovinen & Martin Heslop"
        description="Improtango on moderni tanssimuoto, jossa jokainen hetki syntyy hetkessä. Ei valmiita kaavoja, vain kaksi ihmistä ja vapaus luoda yhdessä. Opettajat: Minna Tuovinen & Martin Heslop."
        url="https://improtango.fi"
        keywords={[
          "improtango",
          "tango",
          "tanssi",
          "paritanssi",
          "improvisaatio",
          "Helsinki",
          "tanssikoulu",
          "workshopit",
          "Minna Tuovinen",
          "Martin Heslop",
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [organizationSchema, danceSchoolSchema],
        }}
      />
      <Hero />
      {/* 2. Introduction Section */}
      <ErrorBoundary>
        <Section title={t("intro.title")} variant="default">
          {content.intro ? (
            <div dangerouslySetInnerHTML={{ __html: content.intro.content }} />
          ) : (
            <div className="text-muted-foreground">{t("common.loading")}</div>
          )}
        </Section>
      </ErrorBoundary>
      {/* 3. Photo Strip #1 (fade-scale animation) */}
      <ErrorBoundary>
        {strip1 && (
          <PhotoStrip
            images={strip1.images}
            id={strip1.id}
            animationVariant="fade-scale"
          />
        )}
      </ErrorBoundary>
      {/* 4. Philosophy Section */}
      <Section
        title={content.philosophy?.title || "Loading..."}
        variant="muted"
      >
        {content.philosophy ? (
          <div
            dangerouslySetInnerHTML={{ __html: content.philosophy.content }}
          />
        ) : (
          <div className="text-muted-foreground">{t("common.loading")}</div>
        )}
      </Section>

      {/* 5. Photo Strip #2 (slide-stagger animation) */}
      {strip2 && (
        <PhotoStrip
          images={strip2.images}
          id={strip2.id}
          animationVariant="slide-stagger"
        />
      )}

      {/* 6. Journey Section */}
      <Section title={content.journey?.title || "Loading..."} variant="default">
        {content.journey ? (
          <div dangerouslySetInnerHTML={{ __html: content.journey.content }} />
        ) : (
          <div className="text-muted-foreground">{t("common.loading")}</div>
        )}
      </Section>

      {/* 7. Photo Strip #3 (rotate-reveal animation) */}
      {strip3 && (
        <PhotoStrip
          images={strip3.images}
          id={strip3.id}
          animationVariant="rotate-reveal"
        />
      )}

      {/* 8. Communication Section */}
      <Section
        title={content.communication?.title || "Loading..."}
        variant="muted"
      >
        {content.communication ? (
          <div
            dangerouslySetInnerHTML={{ __html: content.communication.content }}
          />
        ) : (
          <div className="text-muted-foreground">{t("common.loading")}</div>
        )}
      </Section>

      {/* 9. Photo Strip #4 (fade-scale animation) */}
      {strip4 && (
        <PhotoStrip
          images={strip4.images}
          id={strip4.id}
          animationVariant="fade-scale"
        />
      )}

      {/* 10. Who-For Section */}
      <Section title={content.whoFor?.title || "Loading..."} variant="default">
        {content.whoFor ? (
          <div dangerouslySetInnerHTML={{ __html: content.whoFor.content }} />
        ) : (
          <div className="text-muted-foreground">{t("common.loading")}</div>
        )}
      </Section>

      {/* 11. Photo Strip #5 (slide-stagger animation) */}
      {strip5 && (
        <PhotoStrip
          images={strip5.images}
          id={strip5.id}
          animationVariant="slide-stagger"
        />
      )}
      {/* 12. Testimonials Section */}
      <TestimonialsSection />

      {/* 13. Photo Strip #6 (rotate-reveal animation) */}
      {strip6 && (
        <PhotoStrip
          images={strip6.images}
          id={strip6.id}
          animationVariant="rotate-reveal"
        />
      )}

      {/* 14. Concepts Teaser Section */}
      <ConceptsTeaser />
      {/* 15. Newsletter Signup Section */}
      <NewsletterSignup />

      {/* 16. Contact Form Section */}
      <ContactForm />
      <PrivacyBanner />
      <PWAInstallBanner />
    </div>
  );
}
