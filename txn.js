const { ethers } = require("ethers");
const fs = require("fs");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const rxWalletAddress = "0x9aB773A84E0ACbf2F793B1ec267465293208dfB7";
const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);

const trichomerWallet = "0x9aB773A84E0ACbf2F793B1ec267465293208dfB7";
const signerWallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";
const foragingAddress = "0xAd51199B453075C73FA106aFcAAD59f705EF7872";
const wjewelAddress = "0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260";
const wjewelAbi = fs.readFileSync("./abis/erc20.json").toString();
const questCoreV2Address = "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154";
const questCoreV2Abi = fs.readFileSync("./abis/QuestCoreUpgradeable.json").toString();//ABI using QuestCoreUpgradeable.json
const questCoreV2Contract = new ethers.Contract(
  questCoreV2Address,
  questCoreV2Abi,
  provider
);
const questCoreV2Interface = new ethers.utils.Interface(questCoreV2Abi);

const banger = async () => {
    thisWallet = wallet.address;
    balance = await wallet.getBalance();
    nonce = await wallet.getTransactionCount();
    console.log(
        "\nThis wallet's address: " +
        thisWallet +
        "\nJEWEL Balance: " + 
        balance / 1e18 + 
        "\nNonce: " + 
        nonce);
    tx = {
        to: trichomerWallet,
        value: ethers.utils.parseEther("0.01")
    };
    await wallet.sendTransaction(tx);
    
}

banger();