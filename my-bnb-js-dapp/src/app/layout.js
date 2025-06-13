import './globals.css';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic'; // <-- Importa 'dynamic' de Next.js
import React from 'react'; // Asegura que React esté importado

const inter = Inter({ subsets: ['latin'] });

// Carga dinámica del WagmiProviderWrapper para asegurar que solo se renderice en el CLIENTE.
// Esto evita que se ejecute código específico del navegador durante la compilación/SSR.
const DynamicWagmiProviderWrapper = dynamic(
  () => import('@/providers/WagmiProvider').then(mod => mod.WagmiProviderWrapper),
  { ssr: false } // ¡¡MUY IMPORTANTE!!: No renderizar en el servidor.
);

export const metadata = {
  title: 'Mi DApp BNB JS',
  description: 'Aplicación Descentralizada en BNB Chain con JavaScript',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Usa el componente de carga dinámica */}
        <DynamicWagmiProviderWrapper>
          {children}
        </DynamicWagmiProviderWrapper>
      </body>
    </html>
  );
}
