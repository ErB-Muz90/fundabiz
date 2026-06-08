import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'FundaBiz - Empowering Kenyan SMEs',
  description: 'Digital financial platform for Kenyan SMEs and suppliers with escrow-based order management, KYC verification, and smart loan repayment.',
  keywords: ['SME', 'Kenya', 'finance', 'escrow', 'loans', 'supplier'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
