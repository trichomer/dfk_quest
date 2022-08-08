const { ethers } = require("ethers");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";

let questContractDFKQCV2 = "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154";
const abi = [
  "function getCurrentStamina(uint256 _heroId) external view returns (uint256)",
  "function getAccountActiveQuests(address _account) external view returns (tuple(uint256 id, address questAddress, uint8 level, uint256[] heroes, address player, uint256 startBlock, uint256 startAtTime, uint256 completeAtTime, uint8 attempts, uint8 status)[])",
  "function completeQuest(uint256 _heroId) external",
  "event QuestCompleted(uint256 indexed questId, address indexed player, uint256 indexed heroId, tuple(uint256 id, address questAddress, uint8 level, uint256[] heroes, address player, uint256 startBlock, uint256 startAtTime, uint256 completeAtTime, uint8 attempts, uint8 status) quest)",
  "event QuestXP(uint256 indexed questId, address indexed player, uint256 heroId, uint64 xpEarned)",
  "event QuestSkillUp(uint256 indexed questId, address indexed player, uint256 heroId, uint8 profession, uint16 skillUp)",
  "event QuestReward(uint256 indexed questId, address indexed player, uint256 heroId, address rewardItem, uint256 itemQuantity)",
  "function multiStartQuest(address[] _questAddress, uint256[][] _heroIds, uint8[] _attempts, uint8[] _level) external",
];

let questContract, provider, wallet;

const main = async () => {
  try {
    provider = new ethers.providers.JsonRpcProvider(url);
    questContract = new ethers.Contract(questContractDFKQCV2, abi, provider);
    wallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";
    checkForQuests();
  } catch (err) {
    console.log(`${err.message}`);
  }
};

const checkForQuests = async () => {
  try {
    console.log("\nChecking for quests...\n");
    let activeQuests = await questContract.getAccountActiveQuests(wallet);
    console.log(`Active Quests: ${activeQuests}`);
    console.log(`Complete at Time : ${activeQuests[0][7]}`);
    console.log(`Current Time: ${Math.round(Date.now() / 1000)} `);

    let runningQuests = activeQuests.filter((quest) => {
      console.log(quest);
      return quest.completeAtTime <= Math.round(Date.now() / 1000);
    });

    console.log(runningQuests.length);
    runningQuests.forEach((quest) => {
      console.log(
        `Quest led by hero ${quest.heroes[0]} is due to complete at ${quest.completeAtTime}.`
      );

      let doneQuests = activeQuests.filter(
        (quest) => !runningQuests.includes(quest)
      );

      for (quest of doneQuests) {
        console.log(`Hero ${quest.heroe[0]} is done questing.`);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

main();
