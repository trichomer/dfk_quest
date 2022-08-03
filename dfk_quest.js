const { ethers } = require("ethers");
const fs = require("fs");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const rxWalletAddress = "0x9aB773A84E0ACbf2F793B1ec267465293208dfB7";
const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);

const questCoreV2Address = "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154";
const questCoreV2Abi = fs.readFileSync("./abis/QuestCoreV2.json").toString();
const questCoreV2Contract = new ethers.Contract(
  questCoreV2Address,
  questCoreV2Abi,
  provider
);
const questCoreV2Interface = new ethers.utils.Interface(questCoreV2Abi);

const wjewelAddress = "0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260";
const wjewelAbi = fs.readFileSync("./abis/erc20.json").toString();
const wjewelContract = new ethers.Contract(wjewelAddress, wjewelAbi, provider);

const trichomerWallet = "0x9aB773A84E0ACbf2F793B1ec267465293208dfB7";
const signerWallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";

const questXP = "QuestXP(uint256,address,uint256,uint64)";
const questXPHash = ethers.utils.id(questXP);
const questReward = "QuestReward(uint256,address,uint256,address,uint256)";
const questRewardHash = ethers.utils.id(questReward);
const questSkillUp = "QuestSkillUp(uint256,address,uint256,uint8,uint16)";
const questSkillUpHash = ethers.utils.id(questSkillUp);
const questStaminaSpent = "QuestStaminaSpent(uint256,address,uint256,uint256,uint256)";
const questStaminaSpentHash = ethers.utils.id(questStaminaSpent);
const rewardMinted = "RewardMinted(uint256,address,uint256,address,uint256,uint256)";
const rewardMintedHash = ethers.utils.id(rewardMinted);
// console.log(questXPHash, '\n', questRewardHash, '\n', questSkillUpHash, '\n', questStaminaSpentHash, '\n', rewardMintedHash);

const miningCrystalAddress = "0x98b3C85ac3cC3EF36Ff25A9229857AbACE3e7410";
const miningGoldAddress = "0x75912145f5cFEfb980616FA47B2f103210FaAb94";
const fishingAddress = "0x407ab39B3675f29A719476af6eb3B9E5d93969E6";
const foragingAddress = "0xAd51199B453075C73FA106aFcAAD59f705EF7872";

const quester = async () => {
  console.log("-".repeat(50));
  // console.log("\nHero 121591 Current Stamina:");
  // heroCurrentStamina = await questCoreV2Contract.functions.getCurrentStamina(
  //   194957
  // );
  // console.log("stamina: " + heroCurrentStamina);
  // console.log("\nHero 133062 Current Stamina:");
  // heroCurrentStamina = await questCoreV2Contract.functions.getCurrentStamina(
  //   133062
  // );
  // console.log("stamina: " + heroCurrentStamina);

  // feeData = await provider.getFeeData();//recommended FeeData to use in a txn
  // console.log(ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei"));//converted from wei into gwei

  // testEventFilter = await wjewelContract.filters.Transfer(rxWalletAddress);// List all token transfers *from* myAddress
  // console.log(testEventFilter);

  // filter2 = await wjewelContract.filters.Transfer(null, rxWalletAddress);// List all token transfers *to* myAddress:
  // console.log(filter2);

  questFilter1 = await questCoreV2Contract.filters.QuestXP(100594378);
  questFilter2 = await questCoreV2Contract.filters.QuestReward(100594378);
  questFilter3 = await questCoreV2Contract.filters.RewardMinted(100594378);
  questFilter4 = await questCoreV2Contract.filters.QuestSkillUp(100594378);
  // console.log(questFilter1, questFilter2, questFilter3, questFilter4);

  const abi = [
    "event QuestXP(uint256 indexed questId, address indexed player, uint256 heroId, uint64 xpEarned)",
  ];
  const interface = new ethers.utils.Interface(abi);
  const testLog = {
    address:
      "0x9c39d9087162b6ffb6a639ad9d9134db96598a684324deb4a05a8cc57fcd7c0e",
    topics: [
      "0x9c39d9087162b6ffb6a639ad9d9134db96598a684324deb4a05a8cc57fcd7c0e",
      // "0xd24d0ec0941a2f5cf71e34aab5120a6ec265b4ff45c78e510a05928202f82786",
      // "0x0000000000000000000000000000000000000000000000000000000005fef2ca",
      ,
    ],
    questId: 100594378,
  };
  console.log(interface.events);
  const logs = await provider.getLogs({
    address: "0x407ab39B3675f29A719476af6eb3B9E5d93969E6",

    topics: [
      // "0xdc5746df27e443efb54d93e1b78111844a3fe5efcabce72a649a9ce2ecbdf8e1",
      ethers.utils.id("QuestXP(uint256,address,uint256,uint64)"),
      // null,
      null,
      ethers.utils.hexZeroPad(trichomerWallet, 32),
      // "0x0000000000000000000000009ab773a84e0acbf2f793b1ec267465293208dfb7",
      // "0x0000000000000000000000000000000000000000000000000000000005fef2ce",
      // questFilter1.topics[0],
      // null,
      // ethers.utils.getAddress(trichomerWallet),
    ],
    fromBlock: 5315909,
    toBlock: 5315909,
  });


  // const logs = await provider.getLogs({
  //   address: "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154",
  //   topics: [interface.id("QuestXP(uint256,address,uint256,uint64)")],
  // });
  // console.log(interface.id("Quest(uint256,address,uint256,uint64)"));
  // console.log(
  //   "\nQuestXP hash: " +
  //     ethers.utils.id(questXP) +
  //     "\nQuestReward hash: " +
  //     ethers.utils.id(questReward) +
  //     "\nQuestSkillUp hash: " +
  //     ethers.utils.id(questSkillUp) +
  //     "\nQuestStaminaSpent hash: " +
  //     ethers.utils.id(questStaminaSpent) +
  //     "\nRewardMinted hash: " +
  //     ethers.utils.id (rewardMinted)
  // );

  console.log(logs);
  console.log(logs.length + " logs returned.");

  const decodedEvents = logs.map((log) => {
    return interface.decodeEventLog("QuestXP", log.data, log.topics);
  });

  console.log(decodedEvents);

  const questIds = decodedEvents.map((event) => {
    // console.log(event[3]);
    return event.questId;
  });

  decodedEvents.forEach((event) => {
    console.log(
      `ID: ${event.questId} | Player: ${event.player} | Hero: ${event.heroId} | XP Earned: ${event.xpEarned}`
    );
  });

  // console.log(questIds);
  // questIds.forEach((id) => {
  //   console.log(`ID: ${id}`);
  // });
  // const eventFilterv5 = async (contractAddress, erc20abi, _provider) => {
  //   const iface = new ethers.utils.Interface(erc20abi.abi);
  //   const provider = _provider;
  //   const logs = await provider.getLogs({
  //     address: contractAddress,
  //     topics: [null, null, ethers.utils.hexZeroPad(trichomerWallet, 32)],
  //     fromBlock: 5315909,
  //     toBlock: 5315909,
  //   });
  //   console.log(logs);
  // const decodedEvents = logs.map((log) => {
  //   iface.decodeEventLog("QuestXP", log.data, log.topics);
  // });
  // console.log(decodedEvents);
  // const questIds = decodedEvents.map((event) => event["values"]["questId"]);
  // const player = decodedEvents.map((event) => event["values"]["player"]);
  // return [player, questIds];
  // };
};

quester();
