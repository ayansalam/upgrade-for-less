import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
} 