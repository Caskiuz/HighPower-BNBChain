'use client'; // Directive for client component in Next.js

import React from 'react';
import { createConfig, WagmiConfig, http } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ¡¡CORRECCIÓN CRÍTICA Y DEFINITIVA PARA WAGMI V2 CONECTORES!!
// Importa los conectores como FUNCIONES directamente desde 'wagmi/connectors'
import { metaMask, walletConnect, injected } from 'wagmi/connectors';

// 1. Create Wagmi configuration
const config = createConfig({
  // 'autoConnect' goes here in createConfig, this is correct for Wagmi v2.
  autoConnect: true, // Attempts to auto-connect to the last used wallet.
  chains: [bscTestnet], // Defines the chains your DApp will interact with
  connectors: [
    // ¡¡CRITICAL CORRECTION!!: Call connectors as FUNCTIONS, DO NOT use 'new'
    metaMask(), // Call the metaMask() function
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID', // Important! Replace with your WalletConnect Project ID
      showQrModal: true,
    }),
    injected(), // Call the injected() function
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
});

// 2. Create a QueryClient for @tanstack/react-query
const queryClient = new QueryClient();

interface WagmiProviderProps {
  children: React.ReactNode;
}

export const WagmiProviderWrapper: React.FC<WagmiProviderProps> = ({ children }) => {
  return (
    // 'autoConnect' is NOT passed as a prop here; it's within the 'config' object.
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
};
