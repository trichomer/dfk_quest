const { ethers } = require("ethers");
// const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const url = "https://avax-dfk.gateway.pokt.network/v1/lb/6244818c00b9f0003ad1b619/ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);

const gas = async () => {
    let gasDate = new Date();
    let curGasPrice = await provider.getGasPrice();
    let numGas = curGasPrice.toNumber();
    let useGasPrice = numGas * 1.1;
    // let bnGasPrice = ethers.BigNumber.from(useGasPrice);
    console.log(`Current gas price: ${curGasPrice}`, gasDate);
    console.log(`Current price (gwei): ${ethers.utils.formatUnits(curGasPrice, "gwei")}`);
    console.log(`toNum(): ${numGas}`);
    console.log(`useGasPrice: ${useGasPrice}\n`);
    // console.log(`BigNumber gasPrice: ${bnGasPrice}`);

    let feeData = await provider.getFeeData();
    console.log(`Gas Price: ${feeData.gasPrice}\nMax Fee per Gas: ${feeData.maxFeePerGas}\nMax Priority Fee per Gas: ${feeData.maxPriorityFeePerGas}`);
    console.log(`Formatted: ${ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei")}`);

};

gas();