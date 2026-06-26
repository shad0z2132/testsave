import Head from "next/head";

const SITE_URL = "https://www.savepoint.run";
const DEFAULT_IMAGE = `${SITE_URL}/SAVEPOINT2-social.png?v=1`;
const DEFAULT_TITLE = "SavePoint — Your checkpoint for Solana games";
const DEFAULT_DESCRIPTION =
  "Discover, track, and analyze verified Solana gaming tokens with real safety scores and live market data.";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}

export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path = "/",
  noIndex = false,
}: SEOProps) {
  const canonicalUrl = `${SITE_URL}${path}`.replace(/\/$/, "") + "/";
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "SavePoint",
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        url: canonicalUrl,
        name: title,
        description,
        isPartOf: { "@id": SITE_URL },
      },
      {
        "@type": "Organization",
        name: "SavePoint",
        url: SITE_URL,
        logo: `${SITE_URL}/savepointlogolime.png`,
        sameAs: ["https://x.com/savepointsol"],
      },
    ],
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="SavePoint" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@savepointsol" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
