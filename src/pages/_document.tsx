import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => (
            <AntdRegistry>
              <App {...props} />
            </AntdRegistry>
          ),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
      };
    } finally {
      // 不再需要 registry.reset()
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
} 