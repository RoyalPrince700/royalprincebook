import { useEffect } from 'react';
import { portfolioMeta } from '../data/portfolioData';

const upsertMeta = (attribute, key, content) => {
  if (!content) return;

  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

export const usePortfolioSEO = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = portfolioMeta.title;

    upsertMeta('name', 'description', portfolioMeta.description);
    upsertMeta('property', 'og:title', portfolioMeta.title);
    upsertMeta('property', 'og:description', portfolioMeta.description);
    upsertMeta('property', 'og:url', portfolioMeta.url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:image', portfolioMeta.image);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', portfolioMeta.title);
    upsertMeta('name', 'twitter:description', portfolioMeta.description);
    upsertMeta('name', 'twitter:image', portfolioMeta.image);
    upsertMeta('name', 'twitter:site', portfolioMeta.twitter);

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ologundudu Joseph Adesunkanmi',
      alternateName: 'Royal Prince',
      url: portfolioMeta.url,
      jobTitle: 'Growth Officer, Software Engineer, Product Builder',
      worksFor: {
        '@type': 'Organization',
        name: 'Accessible Publishers Limited'
      },
      sameAs: [
        'https://twitter.com/royalprincecube',
        'https://github.com/RoyalPrince700',
        'https://www.linkedin.com/in/ologundudu-joseph-adesukanmi-2172a1135/',
        'https://www.royalprincehub.com'
      ]
    };

    const scriptId = 'portfolio-person-schema';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      document.title = previousTitle;
    };
  }, []);
};
