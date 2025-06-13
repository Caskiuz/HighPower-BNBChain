'use client'; // This directive is necessary for client-side components in Next.js

import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi'; // Removed useNetwork to avoid past issues

export default function HomePage() {
  const { address, isConnected } = useAccount(); // Hook to get address and connection status
  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect(); // Hook to connect wallets
  const { disconnect } = useDisconnect(); // Hook to disconnect
  // Network chain info is omitted for this minimal working example
  // const { chain } = useNetwork(); // This line is intentionally commented out/removed

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Mi DApp BNB JS
      </h1>

      {/* Wallet connection section */}
      {isConnected ? (
        <div className="text-center">
          <p className="text-lg mb-2 text-gray-400">
            Conectado como: <span className="font-mono text-purple-300">{address}</span>
          </p>
          {/* Network display is omitted for this minimal example */}
          {/* {chain && (
            <p className="text-md mb-4 text-gray-500">
              Red: <span className="font-mono text-blue-300">{chain.name} ({chain.id})</span>
            </p>
          )} */}
          <button
            onClick={() => disconnect()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Desconectar Cartera
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!connector.ready || isConnecting}
            >
              {isConnecting && connector.id === pendingConnector?.id
                ? 'Conectando...'
                : `Conectar con ${connector.name}`}
            </button>
          ))}
          {error && <p className="text-red-500 mt-2 text-center">{error.message}</p>}
        </div>
      )}
    </div>
  );
}
