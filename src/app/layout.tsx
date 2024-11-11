'use client';

import './globals.css';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <Head>
          <meta name="Momentia" content="" />
        </Head>
        <body className="nanumbarungothic">{children}</body>
      </html>
    </QueryClientProvider>
  );
}
