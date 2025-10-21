import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: 'fi_FI' | 'en_US';
  structuredData?: Record<string, unknown>;
}

export function SEO({
  title = 'Improtango - Moderni paritanssin tanssimuoto',
  description = 'Improtango on moderni tanssimuoto, jossa jokainen hetki syntyy hetkessä. Ei valmiita kaavoja, vain kaksi ihmistä ja vapaus luoda yhdessä. Opettajat: Minna Tuovinen & Martin Heslop.',
  image = '/images/og/og-1.jpg',
  url,
  type = 'website',
  keywords = ['improtango', 'tango', 'tanssi', 'paritanssi', 'improvisaatio', 'Helsinki', 'tanssikoulu', 'workshopit'],
  author = 'Minna Tuovinen & Martin Heslop',
  publishedTime,
  modifiedTime,
  locale = 'fi_FI',
  structuredData,
}: SEOProps) {
  
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Helper function to set meta tag
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic SEO meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords.join(', '));
    setMetaTag('author', author);
    setMetaTag('robots', 'index, follow');
    setMetaTag('language', locale === 'fi_FI' ? 'Finnish' : 'English');
    
    // Open Graph meta tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:locale', locale, true);
    setMetaTag('og:site_name', 'Improtango', true);
    
    if (image) {
      setMetaTag('og:image', image.startsWith('http') ? image : `https://improtango.fi${image}`, true);
      setMetaTag('og:image:alt', title, true);
      setMetaTag('og:image:width', '1200', true);
      setMetaTag('og:image:height', '630', true);
    }
    
    if (url) {
      setMetaTag('og:url', url, true);
    }
    
    // Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    if (image) {
      setMetaTag('twitter:image', image.startsWith('http') ? image : `https://improtango.fi${image}`);
    }
    
    // Article specific meta tags
    if (type === 'article') {
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        setMetaTag('article:modified_time', modifiedTime, true);
      }
      setMetaTag('article:author', author, true);
    }
    
    // Structured data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || window.location.href);
    
    // Add viewport meta tag if not exists
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(viewport);
    }
    
    // Add robots meta tag
    setMetaTag('robots', 'index, follow');
    
    // Add PWA manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      manifestLink.setAttribute('href', '/manifest.json');
      document.head.appendChild(manifestLink);
    }
    
    // Add theme color meta tags for PWA
    setMetaTag('theme-color', '#14b8a6');
    setMetaTag('msapplication-TileColor', '#14b8a6');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    setMetaTag('apple-mobile-web-app-title', 'Improtango');
    
  }, [title, description, image, url, type, keywords, author, publishedTime, modifiedTime, locale, structuredData]);

  return null; // This component doesn't render anything
}

