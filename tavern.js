const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const saleAuctionContractAddress = "0xc390fAA4C7f66E4D62E59C231D5beD32Ff77BEf0";
const abi = fs.readFileSync("./abis/SaleAuctionUpgradeable.json").toString();
const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);
const callOptions = { gasPrice: config.gasPrice, gasLimit: config.gasLimit };

const privateBuyTest = async () => {
    try {
        let contract = new ethers.Contract(saleAuctionContractAddress, abi, wallet);
        let getPrice = await contract.getCurrentPrice(275046);
        console.log(`Hero 275046 current price: ${getPrice}`);
        console.log(`Bidding ${getPrice} CRYSTAL...`);
        let bidTest = await contract.bid(275046, getPrice);
    } catch (err) {
      console.log(`${err.message}`);
    }
};

privateBuyTest();