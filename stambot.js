const { ethers } = require("ethers");
const config = require("./config.json");
const rewards = require("./rewards.json");
const fs = require("fs");
const readline = require("readline");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const DFKHeroCoreAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const DFKQuestCoreV2Address = "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154";
const DFKItemConsumerAddress = "0xc9A9F352Aa188f422A8f8902B547FB3E59D37210";
const DFKHeroABI = require("./abis/HeroCore.json");
const DFKQuestABI = require("./abis/QuestCoreUpgradeable.json");
const DFKItemConsumerABI = require("./abis/ItemConsumer.json");
const DFKHeroContract = new ethers.Contract(DFKHeroCoreAddress, DFKHeroABI, provider);
const DFKQuestContract = new ethers.Contract(DFKQuestCoreV2Address, DFKQuestABI, provider);
const DFKItemConsumerContract = new ethers.Contract(DFKItemConsumerAddress, DFKItemConsumerABI, provider);
const halfGwei = ethers.BigNumber.from("500000000");

let wallet;

const first = async () => {
    console.log("Checking for encrypted file...");
    try {
      wallet = fs.existsSync(config.wallet.encWalletPath)
        ? await getEncWallet()
        : await createWallet();
  
      console.clear();
    //   useStamPot(config.testHero2);
      thirtyStamHeroQuest(config.testHero2arr);
    } catch (err) {
      console.clear();
      console.error(`Unable to run ${err.message}`);
    }
  };
  
  const getEncWallet = async () => {
    try {
      let encWallet = fs.readFileSync(config.wallet.encWalletPath, "utf8");
      let decWallet = ethers.Wallet.fromEncryptedJsonSync(encWallet, config.pw);
      return decWallet.connect(provider);
    } catch (err) {
      throw new Error(`Unable to read encrypted wallet`);
    }
  };
  
  const createWallet = async () => {
    console.log(`Input private key on first run to be encrypted...`);
    let pk = await prompt("Please enter private key: ", "private key");
  
    try {
      let newWallet = new ethers.Wallet(pk, provider);
      let enc = await newWallet.encrypt(config.pw);
      fs.writeFileSync(config.wallet.encWalletPath, enc);
      return newWallet;
    } catch (err) {
      throw new Error(`XXXX \n ERROR: Please verify your private key \n XXXX`);
    }
  };
  
  const prompt = async (prompt, promptFor) => {
    const read = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    try {
      let input = await new Promise((resolve) => {
        read.question(prompt, (answer) => resolve(answer));
      });
      if (!input)
        throw new Error(`No ${promptFor} provided, try again`);
        return input;
    } finally {
      read.close();
    }
  };

async function useStamPot(heroId) {
    let feeData = await provider.getFeeData();
    let gpBN = ethers.BigNumber.from(feeData.gasPrice);
    let gpPhg = gpBN.add(halfGwei);
    console.log(`Curr. gas price: ${ethers.utils.formatUnits(feeData.gasPrice, "gwei")}\nCurr. gas price + 0.5 gwei: ${ethers.utils.formatUnits(gpPhg, "gwei")}`);
    console.log(`Consuming Stam Pot on Hero ${heroId}...`);

    let receipt = await tryTransaction(
        () =>
          DFKItemConsumerContract
            .connect(wallet)
            .consumeItem(
              config.stamPot,
              heroId,
              {gasPrice: gpPhg,
               gasLimit: 5000000}
            ),
        3
    );

    console.log(
        `✅${receipt.gasUsed} gas used to Consume Stam Pot; eff. gas price: ${ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei")}`
    );

    let itemEvent = receipt.events.filter((e) => e.event === "ItemConsumed");
    itemEvent.forEach((e) => {
        console.log(`Item consumed: ${config.itemMap[e.args.item]}`);
    });
};

async function thirtyStamHeroQuest(heroId) {
    let feeData = await provider.getFeeData();
    let gpBN = ethers.BigNumber.from(feeData.gasPrice);
    let gpPhg = gpBN.add(halfGwei);
    console.log(`Curr. gas price: ${ethers.utils.formatUnits(feeData.gasPrice, "gwei")}\nCurr. gas price + 0.5 gwei: ${ethers.utils.formatUnits(gpPhg, "gwei")}`);
    console.log(`Sending Hero ${heroId} on quest...`);

    let receipt = await tryTransaction(
        () =>
          DFKQuestContract
            .connect(wallet)
            .startQuest(
              heroId,
              "0xb8828c687Fb1C875D5acb4281C5CDf9F49fA4637",
              5,
              1,
              {gasPrice: gpPhg,
               gasLimit: 5000000}
            ),
        3
      );

      console.log(
        `✅${receipt.gasUsed} gas used to Start quest\nEff. gas price: ${ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei")}`
      );
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

// useStamPot(config.testHero2);
// thirtyStamHeroQuest(config.testHero2);
first();