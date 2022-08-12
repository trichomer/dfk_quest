const { ethers } = require("ethers");
const fs = require("fs");

const privateKey = fs.readFileSync(".secret").toString().trim();
const config = require("./config.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";

let questContractDFKQCV2 = "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154";
const abi = [
  "function getCurrentStamina(uint256 _heroId) external view returns (uint256)",
  "function getAccountActiveQuests(address _account) external view returns (tuple(uint256 id, address questAddress, uint8 level, uint256[] heroes, address player, uint256 startBlock, uint256 startAtTime, uint256 completeAtTime, uint8 attempts, uint8 status)[])",
  "function completeQuest(uint256 _heroId)",
  "event QuestCompleted(uint256 indexed questId, address indexed player, uint256 indexed heroId, tuple(uint256 id, address questAddress, uint8 level, uint256[] heroes, address player, uint256 startBlock, uint256 startAtTime, uint256 completeAtTime, uint8 attempts, uint8 status) quest)",
  "event QuestXP(uint256 indexed questId, address indexed player, uint256 heroId, uint64 xpEarned)",
  "event QuestSkillUp(uint256 indexed questId, address indexed player, uint256 heroId, uint8 profession, uint16 skillUp)",
  "event QuestReward(uint256 indexed questId, address indexed player, uint256 heroId, address rewardItem, uint256 itemQuantity)",
  "function multiStartQuest(address[] _questAddress, uint256[][] _heroIds, uint8[] _attempts, uint8[] _level) external",
  "function startQuest(uint256[] _heroIds, address _questAddress, uint8 _attempts, uint8 _level)",
];
let provider;
let questContract;
let wallet;

const callOptions = { gasPrice: config.gasPrice, gasLimit: config.gasLimit };
const testWallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";

const main = async () => {
  try {
    provider = new ethers.providers.JsonRpcProvider(url);
    wallet = new ethers.Wallet(privateKey, provider);
    questContract = new ethers.Contract(questContractDFKQCV2, abi, provider);

    checkForQuests();
  } catch (err) {
    console.log(`${err.message}`);
  }
};

const checkForQuests = async () => {
  try {
    console.log("\nChecking for quests...\n");
    let activeQuests = await questContract.getAccountActiveQuests(testWallet);
    // console.log(activeQuests);
    // console.log(`Active Quests: ${activeQuests}`);
    // console.log(`Complete at Time : ${activeQuests[0][7]}`);
    // console.log(`Current Time: ${Math.round(Date.now() / 1000)} `);

    let runningQuests = activeQuests.filter((quest) => {
      return quest.completeAtTime >= Math.round(Date.now() / 1000);
    });

    runningQuests.forEach((quest) => {
      console.log(
        `Quest led by hero ${
          quest.heroes[0]
        } is due to complete in ${Math.round(
          quest.completeAtTime - Date.now() / 1000
        )} seconds.`
      );
    });

    let doneQuests = activeQuests.filter(
      (quest) => !runningQuests.includes(quest)
    );

    console.log(doneQuests.length + " done quests.");

    for (quest of doneQuests) {
      await completeQuest(quest.heroes[0]);
    }

    // let questsToStart = await getQuestsToStart(activeQuests);
    // for (const quest of questsToStart) {
    //   await startQuest(quest);
    // }
    checkHeroesStamina();
  } catch (err) {
    console.log("Check For Quests error: " + err.message);
  }
};

const completeQuest = async (heroId) => {
  try {
    console.log(`Completing quest led by hero ${heroId}.`);
    let receipt = await tryTransaction(
      () => questContract.connect(wallet).completeQuest(heroId, callOptions),
      3
    );

    // testing estimateGas() for completeQuest()
    let estimateGas = await provider.estimateGas(receipt);
    console.log(`Estimated Gas for completeQuest():  ${estimateGas}`);

    console.log(`\n **** Completed quest led by hero ${heroId}. ****`);

    let xpEvents = receipt.events.filter((e) => e.event === "QuestXP");
    // console.log(
    //   `XP: ${xpEvents.reduce(
    //     (total, result) => total + Number(result.args.xpEarned),
    //     0
    //   )}`
    // );
    xpEvents.forEach((e) => {
      console.log(`${e.args.xpEarned} XP Earned by Hero ${e.args.heroId}`);
      //   console.log(e);
    });

    let suEvents = receipt.events.filter((e) => e.event === "QuestSkillUp");
    // console.log(
    //   `SkillUp: ${
    //     suEvents.reduce(
    //       (total, result) => total + Number(result.args.skillUp),
    //       0
    //     ) / 10
    //   }`
    // );
    suEvents.forEach((e) => {
      console.log(`${e.args.skillUp} Skill Up Earned by Hero ${e.args.heroId}`);
    });

    console.log("\n*****\n");
  } catch (err) {
    console.log("Complete Quest error: " + err.message);
  }
};

const tryTransaction = async (transaction, attempts) => {
  for (let i = 0; i < attempts; i++) {
    try {
      var tx = await transaction();
      let receipt = await tx.wait();
      if (receipt.status === undefined) {
        console.log(tx);
      }
      if (receipt.status !== 1)
        throw new Error(`Receipt had a status of ${receipt.status}`);
      return receipt;
    } catch (err) {
      if (i === attempts - 1) throw err;
    }
  }
};

// async function getQuestsToStart(activeQuests) {
//   var questsToStart = new Array();
//   var questingHeroes = new Array();

//   activeQuests.forEach((q) =>
//     q.heroes.forEach((h) => questingHeroes.push(Number(h)))
//   );

//   for (const quest of config.quests) {
//     if (quest.professionHeroes.length > 0) {
//       //   var readyHeroes = await getHeroesWithGoodStamina(  assuming all heroes have good stamina
//       //     questingHeroes,
//       //     quest,
//       //     config.professionMaxAttempts,
//       //     true
//       //   );
//       questsToStart.push({
//         name: quest.name,
//         address: quest.contractAddress,
//         professional: true,
//         heroes: quest.professionHeroes, // assuming all have good stamina
//         attempts: config.professionMaxAttempts,
//       });
//     }

//     // if (quest.nonProfessionHeroes.length > 0) {   // currently all heroes are professional
//     //   var readyHeroes = await getHeroesWithGoodStamina(
//     //     questingHeroes,
//     //     quest,
//     //     config.nonProfessionMaxAttempts,
//     //     false
//     //   );
//     //   questsToStart.push({
//     //     name: quest.name,
//     //     address: quest.contractAddress,
//     //     professional: false,
//     //     heroes: readyHeroes,
//     //     attempts: config.nonProfessionMaxAttempts,
//     //   });
//     // }
//   }

//   return questsToStart;
// }

// async function startQuest(quest) {
//   try {
//     let batch = 0;
//     while (true) {
//       var groupStart = batch * config.maxQuestGroupSize;
//       let questingGroup = quest.heroes.slice(
//         groupStart,
//         groupStart + config.maxQuestGroupSize
//       );
//       if (questingGroup.length === 0) break;

//       await startQuestBatch(quest, questingGroup);
//       batch++;
//     }
//   } catch (err) {
//     console.warn(
//       `Error determining questing group - this will be retried next polling interval`
//     );
//   }
// }

const sendFishers = () => {
  try {
    provider = new ethers.providers.JsonRpcProvider(url);
    wallet = new ethers.Wallet(privateKey, provider);
    let contract = new ethers.Contract(questContractDFKQCV2, abi, provider);
    let fishingQuest = config.quests[0];
    contract
      .connect(wallet)
      .startQuest(
        fishingQuest.professionHeroes,
        fishingQuest.contractAddress,
        fishingQuest.professionMaxAttempts,
        fishingQuest.level,
        callOptions
      );
  } catch (err) {
    console.log(err);
  }
};

const sendForagers = () => {
  try {
    provider = new ethers.providers.JsonRpcProvider(url);
    wallet = new ethers.Wallet(privateKey, provider);
    let contract = new ethers.Contract(questContractDFKQCV2, abi, provider);
    let foragingQuest = config.quests[1];
    contract
      .connect(wallet)
      .startQuest(
        foragingQuest.professionHeroes,
        foragingQuest.contractAddress,
        foragingQuest.professionMaxAttempts,
        foragingQuest.level,
        callOptions
      );
  } catch (err) {
    console.log(err);
  }
};

const sendAllHeroes = () => {
  sendFishers();
  setTimeout(() => {
    sendForagers();
  }, 7000);
  setTimeout(() => {
    main();
  }, 15000);
};

const checkHeroeStamina = async (heroId) => {
  let staminaProvider = new ethers.providers.JsonRpcProvider(url);
  let QCV2contract = new ethers.Contract(
    questContractDFKQCV2,
    abi,
    staminaProvider
  );
  let currnetStamina = await QCV2contract.functions.getCurrentStamina(heroId);
  return currnetStamina;
};

const checkHeroesStamina = async () => {
  config.quests.forEach((q) => {
    q.professionHeroes.forEach(async (h) => {
      let heroStamina = await checkHeroeStamina(h);
      console.log(`${q.name} Hero ${h} stamina: ${heroStamina}`);
    });
  });
};

main();
// sendFishers();
// sendForagers();
// checkHeroesStamina();
// sendAllHeroes();

// const test = () => {
//   let currentTime = Date.now() / 1000;
//   let futureTime;
//   setTimeout(() => {
//     futureTime = Date.now() / 1000;
//     console.log(futureTime - currentTime);
//   }, 10000);
// };

// test();
