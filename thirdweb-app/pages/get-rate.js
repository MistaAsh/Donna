import {FusionSDK} from "@1inch/fusion-sdk";
import {Quote} from "@1inch/fusion-sdk/api";


export async function getQuote(sdk, fromTokenAddress, toTokenAddress, amount) {
    const params = {
        fromTokenAddress,
        toTokenAddress, // WETH
        amount, // 70 INCH
    }

    return await sdk.getQuote(params)
}