const solc = require('solc');
const fs = require('fs');
const path = require('path');
const ethers = require('ethers');
const Web3 = require('web3');
const { ThirdwebSDK, directDeployDeterministic } =  require("@thirdweb-dev/sdk");

// Function to find and read OpenZeppelin contracts
const findImports = (importPath) => {
    try {
        // This assumes that the OpenZeppelin contracts are installed in node_modules
        const content = fs.readFileSync(path.join(__dirname, 'node_modules', importPath), 'utf8');
        return { contents: content };
    } catch (err) {
        return { error: 'File not found' };
    }
};

// Your Solidity source code with OpenZeppelin imports
const sourceCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** uint(decimals()));
    }
}
`;

// Prepare input for compilation
const input = {
    language: 'Solidity',
    sources: {
        'MyToken.sol': {
            content: sourceCode
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
let contract = {};
// Handle output (errors and compiled contract)
if (output.errors) {
    output.errors.forEach(err => {
        console.error(err.formattedMessage);
    });
} else {
    contract = output.contracts['MyToken.sol']['MyToken'];
    console.log('ABI:', contract.abi);
    console.log('Bytecode:', contract.evm.bytecode.object);
}


// const privateKey = "7fb70f345bcc41dbfa5887bfe5e515c2bcfbf901464c2b8b744c2a50b75a22cf";
// const signer = new ethers.Wallet(privateKey);


const sdk = ThirdwebSDK.fromPrivateKey(`7fb70f345bcc41dbfa5887bfe5e515c2bcfbf901464c2b8b744c2a50b75a22cf`, "goerli", {
    clientId: "887a8d5f58c954d65c38cbef774cd1a0", // Use client id if using on the client side, get it from dashboard settings
  });


async function deployContract(abi, bytecode) {
    // Connect to Ethereum - replace with your Ethereum node URL
    const web3 = new Web3(new Web3.providers.HttpProvider(`https://rpc.ankr.com/eth_goerli`,));

    // Replace with your account details
    const account = '0x39BeC0c9001C72EeaA82BcD66773fB5eb62d39D7';
    const privateKey = '7fb70f345bcc41dbfa5887bfe5e515c2bcfbf901464c2b8b744c2a50b75a22cf';

    const signer = await sdk.getSigner();
    // const MyContract = new web3.eth.Contract(abi);

    // const deploy = MyContract.deploy({
    //     data: '0x' + bytecode,
    //     arguments: [] // Any constructor arguments go here
    // });

    // const gas = 2000000;
    // const gasPrice = await web3.eth.getGasPrice();

    // const signedTransaction = await web3.eth.accounts.signTransaction({
    //     from: account,
    //     data: deploy.encodeABI(),
    //     gas,
    //     gasPrice
    // }, privateKey);

    // const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    const deployedContractAddress = await directDeployDeterministic(
        bytecode,
        abi,
        signer,
        [],
        "",
      );
    console.log('Contract deployed at address:', deployedContractAddress);
}

// Assuming contract compilation was successful
contract = output.contracts['MyToken.sol']['MyToken'];
deployContract(contract.abi, contract.evm.bytecode.object)
    .then(() => console.log('Contract deployed successfully'))
    .catch(err => console.error('Deployment failed:', err));