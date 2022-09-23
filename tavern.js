const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const saleAuctionContractAddress = "0xc390fAA4C7f66E4D62E59C231D5beD32Ff77BEf0";
const abi = fs.readFileSync("./abis/SaleAuctionUpgradeable.json").toString();
const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);

const tryTransaction = async (transaction, attempts) => {
    for (let i = 0; i < attempts; i++) {
      try {
        var tx = await transaction();
        let receipt = await tx.wait();
        if (receipt.status === undefined) {
          console.log(tx);
        }
        if (receipt.status !== 1)
          throw new Error(`Receipt had a status of ${receipt.status}`);
        return receipt;
      } catch (err) {
        if (i === attempts - 1) throw err;
      }
    }
  };

const privateBuyTest = async () => {
    try {
        let contract = new ethers.Contract(saleAuctionContractAddress, abi, wallet);
        let getPrice = await contract.getCurrentPrice(1);
        console.log(`Hero 1 current price: ${getPrice}`);
        console.log(`Bidding ${getPrice} CRYSTAL...`);
        let bidTest = await contract.bid(1, getPrice);
        let successEvent = bidTest.events.filter(AuctionSuccessful);
        console.log(`AuctionSuccessful Event: ${successEvent}`);
    } catch (err) {
      console.log(`${err.message}`);
    }
};

privateBuyTest();