    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20; // Especifica la versión del compilador Solidity

    import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // Importa la implementación estándar ERC-20 de OpenZeppelin

    /// @title SimpleToken - Un contrato de token BEP-20 básico para el proyecto HGP.
    /// @author Gemini
    /// @notice Este contrato crea un token BEP-20 con un suministro inicial fijo.
    contract SimpleToken is ERC20 {
        // El constructor se ejecuta solo una vez cuando el contrato es desplegado.
        // Inicializa el token con un nombre, un símbolo y un suministro inicial.
        // _initialSupply es la cantidad total de tokens que se acuñarán inicialmente
        // y se asignarán a la dirección que despliega el contrato (msg.sender).
        constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
            // La función _mint() es interna de ERC20 y crea los tokens.
            // Se acuñan initialSupply tokens y se envían a la dirección que desplegó el contrato.
            _mint(msg.sender, initialSupply);
        }

        // Funciones BEP-20 estándar como 'transfer', 'approve', 'balanceOf', 'totalSupply'
        // ya están disponibles a través de la herencia de ERC20.sol.
        // Puedes añadir funciones personalizadas aquí si tu token necesita una lógica adicional.
    }

    