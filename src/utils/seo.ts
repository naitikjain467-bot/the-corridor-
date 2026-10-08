export interface SEOConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  image?: string;
}

export function updatePageSEO(config: SEOConfig) {
  // Update Document Title
  const baseTitle = 'The Corridor | Cricket Intelligence & Tactical Journal';
  document.title = config.title ? `${config.title} | The Corridor` : baseTitle;

  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.description);

  // Update Canonical Link
  const currentUrl = window.location.origin + (config.canonicalPath || window.location.pathname);
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', currentUrl);

  // Update OpenGraph
  const setMetaProperty = (prop: string, content: string) => {
    let el = document.querySelector(`meta[property="${prop}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', prop);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaProperty('og:title', config.title || baseTitle);
  setMetaProperty('og:description', config.description);
  setMetaProperty('og:url', currentUrl);
  setMetaProperty('og:type', config.type || 'website');
  if (config.image) {
    setMetaProperty('og:image', config.image);
  }

  // Update Schema.org JSON-LD
  let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(jsonLdScript);
  }

  const structuredData = config.type === 'article'
    ? {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': config.title,
        'description': config.description,
        'author': {
          '@type': 'Person',
          'name': config.author || 'The Corridor Editorial Board',
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'The Corridor',
          'url': window.location.origin,
        },
        'datePublished': config.publishedTime,
        'mainEntityOfPage': currentUrl,
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Periodical',
        'name': 'The Corridor: Cricket Intelligence & Tactical Journal',
        'description': config.description,
        'url': window.location.origin,
        'issn': '2814-9921',
      };

  jsonLdScript.textContent = JSON.stringify(structuredData);
}
