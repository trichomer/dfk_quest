const { ethers } = require("ethers");
const config = require("./config.json");
const dfkProvider = new ethers.providers.JsonRpcProvider(config.dfkRPC);
const hmyProvider = new ethers.providers.JsonRpcProvider(config.hmyRPC);

const gas = async () => {
    let gasDate = new Date();
    let curGasPrice = await dfkProvider.getGasPrice();
    let numGas = curGasPrice.toNumber();
    let useGasPrice = numGas * 1.1;
    // let bnGasPrice = ethers.BigNumber.from(useGasPrice);
    console.log(`Current gas price: ${curGasPrice}`, gasDate);
    console.log(`Current price (gwei): ${ethers.utils.formatUnits(curGasPrice, "gwei")}`);
    console.log(`toNum(): ${numGas}`);
    console.log(`useGasPrice: ${useGasPrice}\n`);
    // console.log(`BigNumber gasPrice: ${bnGasPrice}`);

    let feeData = await dfkProvider.getFeeData();
    console.log(`Gas Price: ${ethers.utils.formatUnits(feeData.gasPrice, "gwei")}
    Max Fee per Gas: ${ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei")}
    Max Priority Fee per Gas: ${ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei")}`);

};

gas();