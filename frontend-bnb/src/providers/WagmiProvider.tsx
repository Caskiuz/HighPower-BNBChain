'use client'; // Directiva para componente de cliente en Next.js

import React from 'react';
import { createConfig, WagmiConfig, http } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ¡¡CORRECCIÓN CRÍTICA Y DEFINITIVA PARA WAGMI V2 CONECTORES!!
// Importa los conectores como FUNCIONES directamente desde 'wagmi/connectors'
import { metaMask, walletConnect, injected } from 'wagmi/connectors';

// 1. Crea la configuración de Wagmi
const config = createConfig({
  // 'autoConnect' va aquí en createConfig, esto es correcto para Wagmi v2.
  autoConnect: true, // Intenta reconectar automáticamente a la última billetera utilizada.
  chains: [bscTestnet], // Define las cadenas con las que tu DApp interactuará
  connectors: [
    // ¡¡CORRECCIÓN CRÍTICA!!: Llama a los conectores como FUNCIONES, NO uses 'new'
    metaMask(), // Llama a la función metaMask()
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID', // ¡Importante! Reemplaza con tu ID de proyecto de WalletConnect
      showQrModal: true,
    }),
    injected(), // Llama a la función injected()
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
});

// 2. Crea un QueryClient para @tanstack/react-query
const queryClient = new QueryClient();

interface WagmiProviderProps {
  children: React.ReactNode;
}

export const WagmiProviderWrapper: React.FC<WagmiProviderProps> = ({ children }) => {
  return (
    // 'autoConnect' NO se pasa como prop aquí; está dentro del objeto 'config'.
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
};
