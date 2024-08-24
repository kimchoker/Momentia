'use client'
import "./globals.css";
import Sibar from "../components/new-neo-sidebar";
import Providers from "../states/providers";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
          <meta name="description" content=""/>
        </Head>
        <body className="nanumbarungothic">
            <Providers>
              {children}
            </Providers>
        </body>
      </html>
    </QueryClientProvider>
      
  );
}


