'use client'; // This directive is necessary for client-side components in Next.js

import React from 'react';
import { createConfig, WagmiConfig, http } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask, walletConnect, injected } from '@wagmi/connectors';

// 1. Create the Wagmi configuration
const config = createConfig({
  autoConnect: true, // Propiedad correctamente ubicada para auto-conectar en Wagmi v2
  chains: [bscTestnet], // Defines the chains your DApp will interact with
  connectors: [
    metaMask(), // Llama a la función metaMask()
    walletConnect({
      // ¡¡CORRECCIÓN CRÍTICA!!: El projectId DEBE ser una cadena de texto (entre comillas).
      // Asegúrate de reemplazar 'YOUR_WALLETCONNECT_PROJECT_ID_HERE' con tu ID real de WalletConnect Cloud.
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID_HERE',
      showQrModal: true,
    }),
    injected(), // Llama a la función injected()
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
});

// 2. Create a QueryClient for @tanstack/react-query
const queryClient = new QueryClient();

export function WagmiProviderWrapper({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
