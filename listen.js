const { ethers } = require("ethers");
const fs = require("fs");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const erc20Abi = fs.readFileSync("./abis/erc20.json").toString();
const saleAbi = fs.readFileSync("./abis/HeroAuctionUpgradeable.json").toString();
const crystalAddress = "0x04b9dA42306B023f3572e106B11D82aAd9D32EBb";
const saleAddress = "0xc390fAA4C7f66E4D62E59C231D5beD32Ff77BEf0";
const provider = new ethers.providers.JsonRpcProvider(url);
// let crystalContract = new ethers.Contract(
//     crystalAddress,
//     erc20Abi,
//     provider
// );
let saleContract = new ethers.Contract(
    saleAddress,
    saleAbi,
    provider
);


// crystalContract.on("Transfer", (from, to, amount, event) => {
//     console.log(`${ from } sent ${ ethers.utils.formatEther(amount) } to ${ to}`);
// });

// address = "0x7B8ee8e1127de4faa326726c9595FB8c2b29Ec42";
// filter = crystalContract.filters.Transfer(null, address)
// crystalContract.on(filter, (from, to, amount, event) => {
//     console.log(`Received ${ ethers.utils.formatEther(amount) } from ${ from }`);
// });

// event AuctionCreated(
    // uint256 auctionId, 
    // address indexed owner, 
    // uint256 indexed tokenId, 
    // uint256 startingPrice, 
    // uint256 endingPrice, 
    // uint256 duration, 
    // address winner);

saleContract.on("AuctionCreated", (auctionId, owner, tokenId, startingPrice, endingPrice, duration, winner) => {
    console.log(`Hero ${ tokenId } posted by ${owner} for ${ethers.utils.formatUnits(startingPrice, 18)} CRYSTAL`);
});