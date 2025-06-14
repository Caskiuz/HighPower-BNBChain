'use client'; // ¡Esta directiva es CRÍTICA aquí!

import React from 'react';
import { createConfig, WagmiConfig, http } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask, walletConnect, injected } from '@wagmi/connectors';

// 1. Crea la configuración de Wagmi
const config = createConfig({
  autoConnect: true,
  chains: [bscTestnet],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID_HERE',
      showQrModal: true,
    }),
    injected(),
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
});

// 2. Crea un QueryClient para @tanstack/react-query
const queryClient = new QueryClient();

export function ClientProviders({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
