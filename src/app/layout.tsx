import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Lushan Thrift | Thrift Clothes in Mombasa & Kenya',
  description:
    'Shop pre-loved thrift clothing in Mombasa and across Kenya. Sustainable fashion, unique finds.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: 'Lushan Thrift' },
};

export const viewport: Viewport = {
  themeColor: '#2d2a26',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased bg-stone-50 text-stone-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
