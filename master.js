const { ethers } = require("ethers");
const config = require("./config.json");

const DFKHeroCoreAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const DFKQuestCoreV2Address = "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154";

const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";

const questABI = [
  "function getCurrentStamina(uint256 _heroId) external view returns (uint256)",
  "function getAccountActiveQuests(address _account) external view returns (tuple(uint256 id, address questAddress, uint8 level, uint256[] heroes, address player, uint256 startBlock, uint256 startAtTime, uint256 completeAtTime, uint8 attempts, uint8 status)[])",
  "function completeQuest(uint256 _heroId)",
  "event QuestCompleted(uint256 indexed questId, address indexed player, uint256 indexed heroId, tuple(uint256 id, address questAddress, uint8 level, uint256[] heroes, address player, uint256 startBlock, uint256 startAtTime, uint256 completeAtTime, uint8 attempts, uint8 status) quest)",
  "event QuestXP(uint256 indexed questId, address indexed player, uint256 heroId, uint64 xpEarned)",
  "event QuestSkillUp(uint256 indexed questId, address indexed player, uint256 heroId, uint8 profession, uint16 skillUp)",
  "event QuestReward(uint256 indexed questId, address indexed player, uint256 heroId, address rewardItem, uint256 itemQuantity)",
  "function multiStartQuest(address[] _questAddress, uint256[][] _heroIds, uint8[] _attempts, uint8[] _level) external",
  "function startQuest(uint256[] _heroIds, address _questAddress, uint8 _attempts, uint8 _level)",
  "event TrainingAttemptDone(bool success, uint256 attempt, uint256 indexed heroId)",
  "event TrainingSuccessRatio(uint256 winCount, uint256 attempts, uint256 indexed heroId)",
];

const heroABI = [
  "function getUserHeroes ( address _address ) external view returns ( uint256[] )",
  "function getCurrentStamina(uint256 _heroId) external view returns (uint256)",
];

const callOptions = { gasPrice: config.gasPrice, gasLimit: config.gasLimit };
const testWallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";

let provider = new ethers.providers.JsonRpcProvider(url);

const checkForQuests = async () => {
  try {
    console.log("\n Checking Quests\n");
    let questContract = new ethers.Contract(testWallet, questABI, provider);
    let activeQuests = await questContract.getAccountActiveQuests(testWallet);
    console.log(activeQuests);

    let runningQuests = activeQuests.filter(
      (quest) => quest.completeTime >= Math.round(Date.now() / 1000)
    );

    runningQuests.forEach((quest) => {
      console.log(
        `Quest led by hero ${quest.heroes[0]} will finish in ${Math.round(
          quest.completeAtTime - Date.now() / 1000
        )} seconds.`
      );
    });

    let doneQuests = activeQuests.filter(
      (quest) => !runningQuests.includes(quest)
    );

    for (const quest of doneQuests) {
      await completeQuest(quest.heroes[0]);
    }
  } catch (err) {
    console.log();
  }
};

checkForQuests();

const completeQuest = async (heroId) => {
  try {
    console.log(`Completing quest led by hero ${heroId}.`);
    let receipt = await tryTransaction(
      () => questContract.connect(wallet).completeQuest(heroId, callOptions),
      3
    );

    let xpEvents = receipt.events.filter((e) => e.event === "QuestXP");

    xpEvents.forEach((e) => {
      console.log(`${e.args.xpEarned} XP Earned by Hero ${e.args.heroId}`);
    });

    let suEvents = receipt.events.filter((e) => e.event === "QuestSkillUp");

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
