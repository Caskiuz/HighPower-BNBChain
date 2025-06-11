import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WagmiProviderWrapper } from '@/providers/WagmiProvider'; // Importa tu proveedor Wagmi

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HighPower DApp',
  description: 'Decentralized Application on BNB Chain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // CORREGIDO: Lang configurado explícitamente a "es"
    <html lang="es">
      {/* CORREGIDO: Eliminadas las clases de fuentes problemáticas, solo se usa inter.className */}
      <body className={inter.className}>
        <WagmiProviderWrapper>
          {children}
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}
