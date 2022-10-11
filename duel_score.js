const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkDuelAddress = "0xf724FE22b45D519D149477aA2eC5348Cee08Cae3";
const dfkHeroAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const dfkDuelABI = require("./abis/DFKDuelS1.json");
const dfkHeroABI = require("./abis/HeroCore.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const dfkDuelContract = new ethers.Contract(dfkDuelAddress, dfkDuelABI, provider);
const dfkHeroContract = new ethers.Contract(dfkHeroAddress, dfkHeroABI, provider);
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

// Check wallet and return list of heroes
const getHeroes = async (wallet) => {
    const heroes = await dfkHeroContract.getUserHeroes(wallet);
    console.log(`${wallet} heroes:\n${heroes}`);
    heroes.forEach((h) => getHeroScore(h));

    // return heroesArr;
};
getHeroes(config.queryWallet);

// Fetch individual hero scores from config
const getHeroScore = async (id) => {
    let heroScore = await dfkDuelContract.getCurrentHeroScoreDuelId(id);
    if (heroScore > 0) {
        console.log(`Hero ${id} Score: ${heroScore}`);
        getData(id);
        
    }
  };
// getHeroScore();

// Fetch profile score
// const playerScore = async (prof, type) => {
//     let playerScore = await dfkDuelContract.getPlayerScore(prof, type);
//     console.log(`${prof} score for type ${type}: ${playerScore}`);
// };
// playerScore(config.queryWallet, 2);

// Query API for hero details and log total stats
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
    // console.log(json.data);
    console.log(`${json.data.heroes[0].id} Lv.${json.data.heroes[0].level} ${RARITY_ICON[json.data.heroes[0].rarity]} ${json.data.heroes[0].mainClass}/${json.data.heroes[0].subClass}`);
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
};
// getData();