const { ethers } = require("ethers");
const fs = require("fs");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const testWallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";
const heroCoreContractAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const abi = fs.readFileSync("./abis/HeroCore.json").toString();
const trichomerWallet = "0x9aB773A84E0ACbf2F793B1ec267465293208dfB7";
const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);
const crystalAddress = "0x04b9dA42306B023f3572e106B11D82aAd9D32EBb";
const crystalAbi = fs.readFileSync("./abis/erc20.json").toString();
const crystalContract = new ethers.Contract(
    crystalAddress,
    crystalAbi,
    wallet
);
const heroCoreContract = new ethers.Contract(
    heroCoreContractAddress, 
    abi, 
    provider
);

const main = async () => {
    try {
      let heroBalance = await heroCoreContract.balanceOf(testWallet);
      console.log(`Hero NFT Balance: ${heroBalance}\n`);

      let checkGasFee = await provider.getFeeData();
      console.log(`Current Gas Fees On-chain: 
        maxFeePerGas: ${checkGasFee.maxFeePerGas}
        maxPriorityFeePerGas: ${checkGasFee.maxPriorityFeePerGas}
        gasPrice: ${checkGasFee.gasPrice}`);

      testTxn = await crystalContract.transfer(trichomerWallet, ethers.utils.parseUnits("0.01"));
      let estimateGas = await provider.estimateGas(testTxn);
      console.log(`\nEstimated Gas for ERC20 Token Transfer():  ${estimateGas}`);

    } catch (err) {
      console.log(`${err.message}`);
    }
  };

  main();