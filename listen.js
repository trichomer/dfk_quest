const { ethers } = require("ethers");
const fs = require("fs");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
// const url = "https://avax-dfk.gateway.pokt.network/v1/lb/6244818c00b9f0003ad1b619/ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc";
const erc20Abi = fs.readFileSync("./abis/erc20.json").toString();
const saleAbi = fs
  .readFileSync("./abis/HeroAuctionUpgradeable.json")
  .toString();
const crystalAddress = "0x04b9dA42306B023f3572e106B11D82aAd9D32EBb";
const saleAddress = "0xc390fAA4C7f66E4D62E59C231D5beD32Ff77BEf0";
const provider = new ethers.providers.JsonRpcProvider(url);
const DFKHeroCoreAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const heroABI = [
  "function getHero ( uint256 _id ) external view returns ( tuple )",
];
const config = require("./config.json");
const https = require('https');
const fetch = require('node-fetch');

const saleContract = new ethers.Contract(saleAddress, saleAbi, provider);
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.botToken, {polling: true});

async function getData(id) {
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
  bot.sendMessage(503468588, `Hero ${id} posted \n ${json.data} ${json.level}`);
  // bot.sendMessage(503468588, `Hero ${tokenId} posted for ${ethers.utils.formatUnits(startingPrice, 18)} CRYSTAL \n https://heroes.defikingdoms.com/image/${tokenId}`);
};

// getData(93141);






saleContract.on(
  "AuctionCreated",
  (auctionId, owner, tokenId, startingPrice, endingPrice, duration, winner) => {
    console.log(
      `Hero ${tokenId} posted by ${owner} for ${ethers.utils.formatUnits(
        startingPrice,
        18
      )} CRYSTAL`
    );
    getData(tokenId);
  }
);

