import { description, siteName, siteUrl, socialLinks } from "@/lib/constants";

type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${siteUrl}#organization`;

function organizationReference() {
  return { "@id": ORGANIZATION_ID };
}

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/aicraft-logo-primary.svg`,
    description,
    sameAs: [socialLinks.linkedin, socialLinks.facebook],
  };
}

type CourseSchemaInput = {
  name: string;
  description: string;
  url: string;
  image?: string;
  price: number;
  priceCurrency?: string;
  availability?: string;
};

export function courseSchema(input: CourseSchemaInput): JsonLd {
  const {
    name,
    description: courseDescription,
    url,
    image,
    price,
    priceCurrency = "USD",
    availability = "https://schema.org/InStock",
  } = input;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description: courseDescription,
    url,
    image: image ?? `${siteUrl}/aicraft-logo-primary.svg`,
    provider: {
      "@type": "Organization",
      ...organizationReference(),
      name: siteName,
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
      availability,
      url,
    },
  };
}

export function jsonLdScript(data: JsonLd): string {
  // Escape `</script` to prevent breaking out of the script tag in any nested
  // string values — JSON.stringify alone won't catch this.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
