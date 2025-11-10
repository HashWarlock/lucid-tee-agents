import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AppKitProvider } from '@/components/AppKitProvider';
import Header from '@/components/Header';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lucid Agent Platform',
  description: 'Full-stack agent platform with x402 micropayments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppKitProvider>
          <Header />
          {children}
        </AppKitProvider>
      </body>
    </html>
  );
}
