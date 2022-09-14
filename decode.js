const { ethers } = require("ethers");
const fs = require("fs");
const DFKHeroCoreAddress = "0xEb9B61B145D6489Be575D3603F4a704810e143dF";
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const heroABI = fs.readFileSync("./abis/HeroCore.json").toString();
const heroContract = new ethers.Contract(DFKHeroCoreAddress, heroABI, provider);

// const getHeroTest = async (id) => {
//     let heroTest = await heroContract.getHero(id);
//     let tupleTest = heroTest.map((item) => {item});
//     console.log(tupleTest, tupleTest.length);
//     console.log();

//     let heroURI = await heroContract.tokenURI(id);
//     console.log(heroURI);
//     console.log(`token URI: ` + heroURI);
// };

// getHeroTest(93141);


heroContract.on(
    "HeroUpdated",
    (owner, heroId) => {
      console.log(
        `test ${heroId} \n ${owner} \n `
      );
    }
  );