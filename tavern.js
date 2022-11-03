const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const url = "https://api.harmony.one";
const provider = new ethers.providers.JsonRpcProvider(url);
const saleAuctionContractAddress = "0x13a65B9F8039E2c032Bc022171Dc05B30c3f2892";
const abi = fs.readFileSync("./abis/SaleAuctionUpgradeable.json").toString();
const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);


const privateBuyTest = async (id) => {
    try {
        let contract = new ethers.Contract(saleAuctionContractAddress, abi, wallet);
        let getPrice = await contract.getCurrentPrice(id);
        console.log(`Hero ${id} current price: ${ethers.utils.formatEther(getPrice)} JEWEL`);
        console.log(`Bidding ${ethers.utils.formatEther(getPrice)} JEWEL...`);
        let bidTest = await contract.bid(id, getPrice);
        let successEvent = bidTest.events.filter(AuctionSuccessful);
        console.log(`AuctionSuccessful Event: ${successEvent}`);
    } catch (err) {
      console.log(`${err.message}`);
    }
};
privateBuyTest();