import { Helmet } from 'react-helmet-async';

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  imageAlt?: string;
}

const BASE_URL = 'https://www.zitundo.com';

export default function PageSEO({ title, description, path = '', imageAlt }: PageSEOProps) {
  const canonical = `${BASE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
    </Helmet>
  );
}
