const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const meditationContractAddress = "0xD507b6b299d9FC835a0Df92f718920D13fA49B47";
const abi = fs.readFileSync("./abis/MeditationCircle.json").toString();
const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);

const startMed = async (id) => {
  try {
    let contract = new ethers.Contract(
      meditationContractAddress,
      abi,
      provider
    );
    contract.connect(wallet).startMeditation(
      id, // heroId
      config.meditationStats.VIT, // primary stat
      config.meditationStats.INT, // secondary stat
      config.meditationStats.WIS, // tertiary stat
      config.meditationCrystals.LesserWIS // attunement crystal address (zero address for no token)
    );

    console.log("Starting Meditation...");
  } catch (err) {
    console.log(`${err.message}`);
  }
};

const finishMed = async (id) => {
  try {
    let contract = new ethers.Contract(
      meditationContractAddress,
      abi,
      provider
    );
    contract.connect(wallet).completeMeditation(1);
    console.log("Finishing Ritual...");
  } catch (err) {
    console.log(`${err.message}`);
  }
};

const startAndFinishMed = (id) => {
  startMed(id);
  setTimeout(() => {
    finishMed(id);
  }, 40000);
};

// start();
// finish();
startAndFinishMed(config.medID);