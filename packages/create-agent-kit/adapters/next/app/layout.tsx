import type { Metadata } from 'next';

import { AppKitProvider } from '@/components/AppKitProvider';
import Header from '@/components/Header';
import './globals.css';

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
      <body>
        <AppKitProvider>
          <Header />
          {children}
        </AppKitProvider>
      </body>
    </html>
  );
}
