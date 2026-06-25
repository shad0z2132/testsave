import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/faviconsavepointlime.png" />
        <meta name="description" content="SavePoint — your checkpoint for Solana games. Discover, track, and analyze verified web3 gaming tokens with real safety scores." />
        <meta name="theme-color" content="#000000" />
        <meta property="og:title" content="SavePoint — Your checkpoint for Solana games" />
        <meta property="og:description" content="Discover verified Solana gaming tokens with real safety scores and live market data." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.savepoint.run/SAVEPOINT2.png" />
        <meta property="og:image:width" content="3750" />
        <meta property="og:image:height" content="1250" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SavePoint — Your checkpoint for Solana games" />
        <meta name="twitter:description" content="Discover verified Solana gaming tokens with real safety scores and live market data." />
        <meta name="twitter:image" content="https://www.savepoint.run/SAVEPOINT2.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
