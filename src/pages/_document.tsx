import Document, { Html, Head, Main, NextScript } from "next/document";

class AppDocument extends Document {
  render() {
    return (
      <Html data-theme="light">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lobster&family=Playfair+Display&family=Source+Sans+Pro&family=Noto+Sans+TC&family=Noto+Serif+TC&family=Raleway:wght@100;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="appearance-none">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
