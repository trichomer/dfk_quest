const { ethers } = require("ethers");
// const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const url = "https://avax-dfk.gateway.pokt.network/v1/lb/6244818c00b9f0003ad1b619/ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);


const gas = async () => {
    let gasDate = new Date();
    curGasPrice = await provider.getGasPrice();
    let dynGasPrice = (curGasPrice + (curGasPrice * 0.1));
    console.log(`Current gas price: ${curGasPrice}`, gasDate, dynGasPrice);
};

gas();