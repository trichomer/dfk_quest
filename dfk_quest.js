const { ethers, BigNumber } = require("ethers");
const fs = require("fs");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const signer = provider.getSigner();
const rxWalletAddress = "0x9aB773A84E0ACbf2F793B1ec267465293208dfB7";
const privateKey = fs.readFileSync(".secret").toString().trim();
const wallet = new ethers.Wallet(privateKey, provider);

const heroCoreAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const questCoreV2Address = "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154";
const questCoreV2Abi = fs.readFileSync("./abis/QuestCoreV2.json").toString();
const questCoreV2Contract = new ethers.Contract(
  questCoreV2Address,
  questCoreV2Abi,
  provider
);

const wjewelAddress = '0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260';
const wjewelAbi = fs.readFileSync("./abis/erc20.json").toString();
const wjewelContract = new ethers.Contract(
  wjewelAddress,
  wjewelAbi,
  provider
);

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

  questFilter1 = await questCoreV2Contract.filters.QuestXP();
  questFilter2 = await questCoreV2Contract.filters.QuestReward();
  questFilter3 = await questCoreV2Contract.filters.RewardMinted();
  questFilter4 = await questCoreV2Contract.filters.QuestSkillUp();
  console.log(
    questFilter1, 
    questFilter2, 
    questFilter3,
    questFilter4
    );


  // console.log("-".repeat(50));
  // console.log("\nWallet", rxWalletAddress, "Current Quests:");
  // accountActiveQuests =
  //   await questCoreV2Contract.functions.getAccountActiveQuests(rxWalletAddress);
  // console.log("accountActiveQuests: " + typeof accountActiveQuests);
  // console.log("accountActiveQuests Keys: " + Object.keys(accountActiveQuests));
  // console.log("accountActiveQuests[0]: " + typeof accountActiveQuests[0]);

  // console.log("Keys Length: " + Object.keys(accountActiveQuests).length);

  // const data = accountActiveQuests[0];
  // // const [id, questAddress, level, heroes, player, startBlock] = element;

  // console.log(`Data Length: ${data.length}`);
  // console.log(`Data: ${data}`);

  // data.forEach((element, i) => {
  //   const [
  //     id,
  //     questAddress,
  //     level,
  //     heroes,
  //     player,
  //     startBlock,
  //     startAtTime,
  //     completeAtTime,
  //     attempts,
  //     status,
  //   ] = element;
  //   console.log(
  //     `ID: ${id} \n Quest Address: ${questAddress} \n Level: ${level} \n Hero: ${heroes} \n Player: ${player} \n Start Block: ${startBlock} \n Start Time: ${startAtTime} \n Complete Time: ${completeAtTime} \n Attempts: ${attempts} \n Status : ${status}`
  //   );
  // });
};

quester();
