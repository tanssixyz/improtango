// Error message translations for backend
export const errorMessages = {
  fi: {
    newsletter: {
      alreadySubscribed: "Tämä sähköpostiosoite on jo tilattu uutiskirjeelle.",
      rateLimit: (minutes: number) => `Olet jo lähettänyt uutiskirjetilauksen. Voit yrittää uudelleen ${minutes} minuutin kuluttua.`,
    },
    contact: {
      rateLimit: (minutes: number) => `Olet jo lähettänyt yhteydenottolomakkeen. Voit yrittää uudelleen ${minutes} minuutin kuluttua.`,
    },
    validation: {
      emailRequired: "Sähköpostiosoite on pakollinen",
      emailInvalid: "Virheellinen sähköpostiosoite",
      nameRequired: "Nimi on pakollinen ja saa olla enintään 100 merkkiä",
      subjectRequired: "Aihe on pakollinen ja saa olla enintään 200 merkkiä", 
      messageRequired: "Viesti on pakollinen ja saa olla enintään 5000 merkkiä",
    }
  },
  en: {
    newsletter: {
      alreadySubscribed: "This email address is already subscribed to the newsletter.",
      rateLimit: (minutes: number) => `You have already submitted a newsletter subscription. You can try again in ${minutes} minutes.`,
    },
    contact: {
      rateLimit: (minutes: number) => `You have already submitted a contact form. You can try again in ${minutes} minutes.`,
    },
    validation: {
      emailRequired: "Email address is required",
      emailInvalid: "Invalid email address",
      nameRequired: "Name is required and must be less than 100 characters",
      subjectRequired: "Subject is required and must be less than 200 characters",
      messageRequired: "Message is required and must be less than 5000 characters",
    }
  }
};

// Simple language detection (defaults to Finnish)
export function getErrorMessage(key: string, lang: 'fi' | 'en' = 'fi', params?: any): string {
  const keys = key.split('.');
  let message: any = errorMessages[lang];
  
  for (const k of keys) {
    message = message?.[k];
  }
  
  if (typeof message === 'function' && params) {
    return message(params);
  }
  
  return typeof message === 'string' ? message : key;
}