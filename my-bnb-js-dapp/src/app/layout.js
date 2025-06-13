import './globals.css'; // <-- ¡¡CORRECCIÓN DE RUTA!!
import { Inter } from 'next/font/google';
import { WagmiProviderWrapper } from '@/providers/WagmiProvider'; // Import your Wagmi provider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mi DApp BNB JS',
  description: 'Aplicación Descentralizada en BNB Chain con JavaScript',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <WagmiProviderWrapper>
          {children}
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}
