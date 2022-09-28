const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const erc20Abi = fs.readFileSync("./abis/erc20.json").toString();
const saleAbi = fs
  .readFileSync("./abis/HeroAuctionUpgradeable.json")
  .toString();
const crystalAddress = "0x04b9dA42306B023f3572e106B11D82aAd9D32EBb";
const saleAddress = "0xc390fAA4C7f66E4D62E59C231D5beD32Ff77BEf0";
const hmyProvider = new ethers.providers.JsonRpcProvider(config.hmyRPC);
const dfkProvider = new ethers.providers.JsonRpcProvider(config.dfkRPC);
const DFKHeroCoreAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const heroABI = [
  "function getHero ( uint256 _id ) external view returns ( tuple )",
];

const https = require('https');
const fetch = require('node-fetch');
const profilesAddress = "0x6391F796D56201D279a42fD3141aDa7e26A3B4A5";
const profilesAbi = fs.readFileSync("./abis/Profiles.json").toString();
const profilesContract = new ethers.Contract(profilesAddress, profilesAbi, hmyProvider);
const saleContract = new ethers.Contract(saleAddress, saleAbi, dfkProvider);
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.botToken, {polling: true});

const COMMON = "⬜";
const UNCOMMON = "🟩";
const RARE = "🟦";
const LEGENDARY = "🟧";
const MYTHIC = "🟪";
const RARITY_ICON = {
  4: MYTHIC,
  3: LEGENDARY,
  2: RARE,
  1: UNCOMMON,
  0: COMMON,
};

async function getData(id, price) {
  const data = JSON.stringify({
    query: `query myHeroes($id: ID!) {
      heroes(where: {id: $id}, orderBy: rarity, orderDirection: desc){
        id
        level
        generation
        rarity
        mainClass
        subClass
        summonsRemaining
        maxSummons
        hp
        mp
        strength
        agility
        endurance
        wisdom
        dexterity
        vitality
        intelligence
        luck
        statBoost1
        statBoost2
        profession
        mining
        fishing
        gardening
        foraging
        statGenes
        pjStatus
        active1
        active2
        passive1
        passive2
        element
        background
        strengthGrowthP
        agilityGrowthP
        enduranceGrowthP
        wisdomGrowthP
        dexterityGrowthP
        vitalityGrowthP
        intelligenceGrowthP
        luckGrowthP
      }
    }`,
    variables: `{
        "id": "${id}"
      }`,
  });

  const response = await fetch(
    'https://defi-kingdoms-community-api-gateway-co06z8vi.uc.gateway.dev/graphql',
    {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Node',
      },
    }
  );

  const json = await response.json();
  console.log(json.data);
  console.log(`Total Stats:`, 
  json.data.heroes[0].strength + 
  json.data.heroes[0].agility +
  json.data.heroes[0].endurance +
  json.data.heroes[0].wisdom +
  json.data.heroes[0].dexterity +
  json.data.heroes[0].vitality +
  json.data.heroes[0].intelligence +
  json.data.heroes[0].luck
  );
  console.log(RARITY_ICON[json.data.heroes[0].rarity]);

  let totalStats = json.data.heroes[0].strength + 
    json.data.heroes[0].agility +
    json.data.heroes[0].endurance +
    json.data.heroes[0].wisdom +
    json.data.heroes[0].dexterity +
    json.data.heroes[0].vitality +
    json.data.heroes[0].intelligence +
    json.data.heroes[0].luck;

  bot.sendMessage(config.chatID, `Hero ${id}\n${ethers.utils.formatUnits(price, 18)} CRYSTAL
   Lv. ${json.data.heroes[0].level} ${json.data.heroes[0].mainClass}/${json.data.heroes[0].subClass}
   Gen ${json.data.heroes[0].generation} ${RARITY_ICON[json.data.heroes[0].rarity]} ${json.data.heroes[0].summonsRemaining}/${json.data.heroes[0].maxSummons}
   Stats: ${totalStats}
   A1: ${json.data.heroes[0].active1}
   A2: ${json.data.heroes[0].active2}
   P1: ${json.data.heroes[0].passive1}
   P2: ${json.data.heroes[0].passive2}
   `
   );
};


saleContract.on(
  "AuctionCreated",
  (auctionId, owner, tokenId, startingPrice, endingPrice, duration, winner) => {
    profile(owner);
    console.log(
      `Hero ${tokenId} posted by ${owner} for ${ethers.utils.formatUnits(
        startingPrice,
        18
      )} CRYSTAL`
    );
    getData(tokenId, startingPrice);
  }
);

const profile = async (owner) => {
  let profName = await profilesContract.getProfileByAddress(owner);
  console.log(`Profile name: ${profName[2]}`);
};

