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
// const meditationContract = new ethers.Contract(
//     meditationContractAddress,
//     meditationAbi,
//     wallet
// );

// heroId = 229837

const start = async () => {
    try {
        // let startMed = await meditationContract.startMeditation(
        //     229837,
        //     6,
        //     4,
        //     8,
        //     null,
        //     callOptions
        // );

        let contract = new ethers.Contract(meditationContractAddress, abi, provider);
        contract.connect(wallet).startMeditation(229837, 3, 2, 6, "0x0000000000000000000000000000000000000000", callOptions);

        console.log(`Starting Meditation... ${contract}\n ...`);

    } catch (err) {
      console.log(`${err.message}`);
    }
};

const finish = async () => {
    try {
        let contract = new ethers.Contract(meditationContractAddress, abi, provider);
        contract.connect(wallet).completeMeditation(229837);
        console.log(`Finishing Ritual... ${contract}\n ...`);
  
      } catch (err) {
        console.log(`${err.message}`);
      }
};

// start();
finish();