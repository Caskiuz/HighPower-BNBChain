import hre from "hardhat"; // Importa el Hardhat Runtime Environment
import "@nomicfoundation/hardhat-ethers"; // Importa esto para asegurar los tipos de ethers en hre

async function main() {
  // Accede a ethers a través de hre.ethers
  const ethers = hre.ethers;

  // --- Desplegar SimpleToken (BEP-20) ---
  // Define el suministro inicial para tu token HGP.
  // 1 millón de tokens con 18 decimales (estándar para la mayoría de los tokens BEP-20).
  const initialSupply = ethers.parseUnits("1000000", 18);
  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const simpleToken = await SimpleToken.deploy("HighPower Token", "HGP", initialSupply);
  await simpleToken.waitForDeployment(); // Espera a que la transacción de despliegue se confirme
  console.log(`SimpleToken (HGP) desplegado en: ${await simpleToken.getAddress()}`);

  // --- Desplegar MyNFT (BEP-721) ---
  // Define el nombre y el símbolo de tu colección NFT.
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy("HighPower NFTs", "HPNFT"); // Nombre y Símbolo de tu colección NFT
  await myNFT.waitForDeployment(); // Espera a que la transacción de despliegue se confirme
  console.log(`MyNFT (HPNFT) desplegado en: ${await myNFT.getAddress()}`);
}

// Manejo de errores para el script de despliegue
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
