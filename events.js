const { ethers, Contract } = require("ethers");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const HeroSummoningUpgradableABI = require("./abis/HeroSummoningUpgradable.json");
const CrystalCoreUpgradeableABI = require("./abis/CrystalCoreUpgradeable.json");
const HeroSummoningUpgradableAddress = "0xBc36D18662Bb97F9e74B1EAA1B752aA7A44595A7";
const CrystalCoreUpgradeableAddress = "0x68f6C64786cfCb35108986041D1009c9d27bde22";
const HeroSummoningUpgradableContract = new ethers.Contract(HeroSummoningUpgradableAddress, HeroSummoningUpgradableABI, provider);
const CrystalCoreUpgradeableContract = new ethers.Contract(CrystalCoreUpgradeableAddress, CrystalCoreUpgradeableABI, provider);

// event CrystalSummoned(
    // uint256 crystalId, 
    // address indexed owner, 
    // uint256 summonerId, 
    // uint256 assistantId, 
    // uint16 generation, 
    // uint256 createdBlock, 
    // uint8 summonerTears, 
    // uint8 assistantTears, 
    // address enhancementStone)

let ccCrystalSummoned = CrystalCoreUpgradeableContract.filters.CrystalSummoned(null, "0x2469B86d03B791C6316BA5B876cF7dF53be08a65");
console.log(`${ccCrystalSummoned[0]}`);
console.log(`${ccCrystalSummoned[1]}`);


async function gc () {
    let ccGetCrystal = await CrystalCoreUpgradeableContract.getCrystal(29452);
    console.log(`
        Owner: ${ccGetCrystal[0]}
        summonerId: ${ccGetCrystal[1]}
        assistantId: ${ccGetCrystal[2]}
        generation: ${ccGetCrystal[3]}
        createdBlock: ${ccGetCrystal[4]}
        heroId: ${ccGetCrystal[5]}
        summonerTears: ${ccGetCrystal[6]}
        assistantTears: ${ccGetCrystal[7]}
        enhancementStone: ${ccGetCrystal[8]}
        maxSummons: ${ccGetCrystal[9]}
        firstName: ${ccGetCrystal[10]}
        lastName: ${ccGetCrystal[11]}
        shinyStyle: ${ccGetCrystal[12]}`);
};
gc();

// CrystalCore:
// function getCrystal(uint256 _crystalId) 
// view returns (tuple(
//     address owner, 
//     uint256 summonerId, 
//     uint256 assistantId, 
//     uint16 generation, 
//     uint256 createdBlock, 
//     uint256 heroId, 
//     uint8 summonerTears, 
//     uint8 assistantTears, 
//     address enhancementStone, 
//     uint32 maxSummons, 
//     uint32 firstName, 
//     uint32 lastName, 
//     uint8 shinyStyle))