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

const quester = async () => {
  console.log("-".repeat(50));
  console.log("\nHero 93141 Current Stamina:");
  heroCurrentStamina = await questCoreV2Contract.functions.getCurrentStamina(
    93141
  );
  console.log(heroCurrentStamina);

  console.log("-".repeat(50));
  console.log("\nWallet", rxWalletAddress, "Current Quests:");
  accountActiveQuests =
    await questCoreV2Contract.functions.getAccountActiveQuests(rxWalletAddress);
  console.log("accountActiveQuests: " + typeof accountActiveQuests);
  console.log("accountActiveQuests Keys: " + Object.keys(accountActiveQuests));
  console.log("accountActiveQuests[0]: " + typeof accountActiveQuests[0]);

  console.log("Keys Length: " + Object.keys(accountActiveQuests).length);

  const data = accountActiveQuests[0];
  // const [id, questAddress, level, heroes, player, startBlock] = element;

  console.log(`Data Length: ${data.length}`);
  console.log(`Data: ${data}`);

  data.forEach((element, i) => {
    const [
      id,
      questAddress,
      level,
      heroes,
      player,
      startBlock,
      startAtTime,
      completeAtTime,
      attempts,
      status,
    ] = element;
    console.log(
      `ID: ${id} || Quest Address: ${questAddress} || Level: ${level} || Hero: ${heroes} || Player: ${player} || Start Block: ${startBlock} || Start Time: ${startAtTime} || Complete Time: ${completeAtTime} || Attempts: ${attempts} || Status : ${status}`
    );
  });
};

quester();
