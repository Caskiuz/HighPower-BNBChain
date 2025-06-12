'use client'; // Directiva para componente de cliente en Next.js

import React, { useState } from 'react';
// Importaciones de hooks de Wagmi v2
import { useAccount, useConnect, useDisconnect, useWriteContract, useSimulateContract, useReadContract } from 'wagmi'; // Añadido useReadContract
// Importación explícita para useNetwork desde 'wagmi/actions' para compatibilidad con el entorno de compilación
import { useNetwork } from 'wagmi/actions';
import { ContractFunctionExecutionError } from 'viem'; // Importa el tipo de error específico de Viem

// Importa los ABIs de tus contratos
import SimpleTokenABI from '../../abis/SimpleToken.sol/SimpleToken.json'; // Importado ABI de SimpleToken
import MyNFTABI from '../../abis/MyNFT.sol/MyNFT.json'; // Ajusta la ruta si es necesario

// !! IMPORTANTE: ¡Estas direcciones son de tu despliegue exitoso! !!
// 'SIMPLE_TOKEN_CONTRACT_ADDRESS' se vuelve a activar y se usa para mostrar el saldo.
const SIMPLE_TOKEN_CONTRACT_ADDRESS = '0xE02F5740F01EDBC5ccAE634312f7C6a90a31053B'; // Tu dirección de SimpleToken desplegado
const MY_NFT_CONTRACT_ADDRESS = '0x4732ecF022235C877f60Ca000eEA7c19440f436F'; // Tu dirección de MyNFT desplegado

// Componente principal de tu aplicación
export default function HomePage() {
  const { address, isConnected } = useAccount(); // Hook para obtener la dirección y el estado de conexión
  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect(); // Hook para conectar billeteras
  const { disconnect } = useDisconnect(); // Hook para desconectar
  const { chain } = useNetwork(); // Hook para obtener información de la cadena actual

  // Estado para acuñar NFT
  const [nftMintingMessage, setNftMintingMessage] = useState('');
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const [nftTokenURI, setNftTokenURI] = useState('ipfs://QmZ4Y9pMv2oW2f7v8k3f3h3g3d3c3b3a3c3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z'); // URI de ejemplo para metadatos de NFT (reemplazar)

  // useSimulateContract reemplaza usePrepareContractWrite en Wagmi v2
  const { data: mintNftConfig, error: simulateMintNftError } = useSimulateContract({
    address: MY_NFT_CONTRACT_ADDRESS as `0x${string}`, // Castea a la dirección correcta de Viem
    abi: MyNFTABI.abi, // ABI del contrato NFT
    functionName: 'mintNFT',
    args: [address, nftTokenURI], // Acuñar NFT a la dirección conectada con la URI especificada
    enabled: isConnected && !!address && !isMintingNFT, // Habilitar si está conectado y no se está acuñando actualmente
  });

  // useWriteContract reemplaza useContractWrite en Wagmi v2
  const { writeContract: mintNFT, isPending: isMintingNFTTx } = useWriteContract();

  const handleMintNFT = async () => {
    // Asegura que mintNftConfig.request exista y llama a writeContract
    if (!mintNftConfig || !mintNftConfig.request || !mintNFT) {
      setNftMintingMessage("Error: No se pudo preparar la función de acuñación de NFT. Asegúrate de estar conectado y de que el contrato NFT esté desplegado.");
      if (simulateMintNftError) {
        console.error("Error al simular la acuñación de NFT:", simulateMintNftError);
      }
      return;
    }
    setIsMintingNFT(true);
    setNftMintingMessage('Acuñando NFT...');
    try {
      // Pasa el objeto de request de la simulación a writeContract
      await mintNFT(mintNftConfig.request);
    } catch (err: unknown) { // Tipo explícito para 'err' como 'unknown' y luego se estrecha
       if (err instanceof ContractFunctionExecutionError) {
            setNftMintingMessage(`Error al acuñar NFT: ${err.shortMessage || err.message}`);
          } else if (err instanceof Error) { // Captura otros tipos de errores estándar
            setNftMintingMessage(`Error al acuñar NFT: ${err.message}`);
          } else { // Fallback para otros tipos de errores desconocidos
            setNftMintingMessage(`Error al acuñar NFT: Ocurrió un error desconocido.`);
          }
          setIsMintingNFT(false);
    }
  };

  // NUEVO: Hook para leer el balance del token HGP
  const { data: hgpBalance, isLoading: isHGPBalanceLoading, refetch: refetchHGPBalance } = useReadContract({
    address: SIMPLE_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
    abi: SimpleTokenABI.abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!address, // Habilitar si está conectado
    watch: true, // Recargar el balance automáticamente si cambia
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        HighPower DApp (BNB Chain)
      </h1>

      {/* Sección de conexión de billetera */}
      <div className="mb-4">
        {isConnected ? (
          <div className="text-center">
            <p className="text-lg mb-2 text-gray-400">
              Conectado como: <span className="font-mono text-purple-300">{address}</span>
            </p>
            {chain && (
              <p className="text-md mb-4 text-gray-500">
                Red: <span className="font-mono text-blue-300">{chain.name} ({chain.id})</span>
              </p>
            )}
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

      {/* Sección de acuñación de NFT */}
      {isConnected && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-400">
            Acuñar NFT HighPower
          </h2>

          <div className="mb-4">
            <label htmlFor="nftUri" className="block text-gray-400 text-sm font-bold mb-2">
              URI de Metadatos del NFT:
            </label>
            <input
              type="text"
              id="nftUri"
              value={nftTokenURI}
              onChange={(e) => setNftTokenURI(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
              placeholder="ej., ipfs://QmZ4Y9pMv2oW2f7v8k3f3h3g3d3c3b3a3c3e3f3g3h3i3j3k3l3m3n3o3p3q3r3s3t3u3v3w3x3y3z"
              disabled={isMintingNFT}
            />
             <p className="text-xs text-gray-500 mt-1">
                Esta URI debe apuntar a un archivo JSON de metadatos (como los de OpenSea) que contenga la imagen del NFT y otras propiedades.
            </p>
          </div>

          <button
            onClick={handleMintNFT}
            disabled={!mintNftConfig?.request || isMintingNFT || isMintingNFTTx}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isMintingNFT || isMintingNFTTx ? 'Acuñando NFT...' : 'Acuñar NFT'}
          </button>

          {nftMintingMessage && (
            <p className={`mt-4 text-center text-lg ${nftMintingMessage.startsWith('Error') ? 'text-red-500' : 'text-green-400'}`}>
              {nftMintingMessage}
            </p>
          )}

          {simulateMintNftError && (
            <p className="mt-2 text-sm text-red-400 text-center">
              Error de preparación (simulación): {simulateMintNftError.message}
            </p>
          )}
        </div>
      )}

      {/* Sección de gestión de tokens BEP-20 (HGP) */}
      {isConnected && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-400">
            Gestionar Tokens HGP (BEP-20)
          </h2>
          {isHGPBalanceLoading ? (
            <p className="text-center text-gray-400">Cargando balance de HGP...</p>
          ) : (
            hgpBalance !== undefined ? (
              <p className="text-center text-lg text-green-400">
                Tu balance de HGP: <span className="font-bold">{Number(hgpBalance) / (10**18)}</span> HGP
              </p>
            ) : (
              <p className="text-center text-red-400">
                No se pudo cargar el balance de HGP. Asegúrate de que el contrato sea correcto.
              </p>
            )
          )}
          {/* Aquí podrías añadir más funciones para el token HGP, como transferencias */}
        </div>
      )}
    </div>
  );
}
