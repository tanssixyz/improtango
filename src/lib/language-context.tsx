import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type Language = "fi" | "en";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const initialState: LanguageProviderState = {
  language: "fi",
  setLanguage: () => null,
  toggleLanguage: () => null,
  t: (key: string) => key,
};

const LanguageProviderContext =
  createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
  children,
  defaultLanguage = "fi",
  storageKey = "language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'fi' || stored === 'en') {
        return stored;
      }
    }
    return defaultLanguage;
  });

  // Persist language preference to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, language);
    }
  }, [language, storageKey]);

  // Toggle between fi and en
  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === "fi" ? "en" : "fi"));
  }, []);

  // UI translations for common elements
  const translations = useMemo(
    () => ({
      fi: {
        // Navigation
        "nav.home": "Etusivu",
        "nav.concepts": "Konseptit",
        "nav.about": "Tietoa meistä",
        "nav.newsletter": "Uutiskirje",
        "nav.contact": "Ota yhteyttä",

        // Hero
        "hero.subtitle": "Minna Tuovinen & Martin Heslop",
        "hero.quote1":
          "Virtaus on tila, jossa tekijä katoaa ja jäljelle jää vain puhdas liike.",
        "hero.quote2":
          "Tila ei ole tyhjyyttä vaan mahdollisuuksien kenttä, jossa liike saa merkityksensä.",
        "hero.quote3":
          "Aito yhteys syntyy, kun kaksi ihmistä päättää olla läsnä samassa hetkessä.",
        "hero.quote4":
          "Keho on instrumentti, joka osaa laulaa, kun sitä kuuntelee tarpeeksi tarkasti.",
        "hero.quote5":
          "Jokainen liike on valinta, jokainen hetki mahdollisuus ilmentää jotain aitoa.",

        // Contact
        "contact.title": "Ota yhteyttä",
        "contact.subtitle":
          "Haluatko tietää lisää Improtangosta tai varata työpajan? Lähetä meille viesti, niin vastaamme mahdollisimman pian.",
        "contact.response": "Otamme yhteyttä pian",
        "contact.response.text":
          "Lähetä meille viesti lomakkeella, niin vastaamme mahdollisimman pian. Voit myös ottaa suoraan yhteyttä sähköpostitse tai seurata meitä sosiaalisessa mediassa.",
        "contact.email": "Sähköposti",
        "contact.social": "Seuraa meitä",
        "contact.send": "Lähetä viesti",
        "contact.form.name": "Nimi",
        "contact.form.email": "Sähköposti",
        "contact.form.subject": "Aihe",
        "contact.form.message": "Viesti",
        "contact.form.sending": "Lähetetään...",
        "contact.form.name.placeholder": "Nimesi",
        "contact.form.email.placeholder": "sähköposti@esimerkki.fi",
        "contact.form.subject.placeholder":
          "Esim. Työpajan varaus, kysymys Improtangosta...",
        "contact.form.message.placeholder":
          "Kerro meille lisää... Millaista tietoa kaipaat tai millainen työpaja sinua kiinnostaisi?",

        // Newsletter
        "newsletter.title": "Pysy mukana Improtangon maailmassa",
        "newsletter.subtitle":
          "Tilaa uutiskirjeemme ja saat tietoa tulevista workshopeista, tapahtumista ja Improtangon kehittymisestä. Lähetämme vain silloin, kun meillä on todella jotain kerrottavaa.",
        "newsletter.email.placeholder": "Sähköpostiosoitteesi",
        "newsletter.subscribe": "Tilaa uutiskirje",
        "newsletter.subscribing": "Tilataan...",
        "newsletter.privacy":
          "Arvostamme yksityisyyttäsi. Sähköpostiosoitettasi käytetään vain uutiskirjeen lähettämiseen ja voit perua tilauksen milloin tahansa.",
        "newsletter.feature1.title": "Harvoin, mutta hyödyllisesti",
        "newsletter.feature1.desc":
          "Lähetämme uutiskirjettä vain muutaman kerran vuodessa",
        "newsletter.feature2.title": "Ainoastaan olennaista",
        "newsletter.feature2.desc": "Workshopit, tapahtumat ja tärkeät uutiset",
        "newsletter.feature3.title": "Helppo peruuttaa",
        "newsletter.feature3.desc":
          "Voit lopettaa tilauksen milloin tahansa yhdellä klikkauksella",

        // Testimonials
        "testimonials.title": "Mitä osallistujat sanovat",
        "testimonials.subtitle":
          "Aidot kokemukset Improtango-työpajoista ja kursseista",

        // Concepts
        "concepts.title": "Seitsemän peruskäsitettä",
        "concepts.subtitle": "Tutustu Improtangon ytimeen",
        "concepts.button": "Tutustu käsitteisiin",
        "concepts.1": "Vastakkaisuus",
        "concepts.2": "Ilmeneminen",
        "concepts.3": "Keho",
        "concepts.4": "Yhteys",
        "concepts.5": "Rytmi",
        "concepts.6": "Tila",
        "concepts.7": "Virtaus",

        // Footer
        "footer.contact": "Yhteystiedot",
        "footer.follow": "Seuraa meitä",
        "footer.newsletter": "Uutiskirje",
        "footer.privacy": "Tietosuoja",
        "footer.unsubscribe": "Peruuta tilaus",
        "footer.about": "Lue lisää Minna Tuovisen & Martin Heslopin tarinasta",

        // Main page sections
        "intro.title": "Mikä on Improtango?",

        // About page
        "about.hero.subtitle":
          "Tanssijat, koreografit ja opettajat, jotka ovat työskennelleet yhdessä vuodesta 1991",
        "about.seo.title":
          "Tietoa meistä - Minna Tuovinen & Martin Heslop | Improtango",
        "about.seo.description":
          "Tutustuu Improtangon opettajiin Minna Tuoviseen ja Martin Hesloppiin. Heidän tarinansa, visionsa ja matka kohti modernia paritanssia.",
        
        // Concepts page
        "concepts.seo.title": "Seitsemän Konseptia - Improtango | Minna Tuovinen & Martin Heslop",
        "concepts.seo.description": "Tutustu improtangon seitsemään perusperiaatteeseen ja filosofiaan. Näiden konseptien kautta avautuu modernin paritanssin syvyys ja kauneus.",

        // 404 page
        "404.seo.title": "404 - Sivua ei löytynyt | Improtango",
        "404.seo.description": "Etsimäsi sivu ei löytynyt. Palaa takaisin Improtangon etusivulle tai tutustu konsepteihimme.",
        "404.title": "Sivua ei löytynyt",
        "404.subtitle": "Etsimäsi sivu on kadonnut jonnekin tanssin rytmiin. Ehkä se improvisoi uuden paikan, tai ehkä kirjoitit osoitteen väärin?",
        "404.back_home": "Takaisin etusivulle",
        "404.explore_concepts": "Tutustu konsepteihin",
        "404.helpful_links": "Ehkä etsit jotain näistä?",
        "404.about_link": "Tietoa meistä",
        "404.about_desc": "Minna Tuovinen & Martin Heslop ja Improtangon tarina",
        "404.concepts_link": "Konseptit",
        "404.concepts_desc": "Seitsemän ydinkonseptia Improtangon maailmasta",
        "404.contact_link": "Ota yhteyttä",
        "404.contact_desc": "Kysy meiltä suoraan Improtangosta",
        "404.quote": "Joskus eksyneet askeleet johtavat kauneimpiin löytöihin. Kuten tanssissa, myös netissä voi löytää jotain odottamatonta.",
        "404.quote_attribution": "— Improtangon filosofia",

        // Unsubscribe page
        "unsubscribe.seo.title": "Peruuta uutiskirjeen tilaus - Improtango",
        "unsubscribe.seo.description": "Peruuta Improtangon uutiskirjeen tilaus. Voit helposti lopettaa uutiskirjeen tilauksen tällä sivulla.",
        "unsubscribe.title": "Peruuta uutiskirjeen tilaus",
        "unsubscribe.subtitle": "Ikävä kuulla, että haluat lopettaa uutiskirjeemme tilauksen. Anna sähköpostiosoitteesi alla peruuttaaksesi tilauksen.",
        "unsubscribe.email_label": "Sähköpostiosoite",
        "unsubscribe.email_placeholder": "sähköposti@esimerkki.fi",
        "unsubscribe.button": "Peruuta tilaus",
        "unsubscribe.button_loading": "Peruutetaan...",
        "unsubscribe.status_loading": "Peruutetaan uutiskirjeen tilausta...",
        "unsubscribe.status_success": "Uutiskirjeen tilaus on peruutettu onnistuneesti. Et saa enää uutiskirjeitä tähän sähköpostiosoitteeseen.",
        "unsubscribe.status_error": "Uutiskirjeen tilauksen peruuttamisessa tapahtui virhe. Yritä uudelleen.",
        "unsubscribe.not_subscribed": "ei ole tilattu uutiskirjeeseemme.",
        "unsubscribe.email_required": "Sähköposti on pakollinen",
        "unsubscribe.email_invalid": "Virheellinen sähköpostiosoite",
        "unsubscribe.help_text": "Jos sinulla on ongelmia tilauksen peruuttamisessa, voit ottaa meihin yhteyttä osoitteessa",
        "unsubscribe.resubscribe_text": "Jos muutat mielesi, voit tilata uutiskirjeen uudelleen milloin tahansa etusivultamme.",
        "unsubscribe.back_home": "Takaisin etusivulle",

        // Common
        "common.loading": "Ladataan...",
        "common.error": "Virhe",
        "common.success": "Onnistui",
      },
      en: {
        // Navigation
        "nav.home": "Home",
        "nav.concepts": "Concepts",
        "nav.about": "About",
        "nav.newsletter": "Newsletter",
        "nav.contact": "Contact",

        // Hero
        "hero.subtitle": "Minna Tuovinen & Martin Heslop",
        "hero.quote1":
          "Flow is a state where the doer disappears and only pure movement remains.",
        "hero.quote2":
          "Space is not emptiness but a field of possibilities where movement finds its meaning.",
        "hero.quote3":
          "Authentic connection arises when two people choose to be present in the same moment.",
        "hero.quote4":
          "The body is an instrument that knows how to sing when listened to carefully enough.",
        "hero.quote5":
          "Every movement is a choice, every moment an opportunity to express something authentic.",

        // Contact
        "contact.title": "Contact Us",
        "contact.subtitle":
          "Want to know more about Improtango or book a workshop? Send us a message and we'll get back to you as soon as possible.",
        "contact.response": "We will contact you soon",
        "contact.response.text":
          "Send us a message using the form, and we'll respond as soon as possible. You can also contact us directly via email or follow us on social media.",
        "contact.email": "Email",
        "contact.social": "Follow Us",
        "contact.send": "Send Message",
        "contact.form.name": "Name",
        "contact.form.email": "Email",
        "contact.form.subject": "Subject",
        "contact.form.message": "Message",
        "contact.form.sending": "Sending...",
        "contact.form.name.placeholder": "Your name",
        "contact.form.email.placeholder": "email@example.com",
        "contact.form.subject.placeholder":
          "e.g. Workshop booking, question about Improtango...",
        "contact.form.message.placeholder":
          "Tell us more... What kind of information do you need or what kind of workshop interests you?",

        // Newsletter
        "newsletter.title": "Stay Connected with Improtango",
        "newsletter.subtitle":
          "Subscribe to our newsletter and get updates about upcoming workshops, events and the evolution of Improtango. We only send when we really have something to share.",
        "newsletter.email.placeholder": "Your email address",
        "newsletter.subscribe": "Subscribe to Newsletter",
        "newsletter.subscribing": "Subscribing...",
        "newsletter.privacy":
          "We respect your privacy. Your email address is only used for sending the newsletter and you can unsubscribe at any time.",
        "newsletter.feature1.title": "Rarely, but helpfully",
        "newsletter.feature1.desc":
          "We only send newsletters a few times a year",
        "newsletter.feature2.title": "Only essentials",
        "newsletter.feature2.desc": "Workshops, events and important news",
        "newsletter.feature3.title": "Easy to cancel",
        "newsletter.feature3.desc":
          "You can unsubscribe at any time with one click",

        // Testimonials
        "testimonials.title": "What participants say",
        "testimonials.subtitle":
          "Real experiences from Improtango workshops and courses",

        // Concepts
        "concepts.title": "Seven Core Concepts",
        "concepts.subtitle": "Explore the essence of Improtango",
        "concepts.button": "Explore Concepts",
        "concepts.1": "Difference",
        "concepts.2": "Becoming",
        "concepts.3": "Body",
        "concepts.4": "Connection",
        "concepts.5": "Rhythm",
        "concepts.6": "Space",
        "concepts.7": "Flow",

        // Footer
        "footer.contact": "Contact",
        "footer.follow": "Follow Us",
        "footer.newsletter": "Newsletter",
        "footer.privacy": "Privacy",
        "footer.unsubscribe": "Unsubscribe",
        "footer.about": "Read more about Minna Tuovinen & Martin Heslop",

        // Main page sections
        "intro.title": "What is Improtango?",

        // About page
        "about.hero.subtitle":
          "Dancers, choreographers and teachers who have worked together since 1991",
        "about.seo.title":
          "About Us - Minna Tuovinen & Martin Heslop | Improtango",
        "about.seo.description":
          "Meet Improtango teachers Minna Tuovinen and Martin Heslop. Their story, vision and journey towards modern partner dance.",
        
        // Concepts page
        "concepts.seo.title": "Seven Concepts - Improtango | Minna Tuovinen & Martin Heslop",
        "concepts.seo.description": "Explore the seven core principles and philosophy of improtango. Through these concepts, the depth and beauty of modern partner dance unfolds.",

        // 404 page
        "404.seo.title": "404 - Page Not Found | Improtango",
        "404.seo.description": "The page you are looking for was not found. Return to Improtango's homepage or explore our concepts.",
        "404.title": "Page not found",
        "404.subtitle": "The page you're looking for has disappeared somewhere into the rhythm of dance. Maybe it's improvising a new place, or maybe you typed the address wrong?",
        "404.back_home": "Back to homepage",
        "404.explore_concepts": "Explore concepts",
        "404.helpful_links": "Maybe you're looking for one of these?",
        "404.about_link": "About us",
        "404.about_desc": "Minna Tuovinen & Martin Heslop and the Improtango story",
        "404.concepts_link": "Concepts",
        "404.concepts_desc": "Seven core concepts from the world of Improtango",
        "404.contact_link": "Contact us",
        "404.contact_desc": "Ask us directly about Improtango",
        "404.quote": "Sometimes lost steps lead to the most beautiful discoveries. Like in dance, you can find something unexpected on the web too.",
        "404.quote_attribution": "— Improtango philosophy",

        // Unsubscribe page
        "unsubscribe.seo.title": "Unsubscribe from Newsletter - Improtango",
        "unsubscribe.seo.description": "Unsubscribe from Improtango newsletter. You can easily stop receiving our newsletter on this page.",
        "unsubscribe.title": "Unsubscribe from newsletter",
        "unsubscribe.subtitle": "Sorry to hear you want to stop receiving our newsletter. Enter your email address below to unsubscribe.",
        "unsubscribe.email_label": "Email address",
        "unsubscribe.email_placeholder": "email@example.com",
        "unsubscribe.button": "Unsubscribe",
        "unsubscribe.button_loading": "Unsubscribing...",
        "unsubscribe.status_loading": "Unsubscribing from newsletter...",
        "unsubscribe.status_success": "Newsletter subscription has been successfully cancelled. You will no longer receive newsletters to this email address.",
        "unsubscribe.status_error": "An error occurred while unsubscribing from the newsletter. Please try again.",
        "unsubscribe.not_subscribed": "is not subscribed to our newsletter.",
        "unsubscribe.email_required": "Email is required",
        "unsubscribe.email_invalid": "Invalid email address",
        "unsubscribe.help_text": "If you have problems unsubscribing, you can contact us at",
        "unsubscribe.resubscribe_text": "If you change your mind, you can resubscribe to the newsletter at any time from our homepage.",
        "unsubscribe.back_home": "Back to homepage",

        // Common
        "common.loading": "Loading...",
        "common.error": "Error",
        "common.success": "Success",
      },
    }),
    []
  );

  // Translation function with fallback support
  const t = useCallback(
    (key: string): string => {
      const translation =
        translations[language][key as keyof (typeof translations)["fi"]];
      return (
        translation ||
        translations.fi[key as keyof (typeof translations)["fi"]] ||
        key
      );
    },
    [language, translations]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, toggleLanguage, t]
  );

  return (
    <LanguageProviderContext {...props} value={value}>
      {children}
    </LanguageProviderContext>
  );
}

export const useLanguage = () => {
  const context = use(LanguageProviderContext);

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");

  return context;
};
