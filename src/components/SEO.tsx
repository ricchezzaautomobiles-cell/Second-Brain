import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  schema?: object;
}

export function SEO({ title, description, keywords, canonical, schema }: SEOProps) {
  useEffect(() => {
    // Standardize title and metadata
    document.title = `${title} | Beyond — AI-Powered Mental Clarity, Focus & Decision Intelligence`;

    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("author", "Beyond AI");
    
    // Open Graph (Facebook/LinkedIn)
    updateMetaTag("og:title", `${title} | Beyond AI`, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:site_name", "Beyond AI", true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:image", "https://beyond.openminded.vercel.app/og-image.jpg", true);
    updateMetaTag("og:url", canonical || window.location.href, true);
    
    // Twitter Cards
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", `${title} | Beyond AI`);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", "https://beyond.openminded.vercel.app/og-image.jpg");

    // Canonical link handling
    let linkElement = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!linkElement) {
      linkElement = document.createElement("link");
      linkElement.setAttribute("rel", "canonical");
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute("href", canonical || window.location.href);

    // Schema Structured Data injection (JSON-LD)
    if (schema) {
      let scriptElement = document.getElementById("json-ld-schema") as HTMLScriptElement;
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.id = "json-ld-schema";
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }
      scriptElement.text = JSON.stringify(schema);
    }

  }, [title, description, keywords, canonical, schema]);

  return null;
}

function updateMetaTag(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let element = document.querySelector(`meta[${attr}='${name}']`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}
