'use client'; // This directive is necessary for client-side components in Next.js

import React from 'react';
import { createConfig, WagmiConfig, http } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask, walletConnect, injected } from '@wagmi/connectors';

// 1. Create the Wagmi configuration
const config = createConfig({
  autoConnect: true, // Attempts to auto-connect to the last used wallet.
  chains: [bscTestnet], // Defines the chains your DApp will interact with
  connectors: [
    metaMask(), // MetaMask connector (as a function call)
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 56246e8df9c9151e77b7e93def28838e, // IMPORTANT! Replace with your WalletConnect Project ID
      showQrModal: true,
    }),
    injected(), // Injected connector (e.g., for other browser wallets)
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
