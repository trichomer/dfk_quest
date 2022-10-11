const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkDuelAddress = "0xf724FE22b45D519D149477aA2eC5348Cee08Cae3";
const dfkDuelABI = require("./abis/DFKDuelS1.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const dfkDuelContract = new ethers.Contract(dfkDuelAddress, dfkDuelABI, provider);

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