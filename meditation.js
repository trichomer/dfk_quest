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

<<<<<<< HEAD
const eventAbi = [
  "event StatUp( address indexed player, uint256 indexed heroId, uint256 stat, uint8 increase, uint8 updateType);",
];

const start = async () => {
  try {
    let contract = new ethers.Contract(
      meditationContractAddress,
      abi,
      provider
    );
    contract.connect(wallet).startMeditation(
      282744, // heroId
      config.meditationStats.DEX, // primary stat
      config.meditationStats.INT, // secondary stat
      config.meditationStats.LCK, // tertiary stat
      config.meditationCrystals.none // attunement crystal address (zero address for no token)
    );
=======
const startMed = async () => {
    try {
        let contract = new ethers.Contract(meditationContractAddress, abi, provider);
        contract.connect(wallet).startMeditation(
        282744, // heroId
         config.meditationStats.DEX, // primary stat
         config.meditationStats.INT, // secondary stat
         config.meditationStats.LCK, // tertiary stat
         config.meditationCrystals.none // attunement crystal address (zero address for no token)
        );
>>>>>>> 08f686077b53af6a8608728ab6b55b2757413570

    console.log("Starting Meditation...", contract);
  } catch (err) {
    console.log(`${err.message}`);
  }
};

<<<<<<< HEAD
const finish = async () => {
  try {
    let contract = new ethers.Contract(
      meditationContractAddress,
      abi,
      provider
    );
    contract.connect(wallet).completeMeditation(282744);
    console.log("Finishing Ritual...", contract);
  } catch (err) {
    console.log(`${err.message}`);
  }
};

const startAndFinish = () => {
  start();
  setTimeout(() => {
    finish();
  }, 40000);
=======
const finishMed = async () => {
    try {
        let contract = new ethers.Contract(meditationContractAddress, abi, provider);
        contract.connect(wallet).completeMeditation(282744);
        console.log("Finishing Ritual...", contract);
  
      } catch (err) {
        console.log(`${err.message}`);
      }
};

const startAndFinishMed = () => {
    startMed();
    setTimeout(() => {
     finishMed();
    }, 40000);
>>>>>>> 08f686077b53af6a8608728ab6b55b2757413570
};

// start();
// finish();
<<<<<<< HEAD
// startAndFinish();

const getLevelUpStats = async () => {
  let contract = new ethers.Contract(
    meditationContractAddress,
    eventAbi,
    provider
  );

  let levelUpData = contract.filters.StatUp(
    "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483",
    282744
  );

  let data = levelUpData.address;
  let topics = levelUpData.topics;
  console.log(levelUpData);

  let interface = new ethers.utils.Interface(abi);

  // let getEvent = interface.getEvent("StatUp");
  // console.log(getEvent);

  let decodeEvent = interface.decodeEventLog("StatUp", levelUpData);
  console.log(decodeEvent);

  // const fragment = interface.getEvent("StatUp");
  // console.log(fragment.inputs);
  // fragment.inputs.forEach((i) => console.log(`${i.name} : ${i.type}`));
  // const topic = interface.getEventTopic(fragment);
  // console.log(topic);
};
getLevelUpStats();
=======
startAndFinishMed();
>>>>>>> 08f686077b53af6a8608728ab6b55b2757413570
