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

let provider = new ethers.providers.JsonRpcProvider(url);

const getHeroesFromWallet = async () => {
  let heroContract = new ethers.Contract(DFKHeroCoreAddress, heroABI, provider);
  let questContract = new ethers.Contract(
    DFKQuestCoreV2Address,
    heroABI,
    provider
  );
  let walletHeroes = await heroContract.getUserHeroes(config.testWallet);
  console.log("walletHeroes " + walletHeroes);

  const promises = walletHeroes.map((hero) => {
    return questContract.getCurrentStamina(hero);
  });

  const results = await Promise.all(promises);
  console.log("results" + results);

  const heroesWithGoodStaminaRaw = results.map((value, index) => {
    const stamina = Number(`${value}`);
    // console.log(value);
    if (stamina >= 25) {
      return walletHeroes[index];
    }
    return null;
  });

  const heroesWithGoodStamina = heroesWithGoodStaminaRaw.filter((h) => !!h);
  // console.log(heroesWithGoodStamina);
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
getHeroesFromWallet().then((data) => {
  const quests = config.quests;
  // quests.forEach((q) => {
  //   console.log(q.professionHeroes);
  // });
  const updatedQuests = quests.map((q) => {
    const heroIds = data.map((h) => {
      return Number(h);
    });
    const hardCodedHeroes = q.professionHeroes;
    const updatedHeroes = hardCodedHeroes.filter((h) => heroIds.includes(h));
    q.professionHeroes = updatedHeroes;
    return q;

    // console.log(q.professionHeroes);
  });
  updatedQuests.forEach((q) => {
    if (q.professionHeroes.length > 0) {
      console.log(q.professionHeroes);
    }
  });
});

const resolve = async () => {
  const heroes = await getHeroesFromWallet();
  heroes.forEach((hero) => {
    console.log(`Hero ${hero} ready!`);
  });
};

// resolve();
