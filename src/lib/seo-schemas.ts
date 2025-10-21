// Predefined structured data schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Improtango",
  "description": "Moderni tanssimuoto, jossa jokainen hetki syntyy hetkessä",
  "url": "https://improtango.fi",
  "logo": "https://improtango.fi/images/og/og-1.jpg",
  "foundingDate": "2020",
  "founders": [
    {
      "@type": "Person",
      "name": "Minna Tuovinen",
      "jobTitle": "Tanssija, koreografi ja opettaja"
    },
    {
      "@type": "Person", 
      "name": "Martin Heslop",
      "jobTitle": "Tanssija, koreografi ja opettaja"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Helsinki",
    "addressCountry": "FI"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "info@improtango.fi",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://info.improtango.fi"
  ]
};

export const danceSchoolSchema = {
  "@context": "https://schema.org",
  "@type": "DanceSchool",
  "name": "Improtango",
  "description": "Improtango on moderni tanssimuoto, jossa jokainen hetki syntyy hetkessä",
  "url": "https://improtango.fi",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Helsinki", 
    "addressCountry": "FI"
  },
  "instructor": [
    {
      "@type": "Person",
      "name": "Minna Tuovinen",
      "jobTitle": "Tanssija, koreografi ja opettaja"
    },
    {
      "@type": "Person",
      "name": "Martin Heslop", 
      "jobTitle": "Tanssija, koreografi ja opettaja"
    }
  ],
  "offers": {
    "@type": "Offer",
    "description": "Improtango workshopit ja tunnit",
    "category": "Dance Classes"
  }
};