const { ethers } = require("ethers");
const config = require("./config.json");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString().trim();
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const erc20Abi = fs.readFileSync("./abis/erc20.json").toString();
const crystalAddress = "0x04b9dA42306B023f3572e106B11D82aAd9D32EBb";
const shvasAddress = "0x75E8D8676d774C9429FbB148b30E304b5542aC3d";
const meditationAddress = "0xD507b6b299d9FC835a0Df92f718920D13fA49B47";

const checkAllowances = async () => {
    let provider = new ethers.providers.JsonRpcProvider(url);
    let crystalContract = new ethers.Contract(
     crystalAddress,
     erc20Abi,
     provider
    );
    let crystalSymbol = await crystalContract.symbol();
    let crystalMedAllowance = await crystalContract.allowance(config.testWallet, meditationAddress);
    console.log(`${crystalSymbol} allowance for Meditation Contract: \n ${crystalMedAllowance}`);

    let shvasContract = new ethers.Contract(
        shvasAddress,
        erc20Abi,
        provider
    );
    let shvasSymbol = await shvasContract.symbol();
    let shvasMedAllowance = await shvasContract.allowance(config.testWallet, meditationAddress);
    console.log(`${shvasSymbol} allowance for Meditation Contract: \n ${shvasMedAllowance}`);
};

checkAllowances();