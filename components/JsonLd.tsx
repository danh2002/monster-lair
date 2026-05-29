interface ArticleSchemaProps {
  authorName: string;
  dateModified: string;
  datePublished: string;
  description: string;
  image?: string;
  title: string;
  url: string;
}

const getBaseUrl = () => process.env.NEXT_PUBLIC_SERVER_URL || 'https://dinoisland.com';

export function ArticleJsonLd({
  authorName,
  dateModified,
  datePublished,
  description,
  image,
  title,
  url,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    author: [
      {
        '@type': 'Person',
        name: authorName,
      },
    ],
    dateModified,
    datePublished,
    description,
    headline: title,
    image: image ? [image] : [],
    mainEntityOfPage: {
      '@id': url,
      '@type': 'WebPage',
    },
    publisher: {
      '@type': 'Organization',
      logo: {
        '@type': 'ImageObject',
        url: `${getBaseUrl()}/images/dao-khung-long-logo.png`,
      },
      name: 'Đảo Khủng Long',
    },
  };

  return <script dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} type="application/ld+json" />;
}

export function EventJsonLd({ event, url }: { event: any; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    description: typeof event.description === 'string' ? event.description : event.excerpt,
    endDate: event.eventEndDate,
    image: event.featuredImage?.url,
    location: {
      '@type': 'Place',
      address: event.address,
      name: event.locationName || 'Online',
    },
    name: event.title,
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'Đảo Khủng Long',
    },
    startDate: event.eventStartDate,
    url,
  };

  return <script dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} type="application/ld+json" />;
}
