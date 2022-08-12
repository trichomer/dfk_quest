const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const meditationContractAddress = "0xD507b6b299d9FC835a0Df92f718920D13fA49B47";
const abi = fs.readFileSync("./abis/MeditationCircle.json").toString();
const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);
const callOptions = { gasPrice: config.gasPrice, gasLimit: config.gasLimit };

const start = async () => {
    try {
        let contract = new ethers.Contract(meditationContractAddress, abi, provider);
        contract.connect(wallet).startMeditation(
         281958, 
         config.meditationStats.WIS, 
         config.meditationStats.INT, 
         config.meditationStats.LCK, 
         "0x0000000000000000000000000000000000000000"
        );

        console.log(`Starting Meditation... ${contract}\n ...`);

    } catch (err) {
      console.log(`${err.message}`);
    }
};

const finish = async () => {
    try {
        let contract = new ethers.Contract(meditationContractAddress, abi, provider);
        contract.connect(wallet).completeMeditation(281958);
        console.log(`Finishing Ritual... ${contract}\n ...`);
  
      } catch (err) {
        console.log(`${err.message}`);
      }
};

const startAndFinish = () => {
    start();
    setTimeout(() => {
     finish();
    }, 40000);
};

// start();
// finish();
startAndFinish();