const { ethers } = require("ethers");
const config = require("./config.json");
const fs = require("fs");
const { syncBuiltinESMExports } = require("module");

const privateKey = fs.readFileSync(".secret").toString().trim();

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

const callOptions = { gasPrice: 1900000000, gasLimit: 3500000 };
const testWallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";

let questContract, provider, heroContract;

let fullStaminaHeroes, heroesOnQuest;

const checkForAndCompleteQuests = async () => {
  try {
    console.log("\n Checking Quests\n");
    let localQuestingHeroes = new Array();
    provider = new ethers.providers.JsonRpcProvider(url);
    questContract = new ethers.Contract(
      DFKQuestCoreV2Address,
      questABI,
      provider
    );
    heroContract = new ethers.Contract(DFKHeroCoreAddress, heroABI, provider);

    let activeQuests = await questContract.getAccountActiveQuests(testWallet);
    console.log(activeQuests.length + " Active Quests");

    activeQuests.forEach((quest) => {
      quest.heroes.forEach((hero) => {
        localQuestingHeroes.push(hero);
      });
    });

    heroesOnQuest = localQuestingHeroes;
    console.log(
      `${heroesOnQuest.length} Heroes On Quest before completing: ${heroesOnQuest}`
    );

    let runningQuests = activeQuests.filter(
      (quest) => quest.completeAtTime >= Math.round(Date.now() / 1000)
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
    sleep(3000);
    console.log(`${runningQuests.length} running quests.`);
    let stillActiveQuests = await questContract.getAccountActiveQuests(
      testWallet
    );
    let stillQuestingHeroes = new Array();
    stillActiveQuests.forEach((quest) => {
      quest.heroes.forEach((hero) => {
        stillQuestingHeroes.push(hero);
      });
    });

    heroesOnQuest = stillQuestingHeroes;
    console.log(
      `${heroesOnQuest.length} Heroes remain on quests : ${heroesOnQuest}`
    );
    updateHeroesWithGoodStamina();
  } catch (err) {
    console.log(err);
  }
};

checkForAndCompleteQuests();

const completeQuest = async (heroId) => {
  try {
    let wallet = new ethers.Wallet(privateKey, provider);
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

const updateHeroesWithGoodStamina = async () => {
  let walletHeroes = await heroContract.getUserHeroes(testWallet);
  console.log(`${walletHeroes.length} Heroes in wallet: ${walletHeroes}`);

  const promises = walletHeroes.map((hero) => {
    return questContract.getCurrentStamina(hero);
  });

  const results = await Promise.all(promises);

  const heroesWithGoodStaminaRaw = results.map((value, index) => {
    const stamina = Number(value);
    if (stamina > 25) {
      return walletHeroes[index];
    }
    return null;
  });

  const heroesWithGoodStamina = heroesWithGoodStaminaRaw.filter((h) => !!h);
  fullStaminaHeroes = heroesWithGoodStamina;
  console.log(
    `${fullStaminaHeroes.length} full stamina heroes: ${fullStaminaHeroes}`
  );

  getQuestsWithFullStamHeroes();
};

const getQuestsWithFullStamHeroes = async () => {
  const quests = config.quests;
  const questsWithOnlyFullStamHeroesRaw = quests.map((quest) => {
    const hardCodedHeroes = quest.professionHeroes;
    const fullStamHeroInts = fullStaminaHeroes.map((hero) => {
      return Number(hero);
    });
    const heroesOnQuestInts = heroesOnQuest.map((hero) => {
      return Number(hero);
    });
    console.log(hardCodedHeroes);
    console.log(fullStaminaHeroes);
    console.log(heroesOnQuest);
    const updatedHeroes = hardCodedHeroes.filter(
      (hero) =>
        fullStamHeroInts.includes(hero) && !heroesOnQuestInts.includes(hero)
    );
    quest.professionHeroes = updatedHeroes;
    return quest;
  });
  console.log(questsWithOnlyFullStamHeroesRaw);
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

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};
