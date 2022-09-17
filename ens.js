const { ethers } = require("ethers");
const fs = require("fs");
const url = "https://eth-mainnet.g.alchemy.com/v2/Me9TM57oKMh4sMHIiLBSLgOfWG1SCqx0";
const provider = new ethers.providers.JsonRpcProvider(url);
const parallelAddress = "0x76BE3b62873462d2142405439777e971754E8E77";
const parallelABI = fs.readFileSync("./abis/ParallelNFT.json").toString();
const parallelContract = new ethers.Contract(parallelAddress, parallelABI, provider);


const ensTest = async () => {
    const address = await provider.resolveName("onzozo.eth");
    const balance = await provider.getBalance("onzozo.eth");
    const lookup = await provider.lookupAddress("0x7B8ee8e1127de4faa326726c9595FB8c2b29Ec42");
    const hijackPLBal = await parallelContract.balanceOf(address, 10824);
    const hijackPLURI = await parallelContract.uri(10824);

    console.log(`Balance of ${address} is:`, ethers.utils.formatEther(balance), `ETH`);
    console.log(`Wallet ENS is: ${lookup}`);
    console.log(`Number of Hijack [PL] owned: ${hijackPLBal}`);
    console.log(`Hijack[PL] Token URI: ${hijackPLURI}`);
}

ensTest();