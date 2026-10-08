export interface PageKeywords {
  main: string;
  related: [string, string];
}

export interface FAQEntry {
  question: string;
  answer: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  image?: string;
  keywords?: PageKeywords;
  faqEntries?: FAQEntry[];
}

export function updatePageSEO(config: SEOConfig) {
  // Update Document Title
  const baseTitle = 'The Corridor – Cricket Analytics & Tactical Journal';
  const targetTitle = config.title
    ? config.title.includes('The Corridor')
      ? config.title
      : `${config.title} | The Corridor`
    : baseTitle;

  document.title = targetTitle;

  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.description);

  // Update Meta Keywords
  if (config.keywords) {
    const keywordString = `${config.keywords.main}, ${config.keywords.related[0]}, ${config.keywords.related[1]}`;
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywordString);
  }

  // Update Canonical Link
  const currentUrl = window.location.origin + (config.canonicalPath || window.location.pathname);
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', currentUrl);

  // Helper for meta tags
  const setMetaProperty = (attr: 'property' | 'name', name: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // OpenGraph Tags
  setMetaProperty('property', 'og:title', targetTitle);
  setMetaProperty('property', 'og:description', config.description);
  setMetaProperty('property', 'og:url', currentUrl);
  setMetaProperty('property', 'og:type', config.type || 'website');
  setMetaProperty('property', 'og:site_name', 'The Corridor');
  if (config.image) {
    setMetaProperty('property', 'og:image', config.image);
  }

  // Twitter / X Card Tags
  setMetaProperty('name', 'twitter:card', 'summary_large_image');
  setMetaProperty('name', 'twitter:title', targetTitle);
  setMetaProperty('name', 'twitter:description', config.description);
  if (config.image) {
    setMetaProperty('name', 'twitter:image', config.image);
  }

  // Update Schema.org JSON-LD
  let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(jsonLdScript);
  }

  const keywordList = config.keywords
    ? `${config.keywords.main}, ${config.keywords.related[0]}, ${config.keywords.related[1]}`
    : undefined;

  let structuredData: any;

  if (config.type === 'article') {
    const articleEntity = {
      '@type': 'TechArticle',
      '@id': `${currentUrl}#article`,
      'isPartOf': {
        '@type': 'WebSite',
        'name': 'The Corridor',
        'url': window.location.origin,
      },
      'headline': targetTitle,
      'description': config.description,
      'keywords': keywordList,
      'image': config.image,
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
    };

    // If FAQ entries exist (for AEO Question-Answer Optimization), produce a multi-entity @graph
    if (config.faqEntries && config.faqEntries.length > 0) {
      const faqEntity = {
        '@type': 'FAQPage',
        '@id': `${currentUrl}#faq`,
        'mainEntity': config.faqEntries.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer,
          },
        })),
      };

      structuredData = {
        '@context': 'https://schema.org',
        '@graph': [articleEntity, faqEntity],
      };
    } else {
      structuredData = {
        '@context': 'https://schema.org',
        ...articleEntity,
      };
    }
  } else {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Periodical',
      'name': 'The Corridor: Cricket Intelligence & Tactical Journal',
      'description': config.description,
      'keywords': keywordList,
      'url': window.location.origin,
      'issn': '2814-9921',
    };
  }

  jsonLdScript.textContent = JSON.stringify(structuredData);
}
