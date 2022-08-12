const { ethers } = require("ethers");
const fs = require("fs");

const DFKHeroCoreAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const DFKQuestCoreV2Address = "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154";

const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";

const heroABI = [
  "function getUserHeroes ( address _address ) external view returns ( uint256[] )",
  "function getCurrentStamina(uint256 _heroId) external view returns (uint256)",
];

const questABI = [];

const testWallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";
let provider = new ethers.providers.JsonRpcProvider(url);

const getHeroesFromWallet = async () => {
  let heroContract = new ethers.Contract(DFKHeroCoreAddress, heroABI, provider);
  let walletHeroes = await heroContract.getUserHeroes(testWallet);
  walletHeroes.forEach(async (h) => {
    console.log(`Hero ${h} stamina = ${await checkHeroStamina(h)}`);
  });
  return walletHeroes;
};

getHeroesFromWallet();

const checkHeroStamina = async (heroId) => {
  let questContract = new ethers.Contract(
    DFKQuestCoreV2Address,
    heroABI,
    provider
  );
  let stamina = await questContract.getCurrentStamina(heroId);
  //   console.log(stamina);
  return stamina;
};
