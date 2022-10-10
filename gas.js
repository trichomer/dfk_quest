const { ethers, BigNumber } = require("ethers");
const config = require("./config.json");
const dfkProvider = new ethers.providers.JsonRpcProvider(config.dfkRPC);
const hmyProvider = new ethers.providers.JsonRpcProvider(config.hmyRPC);
const { Big } = require ("big.js");

const gas = async () => {
    let gasDate = new Date();
    let curGasPrice = await dfkProvider.getGasPrice();
    let numGas = curGasPrice.toNumber();
    let useGasPrice = numGas * 1.1;
    let gasPlusHalfGwei = Big(curGasPrice).add(500000000);
    // let bnGasPrice = ethers.BigNumber.from(useGasPrice);
    console.log(`Current gas price: ${curGasPrice}`, gasDate);
    console.log(`Current price (gwei): ${ethers.utils.formatUnits(curGasPrice, "gwei")}`);
    console.log(`gas + 0.5 gwei: ${gasPlusHalfGwei}`);
    // console.log(`gas + 0.5 gwei (gwei): ${ethers.utils.formatUnits(gasPlusHalfGwei, "gwei")}`);
    console.log(`toNum(): ${numGas}`);
    console.log(`useGasPrice: ${useGasPrice}\n`);
    // console.log(`BigNumber gasPrice: ${bnGasPrice}`);

    let feeData = await dfkProvider.getFeeData();
    console.log(`Provider recommended fee data:`);
    console.log(`
    Gas Price: ${ethers.utils.formatUnits(feeData.gasPrice, "gwei")}
    Max Fee per Gas: ${ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei")}
    Max Priority Fee per Gas: ${ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei")}`);

    curBlock = await dfkProvider.getBlock();
    console.log(`Block: ${curBlock.number}`);
    lastBlock = await dfkProvider.getBlock(-1);
    console.log(`Last Block: ${lastBlock.number}\n${lastBlock.transactions[0]}`);
    getBlockWithTxn = await dfkProvider.getBlockWithTransactions(-1);
    console.log(`Block: ${getBlockWithTxn.number} GasPrice: ${getBlockWithTxn.transactions[0].gasPrice}`);
};

gas();