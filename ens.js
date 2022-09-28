const { ethers } = require("ethers");
const fs = require("fs");
const url = "";
const provider = new ethers.providers.JsonRpcProvider(url);
const parallelAddress = "0x76BE3b62873462d2142405439777e971754E8E77";
const parallelABI = fs.readFileSync("./abis/ParallelNFT.json").toString();
const parallelContract = new ethers.Contract(parallelAddress, parallelABI, provider);


const ensTest = async () => {
    const address = await provider.resolveName("");
    const balance = await provider.getBalance("");
    const lookup = await provider.lookupAddress("");
    const hijackPLBal = await parallelContract.balanceOf(address, 10824);
    const hijackPLURI = await parallelContract.uri(10824);

    console.log(`Balance of ${address} is:`, ethers.utils.formatEther(balance), `ETH`);
    console.log(`Wallet ENS is: ${lookup}`);
    console.log(`Number of Hijack [PL] owned: ${hijackPLBal}`);
    console.log(`Hijack[PL] Token URI: ${hijackPLURI}`);
}

ensTest();