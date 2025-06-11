'use client'; // Directive for client component in Next.js

import React, { useState } from 'react'; // Removed useMemo as it was not used
import { useAccount, useConnect, useDisconnect, useNetwork, useWriteContract, useSimulateContract } from 'wagmi'; // useWriteContract and useSimulateContract for transactions
import { ContractFunctionExecutionError } from 'viem'; // Import specific error type

// Import ABIs of your contracts
// For your SimpleToken BEP-20
// Removed SimpleTokenABI and SIMPLE_TOKEN_CONTRACT_ADDRESS as they are not used in the current UI logic
import MyNFTABI from '../../abis/MyNFT.sol/MyNFT.json'; // Adjust path if necessary

// !! IMPORTANT: These addresses are from your successful deployment !!
const SIMPLE_TOKEN_CONTRACT_ADDRESS = '0xE02F5740F01EDBC5ccAE634312f7C6a90a31053B'; // Your deployed SimpleToken address (kept for future use, but currently not used in UI)
const MY_NFT_CONTRACT_ADDRESS = '0x4732ecF022235C877f60Ca000eEA7c19440f436F'; // Your deployed MyNFT address

// Main application component
export default function HomePage() {
  const { address, isConnected } = useAccount(); // Hook to get address and connection status
  // Adjusted useConnect destructuring: 'status' removed as it was not used.
  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect(); // Hook to connect wallets
  const { disconnect } = useDisconnect(); // Hook to disconnect
  const { chain } = useNetwork(); // Hook to get current chain information

  // State for NFT minting
  const [nftMintingMessage, setNftMintingMessage] = useState('');
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const [nftTokenURI, setNftTokenURI] = useState('ipfs://QmZ4Y9pMv2oW2f7v8k3f3h3g3d3c3b3a3c3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z'); // Example URI for NFT metadata (replace this)

  // useSimulateContract replaces usePrepareContractWrite in Wagmi v2
  const { data: mintNftConfig, error: simulateMintNftError } = useSimulateContract({
    address: MY_NFT_CONTRACT_ADDRESS as `0x${string}`, // Cast to correct Viem address type
    abi: MyNFTABI.abi, // ABI of the NFT contract
    functionName: 'mintNFT',
    args: [address, nftTokenURI], // Mint NFT to the connected address with the specified URI
    enabled: isConnected && !!address && !isMintingNFT, // Enable if connected and not currently minting
  });

  // useWriteContract replaces useContractWrite in Wagmi v2
  // isMintNftSuccess, isMintNftError, mintNftTxError removed from destructuring as not explicitly used.
  const { writeContract: mintNFT, isPending: isMintingNFTTx } = useWriteContract();

  const handleMintNFT = async () => {
    // Ensure mintNftConfig.request exists and call writeContract
    if (!mintNftConfig || !mintNftConfig.request || !mintNFT) {
      setNftMintingMessage("Error: Could not prepare NFT mint function. Make sure you are connected and the NFT contract is deployed.");
      if (simulateMintNftError) {
        console.error("Error simulating NFT mint:", simulateMintNftError);
      }
      return;
    }
    setIsMintingNFT(true);
    setNftMintingMessage('Minting NFT...');
    try {
      // Pass the request object from the simulation to writeContract
      await mintNFT(mintNftConfig.request);
    } catch (err: unknown) { // Explicitly type 'err' as unknown and narrow
       if (err instanceof ContractFunctionExecutionError) {
            setNftMintingMessage(`Error minting NFT: ${err.shortMessage || err.message}`);
          } else if (err instanceof Error) { // Catch general Error types
            setNftMintingMessage(`Error minting NFT: ${err.message}`);
          } else { // Fallback for other unknown error types
            setNftMintingMessage(`Error minting NFT: An unknown error occurred.`);
          }
          setIsMintingNFT(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        HighPower DApp (BNB Chain)
      </h1>

      {/* Wallet connection section */}
      <div className="mb-4">
        {isConnected ? (
          <div className="text-center">
            <p className="text-lg mb-2 text-gray-400">
              Connected as: <span className="font-mono text-purple-300">{address}</span>
            </p>
            {chain && (
              <p className="text-md mb-4 text-gray-500">
                Network: <span className="font-mono text-blue-300">{chain.name} ({chain.id})</span>
              </p>
            )}
            <button
              onClick={() => disconnect()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!connector.ready || isConnecting} // Use isConnecting for 'isLoading'
              >
                {isConnecting && connector.id === pendingConnector?.id // Use isConnecting for 'isLoading'
                  ? 'Connecting...'
                  : `Connect with ${connector.name}`}
              </button>
            ))}
            {error && <p className="text-red-500 mt-2 text-center">{error.message}</p>}
          </div>
        )}
      </div>

      {/* NFT Minting Section */}
      {isConnected && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-400">
            Mint HighPower NFT
          </h2>

          <div className="mb-4">
            <label htmlFor="nftUri" className="block text-gray-400 text-sm font-bold mb-2">
              NFT Metadata URI:
            </label>
            <input
              type="text"
              id="nftUri"
              value={nftTokenURI}
              onChange={(e) => setNftTokenURI(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
              placeholder="e.g., ipfs://QmZ4Y9pMv2oW2f7v8k3f3h3g3d3c3b3a3c3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z"
              disabled={isMintingNFT}
            />
             <p className="text-xs text-gray-500 mt-1">
                This URI should point to a JSON metadata file (like OpenSea's) containing the NFT's image and other properties.
            </p>
          </div>

          <button
            onClick={handleMintNFT}
            disabled={!mintNftConfig?.request || isMintingNFT || isMintingNFTTx}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isMintingNFT || isMintingNFTTx ? 'Minting NFT...' : 'Mint NFT'}
          </button>

          {nftMintingMessage && (
            <p className={`mt-4 text-center text-lg ${nftMintingMessage.startsWith('Error') ? 'text-red-500' : 'text-green-400'}`}>
              {nftMintingMessage}
            </p>
          )}

          {simulateMintNftError && (
            <p className="mt-2 text-sm text-red-400 text-center">
              Preparation error (simulation): {simulateMintNftError.message}
            </p>
          )}
        </div>
      )}

      {/* ERC-20 Token Management Section (Add more features here if needed) */}
      {isConnected && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-400">
            Manage HGP Tokens (ERC-20)
          </h2>
          <p className="text-center text-gray-400">
            Once your SimpleToken.sol contract is deployed on the BNB Chain testnet,
            you can add logic here to interact with it (e.g., transfer, check balance, etc.).
          </p>
        </div>
      )}
    </div>
  );
}
