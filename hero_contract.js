const { ethers } = require("ethers");
const fs = require("fs");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const testWallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";
const heroCoreContractAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const abi = fs.readFileSync("./abis/HeroCore.json").toString();
let provider;
let heroCoreContract;

const main = async () => {
    try {
      provider = new ethers.providers.JsonRpcProvider(url);
      heroCoreContract = new ethers.Contract(heroCoreContractAddress, abi, provider);
      let heroBalance = await heroCoreContract.balanceOf(testWallet);
      console.log(heroBalance);
    } catch (err) {
      console.log(`${err.message}`);
    }
  };

  main();