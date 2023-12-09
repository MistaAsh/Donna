require('dotenv').config();
const express = require('express');
const app = express();
const port = 3001;
const {NetworkEnum} =  require("@1inch/fusion-sdk");
const {PresetEnum} =  require("@1inch/fusion-sdk/api");

// Import your existing functions and configurations
const { FusionSDK, PrivateKeyProviderConnector } = require("@1inch/fusion-sdk");
const Web3 = require("web3");
const {Quote} =  require("@1inch/fusion-sdk/api");
const maticNetworkRPC = 'https://rpc-mainnet.maticvigil.com';
pk='7fb70f345bcc41dbfa5887bfe5e515c2bcfbf901464c2b8b744c2a50b75a22cf';   

async function getQuote(sdk, fromTokenAddress, toTokenAddress, amount){
    const params = {
        fromTokenAddress,
        toTokenAddress, // WETH
        amount, // 70 INCH
    }

    return await sdk.getQuote(params)
}

async function getQuoteWrapper(fromTokenAddress, toTokenAddress, amount, walletAddress) {
    // Initialize Web3 and FusionSDK with your existing setup
    const web3 = new Web3(new Web3.providers.HttpProvider(maticNetworkRPC));
    const blockchainProvider = new PrivateKeyProviderConnector(pk, web3);
    const sdk = new FusionSDK({
        url: "https://api.1inch.dev/fusion",
        network: NetworkEnum.POLYGON,
        blockchainProvider,
        authKey: 'Bloa3LbSjUJzNGi4amk9yzzfrEFZslxg' // Replace with actual auth key
    });

    // Call getQuote with the provided parameters
    return getQuote(sdk, fromTokenAddress, toTokenAddress, amount, walletAddress);
}

async function createOrder(sdk, from, to, amount, walletAddress, preset) {
    try {
        return await sdk.placeOrder({
            fromTokenAddress: from,
            toTokenAddress: to,
            amount: amount,
            walletAddress: walletAddress,
            preset: 'slow',       
        })
    } catch (e) {
        console.log(e)
        return undefined;
    }

}
// Define the endpoint
app.get('/quote', async (req, res) => {
    try {
        const { fromTokenAddress, toTokenAddress, amount, walletAddress } = req.query;
        const quote = await getQuoteWrapper(fromTokenAddress, toTokenAddress, amount, walletAddress);
        res.json(quote);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


app.get('/create-order', async (req, res) => {
    try {
        const { from, to, amount, walletAddress, preset } = req.query;

        // Ensure all required parameters are provided
        if (!from || !to || !amount || !walletAddress || !preset) {
            return res.status(400).send('Missing required parameters');
        }

        // Initialize Web3 and FusionSDK
        const web3 = new Web3(new Web3.providers.HttpProvider(maticNetworkRPC));
        const blockchainProvider = new PrivateKeyProviderConnector(pk, web3);
        const sdk = new FusionSDK({
            url: "https://api.1inch.dev/fusion",
            network: NetworkEnum.POLYGON,
            blockchainProvider,
            authKey: 'ZI7mFBr0tSKeGpyLdqV5RdJMntRjYDRJ' // Replace with actual auth key
        });

        // Call the createOrder function
        const orderInfo = await createOrder(sdk, from, to, amount, walletAddress, preset);

        if (orderInfo) {
            res.json(orderInfo);
        } else {
            res.status(500).send('Failed to create order');
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
