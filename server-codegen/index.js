const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


const solc = require('solc');
const fs = require('fs');
const path = require('path');
const ethers = require('ethers');
const Web3 = require('web3');
const { ThirdwebSDK, directDeployDeterministic } =  require("@thirdweb-dev/sdk");

app.use(bodyParser.json({ limit: '10mb' }));

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
// const input = {
//     language: 'Solidity',
//     sources: {
//         'MyToken.sol': {
//             content: sourceCode
//         }
//     },
//     settings: {
//         outputSelection: {
//             '*': {
//                 '*': ['*']
//             }
//         }
//     }
// };

// // Compile the contract
// const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
// let contract = {};
// // Handle output (errors and compiled contract)
// if (output.errors) {
//     output.errors.forEach(err => {
//         console.error(err.formattedMessage);
//     });
// } else {
//     contract = output.contracts['MyToken.sol']['MyToken'];
//     console.log('ABI:', contract.abi);
//     console.log('Bytecode:', contract.evm.bytecode.object);
// }


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

    return deployedContractAddress;
}

// Assuming contract compilation was successful
// contract = output.contracts['MyToken.sol']['MyToken'];
// deployContract(contract.abi, contract.evm.bytecode.object)
//     .then(() => console.log('Contract deployed successfully'))
//     .catch(err => console.error('Deployment failed:', err));


// Endpoint to compile and deploy the contract
app.post('/compile', async (req, res) => {
    try {
        const sourceCode = req.body.sourceCode;

        if (!sourceCode) {
            return res.status(400).send('No source code provided');
        }

        // Prepare input for compilation using the provided source code
        const input = {
            language: 'Solidity',
            sources: {
                'Contract.sol': {
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

        if (output.errors) {
            // Handle compilation errors
            let errors = output.errors.map(err => err.formattedMessage).join('\n');
            return res.status(400).send('Compilation errors:\n' + errors);
        }

        // Assuming contract compilation was successful
        const contractName = Object.keys(output.contracts['Contract.sol'])[0];
        const contract = output.contracts['Contract.sol'][contractName];
        
        // Deploy the contract
        // await deployContract(contract.abi, contract.evm.bytecode.object);

        res.send({"abi":contract.abi,"bytecode":contract.evm.bytecode.object.toString()});
    } catch (err) {
        console.error('Deployment failed:', err);
        res.status(500).send('Deployment failed: ' + err.message);
    }
});

app.post('/deploy', async (req, res) => {
    try {
        const abi = req.body.abi;
        var bytecode = req.body.bytecode;

        if (!abi || !bytecode) {
            return res.status(400).send('No ABI or bytecode provided');
        }
        if (typeof bytecode !== 'string') {
            bytecode = bytecode.toString();
        }

        console.log("Bytecode:", bytecode);

        contractAddress = await deployContract(abi, bytecode);

        res.send({"contractAddress":contractAddress});
    } catch (err) {
        console.error('Deployment failed:', err);
        res.status(500).send('Deployment failed: ' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});