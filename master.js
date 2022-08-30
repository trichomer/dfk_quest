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

const MINIMUM_STAMINA = 5;
const MAX_QUEST_GROUP_SIZE = 6;

// let provider = new ethers.providers.JsonRpcProvider(url);
// let heroContract = new ethers.Contract(DFKHeroCoreAddress, heroABI, provider);
// let questContract = new ethers.Contract(
//   DFKQuestCoreV2Address,
//   questABI,
//   provider
// );
// let provider, heroContract, questContract;

let fullStaminaHeroes, heroesOnQuest;

// let sendHeoroesQuestAttempts = 0;
// let sendQuestNonce = 1;
// let receiptState = null;

const getConfigHeroes = () => {
  const configHeroes = new Array();
  config.quests.forEach((q) => {
    if (q.professionHeroes.length > 0) {
      q.professionHeroes.forEach((h) => configHeroes.push(h));
    }
  });

  return configHeroes;
};

const configHeroes = getConfigHeroes();

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

const checkForAndCompleteQuests = async () => {
  try {
    console.log("\n Checking Quests\n");
    sleep(10000);
    let localQuestingHeroes = new Array();
    let provider = new ethers.providers.JsonRpcProvider(url);
    let questContract = new ethers.Contract(
      DFKQuestCoreV2Address,
      questABI,
      provider
    );

    let getCode = await provider.getCode(testWallet);
    console.log(getCode);

    let activeQuests = await questContract.getAccountActiveQuests(testWallet);
    console.log(activeQuests.length + " Active Quests");

    activeQuests.forEach((quest) => {
      quest.heroes.forEach((hero) => {
        localQuestingHeroes.push(hero);
      });
    });
    heroesOnQuest = [...localQuestingHeroes];
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
    console.log(`${runningQuests.length} running quests.`);

    // const updatedQuestCheckContract = new ethers.Contract(
    //   DFKQuestCoreV2Address,
    //   questABI,
    //   provider
    // );
    let stillActiveQuests = await questContract.getAccountActiveQuests(
      testWallet
    );
    let stillQuestingHeroes = new Array();
    stillActiveQuests.forEach((quest) => {
      quest.heroes.forEach((hero) => {
        stillQuestingHeroes.push(hero);
      });
    });

    sleep(3000);

    heroesOnQuest = [...stillQuestingHeroes];
    console.log(
      `${heroesOnQuest.length} Heroes remain on quests : ${heroesOnQuest}`
    );
    updateHeroesWithGoodStamina();
  } catch (err) {
    console.log(err);
  }
};

const completeQuest = async (heroId) => {
  try {
    let provider = new ethers.providers.JsonRpcProvider(url);
    let wallet = new ethers.Wallet(privateKey, provider);
    console.log(`Completing quest led by hero ${heroId}.`);
    let questContract = new ethers.Contract(
      DFKQuestCoreV2Address,
      questABI,
      provider
    );
    // let receipt = await tryTransaction(
    //   () => questContract.connect(wallet).completeQuest(heroId, callOptions),
    //   1
    // );
    let receipt = await tryTransaction(
      () => questContract.connect(wallet).completeQuest(heroId, callOptions),
      3
    );

    // let getCode = await provider.getCode(receipt.contractAddress);
    // console.log(getCode);

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
  console.log(`Updating Heroes with good stamina (*.*)/`);
  let provider = new ethers.providers.JsonRpcProvider(url);
  //   sleep(2000);
  let heroContract = new ethers.Contract(DFKHeroCoreAddress, heroABI, provider);
  let walletHeroes = await heroContract.getUserHeroes(testWallet);
  let questContract = new ethers.Contract(
    DFKQuestCoreV2Address,
    questABI,
    provider
  );
  const walletHeroesInts = walletHeroes.map((h) => Number(h));
  console.log(
    `${walletHeroesInts.length} Heroes in wallet: ${walletHeroesInts}`
  );

  console.log(`${configHeroes.length} Heroes in config`);

  const heroesInWalletButNotConfig = walletHeroesInts.filter(
    (h) => !configHeroes.includes(h)
  );

  heroesInWalletButNotConfig &&
    console.log(
      `${heroesInWalletButNotConfig.length} on wallet but not in config`
    );

  heroesInWalletButNotConfig &&
    heroesInWalletButNotConfig.forEach((h) =>
      console.log(`${h} not in config`)
    );

  const promises = configHeroes.map((hero) => {
    return questContract.getCurrentStamina(hero);
  });

  const results = await Promise.all(promises);

  const heroesWithGoodStaminaRaw = results.map((value, index) => {
    const stamina = Number(value);
    if (stamina >= MINIMUM_STAMINA) {
      return configHeroes[index];
    }
    return null;
  });

  const heroesWithGoodStamina = heroesWithGoodStaminaRaw.filter((h) => !!h);
  fullStaminaHeroes = [...heroesWithGoodStamina];
  console.log(`Full Stamina Threshold = ${MINIMUM_STAMINA}`);
  console.log(`${fullStaminaHeroes.length} full stamina heroes.`);

  getQuestsWithFullStamHeroes();
};

const getQuestsWithFullStamHeroes = () => {
  console.log(`Mapping Ready Quest Groups`);
  const quests = config.quests;
  console.log(`Full Stam Heroes: ${fullStaminaHeroes}`);
  console.log(`Heroes On Quest: ${heroesOnQuest}`);
  const fullStamHeroInts = fullStaminaHeroes.map((hero) => {
    return Number(hero);
  });

  console.log(`${fullStamHeroInts.length} Full Stam`);
  const heroesOnQuestInts = heroesOnQuest.map((hero) => {
    return Number(hero);
  });

  console.log(`${heroesOnQuestInts.length} heroes on quests.`);

  const questsWithOnlyFullStamHeroesRaw = quests.map((quest) => {
    const hardCodedHeroes = quest.professionHeroes.map((h) => Number(h));
    const updatedHeroesWithFullStam = hardCodedHeroes.filter((hero) =>
      fullStamHeroInts.includes(hero)
    );

    const updatedHeoresWithFullStamNotOnQuests =
      updatedHeroesWithFullStam.filter(
        (hero) => !heroesOnQuestInts.includes(hero)
      );

    const updatedQuest = {
      ...quest,
      professionHeroes: updatedHeoresWithFullStamNotOnQuests,
    };

    return updatedQuest;
  });

  const questsWithOnlyFullStamHeroesNotOnQuests =
    questsWithOnlyFullStamHeroesRaw.filter(
      (quest) => quest.professionHeroes.length > 0
    );

  console.log(
    `${questsWithOnlyFullStamHeroesNotOnQuests.length} quests with full stam heroes not on quests: `
  );

  questsWithOnlyFullStamHeroesNotOnQuests.forEach((quest) => {
    console.log(`${quest.name} `);
  });

  const heroGroups = new Array();
  questsWithOnlyFullStamHeroesNotOnQuests.forEach((quest) => {
    const allQuestHeroes = quest.professionHeroes;
    let i = 0;
    while (i < allQuestHeroes.length) {
      heroGroups.push(allQuestHeroes.slice(i, (i += MAX_QUEST_GROUP_SIZE)));
    }
  });
  const questsWithFullStamHeroesAtMaxGroupSize = heroGroups.map((group) => {
    const quests = [...questsWithOnlyFullStamHeroesNotOnQuests];
    const targetQuest = quests.filter((quest) =>
      quest.professionHeroes.includes(group[0])
    );

    const questToUpdate = targetQuest[0];

    return { ...questToUpdate, professionHeroes: group };
  });

  //   questsWithFullStamHeroesAtMaxGroupSize.forEach((q) => {
  //     console.log(q);
  //   });
  console.log(
    `${questsWithFullStamHeroesAtMaxGroupSize.length} ready quest groups.`
  );

  //   sleep(2000);
  sendReadyQuests(questsWithFullStamHeroesAtMaxGroupSize);
};

const sendReadyQuests = async (questGroup) => {
  try {
    questGroup.forEach(async (quest) => {
      console.log(
        `Sending ${quest.professionHeroes.length} heroes on a ${quest.name} quest led by ${quest.professionHeroes[0]}.`
      );
      //   sleep(3000);
      provider = new ethers.providers.JsonRpcProvider(url);
      let wallet = new ethers.Wallet(privateKey, provider);
      let contract = new ethers.Contract(
        DFKQuestCoreV2Address,
        questABI,
        provider
      );

      let receipt = await tryTransaction(
        () =>
          contract
            .connect(wallet)
            .startQuest(
              quest.professionHeroes,
              quest.contractAddress,
              quest.professionMaxAttempts,
              quest.level,
              callOptions
            ),
        3
      );
      console.log(`${receipt.gasUsed} gas used to send heroes on quest.`);
      //   let getCode = await provider.getCode(receipt.contractAddress);
      //   console.log(getCode);
      //   receipt
      //     ? console.log(
      //         `Heroes successfully sent at total gas: ${receipt.cumulativeGasUsed}`
      //       )
      //     : console.log("Failed sending heroes");
      //   sleep(50000);
      //   const contractAddress = receipt.contractAddress;
      //   const code = await provider.getCode(contractAddress);
      //   console.log(code);
    });

    setTimeout(() => checkForAndCompleteQuests(), 150000);
  } catch (err) {
    console.log(err);
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
      console.log(`Attempt ${i + 1}: ${Object.keys(receipt)}`);
      return receipt;
    } catch (err) {
      if (i === attempts - 1) throw err;
    }
  }
};

// console.log(getConfigHeroes());
checkForAndCompleteQuests();
