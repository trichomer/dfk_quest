const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkDuelAddress = "0xf724FE22b45D519D149477aA2eC5348Cee08Cae3";
const dfkDuelABI = require("./abis/DFKDuelS1.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const dfkDuelContract = new ethers.Contract(dfkDuelAddress, dfkDuelABI, provider);
const fetch = require('node-fetch');

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


const playerScore = async (prof, type) => {
    let playerScore = await dfkDuelContract.getPlayerScore(prof, type);
    console.log(`${prof} score for type ${type}: ${playerScore}`);
};
playerScore(config.queryWallet, 2);

const getHeroScore = async (id1, id2, id3, id4) => {
    let heroScore1 = await dfkDuelContract.getCurrentHeroScoreDuelId(id1);
    console.log(`Hero ${config.testHero1} Score: ${heroScore1}`);
    let heroScore2 = await dfkDuelContract.getCurrentHeroScoreDuelId(id2);
    console.log(`Hero ${config.testHero2} Score: ${heroScore2}`);
    let heroScore3 = await dfkDuelContract.getCurrentHeroScoreDuelId(id3);
    console.log(`Hero ${config.testHero3} Score: ${heroScore3}`);
    let heroScore4 = await dfkDuelContract.getCurrentHeroScoreDuelId(id4);
    console.log(`Hero ${config.testHero4} Score: ${heroScore4}`);
  };
getHeroScore(config.testHero1, config.testHero2, config.testHero3, config.testHero4);








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
  };
getData(78402);