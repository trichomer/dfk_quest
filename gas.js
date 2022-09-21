const { ethers } = require("ethers");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const date = new Date();

const gas = async () => {
    gasPrice = await provider.getGasPrice();
    console.log(`Current gas price: ${gasPrice}`);
    console.log(date);
};
gas();