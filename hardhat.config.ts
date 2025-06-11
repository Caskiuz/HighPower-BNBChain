import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ethers"; // Asegura los tipos de ethers en hre

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28", // <<-- VERSIÓN DE SOLIDITY ACTUALIZADA AQUÍ
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545", // URL RPC de la testnet de BNB Chain
      chainId: 97, // ID de la cadena para la testnet de BNB Chain
      accounts: ["6945c2e128bbd09bf0c3039bef1f8f35e0d0818c43b665317646d9a863bec166"] // !! Usa una clave privada de una billetera de PRUEBA !!
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  }
};

export default config;
