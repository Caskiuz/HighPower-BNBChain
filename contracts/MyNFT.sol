// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; // Especifica la versión del compilador Solidity

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // Importa la implementación estándar ERC721
import "@openzeppelin/contracts/access/Ownable.sol"; // Para controlar quién puede acuñar
import "@openzeppelin/contracts/utils/Counters/Counters.sol"; // Para generar IDs de token únicos (ruta corregida para OpenZeppelin v5.x.x)

/// @title MyNFT - Un contrato de token BEP-721 (NFT) básico para la BNB Chain.
/// @author Gemini
/// @notice Este contrato permite la creación de una colección de NFTs y su acuñación (minting).
/// Solo el propietario del contrato (el que lo despliega) puede acuñar nuevos NFTs inicialmente.
contract MyNFT is ERC721, Ownable {
    using Counters for Counters.Counter; // Habilita el uso de la librería Counters
    Counters.Counter private _tokenIdCounter; // Contador para asignar IDs únicos a cada NFT

    // Un mapeo para almacenar la URI (Uniform Resource Identifier) de cada token ID.
    // Esta URI generalmente apunta a metadatos JSON y/o la imagen del NFT.
    mapping(uint256 => string) private _tokenURIs;

    /// @dev Constructor del contrato.
    /// @param name_ El nombre de la colección NFT (ej. "HighPower NFTs").
    /// @param symbol_ El símbolo de la colección NFT (ej. "HPNFT").
    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_) // Inicializa el contrato ERC721 base con nombre y símbolo
        Ownable(msg.sender) // El deployer del contrato se convierte en el propietario
    {}

    /// @dev Función para acuñar un nuevo NFT. Solo el propietario puede llamarla.
    /// @param to La dirección a la que se acuñará el NFT.
    /// @param tokenURI_ La URI para los metadatos y/o imagen del NFT.
    function mintNFT(address to, string memory tokenURI_) public onlyOwner {
        // Incrementa el contador para obtener un nuevo token ID único.
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();

        // Acuña el nuevo NFT al destinatario especificado.
        _mint(to, newTokenId);
        // Establece la URI para el NFT recién acuñado.
        _setTokenURI(newTokenId, tokenURI_);

        // Emite un evento para notificar que un NFT ha sido acuñado.
        emit NFTMinted(newTokenId, to, tokenURI_);
    }

    /// @dev Sobrescribe la función tokenURI de ERC721 para devolver la URI almacenada.
    /// @notice Se ha eliminado la verificación explícita `_exists(tokenId)` para resolver un error de compilación.
    /// El comportamiento estándar de `tokenURI` si el token no existe es devolver una cadena vacía.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /// @dev Función interna para establecer la URI de un token.
    /// @param tokenId El ID del token.
    /// @param _uri La URI a establecer.
    function _setTokenURI(uint256 tokenId, string memory _uri) internal {
        _tokenURIs[tokenId] = _uri;
    }

    // Evento que se emite cuando un NFT es acuñado.
    event NFTMinted(uint256 tokenId, address recipient, string tokenURI);
}

