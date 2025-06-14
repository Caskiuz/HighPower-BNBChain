import './globals.css';
import { Inter } from 'next/font/google';
import { ClientProviders } from '@/components/ClientProviders'; // <-- ¡IMPORTA EL NUEVO COMPONENTE CLIENTE!

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mi DApp BNB JS',
  description: 'Aplicación Descentralizada en BNB Chain con JavaScript',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Ahora envuelve con el componente de cliente.
            Este componente es el que tiene 'use client' y la configuración de Wagmi,
            resolviendo el problema del SSR con el root layout. */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
