const { ethers } = require("ethers");
const fs = require("fs");

const config = require("./config.json");

const DFKHeroCoreAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const DFKQuestCoreV2Address = "0xE9AbfBC143d7cef74b5b793ec5907fa62ca53154";

const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";

const heroABI = [
  "function getUserHeroes ( address _address ) external view returns ( uint256[] )",
  "function getCurrentStamina(uint256 _heroId) external view returns (uint256)",
];

const testWallet = "0x2E314D94fd218fA08A71bC6c9113e1b603B9d483";
let provider = new ethers.providers.JsonRpcProvider(url);

const getHeroesFromWallet = async () => {
  let heroContract = new ethers.Contract(DFKHeroCoreAddress, heroABI, provider);
  let questContract = new ethers.Contract(
    DFKQuestCoreV2Address,
    heroABI,
    provider
  );
  let walletHeroes = await heroContract.getUserHeroes(testWallet);
  console.log("walletHeroes " + walletHeroes);
  //   const fiveAttemptHeroes = [];
  //   console.log(walletHeroes.length + " total heroes!");
  //   walletHeroes.forEach(async (h) => {
  //     let stamina = await checkHeroStamina(h);
  //     console.log(`Hero ${h} stamina = ${await checkHeroStamina(h)}`);
  //     if ((await stamina) >= 25) {
  //       fiveAttemptHeroes.push(h);
  //     }
  //     fiveAttemptHeroes.forEach((hero) => {
  //       console.log(`${hero}`);
  //     });
  //   });
  //   return fiveAttemptHeroes;
  const promises = walletHeroes.map((hero) => {
    return questContract.getCurrentStamina(hero);
  });

  const results = await Promise.all(promises);
  console.log("results" + results);
  // const mappedR = results.map((h) => {
  //   const stamina = h;
  //   return stamina;
  // });

  // console.log(mappedR);

  const heroesWithGoodStaminaRaw = results.map((value, index) => {
    const stamina = Number(`${value}`);
    // console.log(value);
    if (stamina >= 25) {
      return walletHeroes[index];
    }
    return null;
  });

  const heroesWithGoodStamina = await heroesWithGoodStaminaRaw.filter(
    (h) => !!h
  );

  // heroesWithGoodStamina.forEach((h) => {
  //   console.log(`${h}`);
  // });

  // console.log(heroesWithGoodStamina);

  return heroesWithGoodStamina;
};
// console.log(getHeroesFromWallet());
// console.log(`Stamina boys: ${getHeroesFromWallet()}`);
// const checkHeroStamina = async (heroId) => {
//   let questContract = new ethers.Contract(
//     DFKQuestCoreV2Address,
//     heroABI,
//     provider
//   );
//   let stamina = await questContract.getCurrentStamina(heroId);
//   //   console.log(stamina);
//   return stamina;
// };
getHeroesFromWallet();
