import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/cart/CartProvider';

export const metadata: Metadata = {
  title: 'Ranisa Boutique - Premium Fashion & Ethnic Wear',
  description:
    'Discover exquisite collection of sarees, salwar suits, lehengas, and ethnic wear at Ranisa Boutique. Premium quality, latest designs, and best prices.',
  keywords: [
    'boutique',
    'ethnic wear',
    'sarees',
    'salwar suits',
    'lehengas',
    'indian fashion',
    'Ranisa Boutique',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

