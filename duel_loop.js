const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkDuelAddress = "0xf724FE22b45D519D149477aA2eC5348Cee08Cae3";
const dfkDuelABI = require("./abis/DFKDuelS1.json");
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";
const provider = new ethers.providers.JsonRpcProvider(url);
const dfkDuelContract = new ethers.Contract(dfkDuelAddress, dfkDuelABI, provider);
const pk = fs.readFileSync(".secret").toString().trim();
const tryTransaction = async (transaction, attempts) => {
    for (let i = 0; i < attempts; i++) {
      try {
        var tx = await transaction();
        let receipt = await tx.wait();
        if (receipt.status === undefined) {
          console.log(tx);
        }
        if (receipt.status !== 1)
          throw new Error(`Receipt had a status of ${receipt.status}`);
        return receipt;
      } catch (err) {
        if (i === attempts - 1) throw err;
      }
    }
};
// function enterDuelLobby(uint256 _type, 
//     uint256[] _heroIds, 
//     uint256 _tokenFee, 
//     uint8 _background, 
//     uint8 _stat)

// let feeBN = ethers.BigNumber.from('100000000000000000');
// let feeBN = ethers.BigNumber.from(config.soloLowC);
// console.log(`fee BN: ${feeBN}`);
// console.log(config.backgroundMap[config.testBack]);
// console.log(config.statMap[config.testStat]);
// Enter Solo duel lobby
const startSolo = async (type, hero, fee, background, stat) => {
    // console.log(`fee BN: ${fee}`);
    // let feeData = await provider.getFeeData();
    // console.log(`Curr. gas price: ${ethers.utils.formatUnits(feeData.gasPrice, "gwei")}`);
    let wallet = new ethers.Wallet(pk, provider);
    let receipt = await tryTransaction(
      () =>
        dfkDuelContract.connect(wallet).enterDuelLobby(
            type,
            hero,
            fee,
            background,
            stat
        ), 
        3
    );
    console.log(`Entering Solo duel lobby with: 
    Type: ${type}
    Hero: ${hero}
    Fee: ${fee}
    Background: ${config.backgroundMap[background]}
    Stat: ${config.statMap[stat]}
    `);

    let entry = receipt.events.filter((e) => e.event === "DuelEntryCreated");
    entry.forEach((e) => {
        console.log(`Duel entry ${e.args.id} created`);
    });
};
// startSolo(config.testType, config.testHero, config.soloLowC, config.testBack, config.testStat);

// function getDuelEntry(uint256 _id) 
//     view returns (tuple(uint256 id, 
//         address player, 
//         uint256[] heroes, 
//         uint256 startBlock, 
//         uint256 heroPower, 
//         uint256 score, 
//         uint256 scoreAfter, 
//         uint256 tokenFee, 
//         uint256 duelId, 
//         uint256 custom1, 
//         uint256 custom2, 
//         uint8 duelType, 
//         uint8 status, 
//         uint64 winStreak, 
//         uint64 loseStreak));
// const getEntry = async (id) => {
//     entry = await dfkDuelContract.getDuelEntry(id);
//     console.log(`ID: ${id}`);
//     console.log(`Entry: ${entry}`);
// };
// // getEntry();

// // function matchMake(uint256 _lobby)
// // Matchmake heroes in lobby
// const match = async (id) => {
//     let wallet = new ethers.Wallet(pk, provider);
//     let receipt = await tryTransaction(
//         () =>
//           dfkDuelContract.connect(wallet).matchMake(id), 3);
    
// };
// match();

// function completeDuel(uint256 _duelId)
// Complete matched duel
const complete = async (id) => {
    let wallet = new ethers.Wallet(pk, provider);
    let receipt = await tryTransaction(
        () =>
          dfkDuelContract.connect(wallet).completeDuel(id), 3);

    let entry = receipt.events.filter((e) => e.event === "DuelCompleted");
    entry.forEach((e) => {
        console.log(`Duel ${e.args.duelId} completed
        ${e.args.player1}
        ${e.args.player2}
        ${entry}
        `);
    });

};
complete();


// event DuelCompleted(uint256 indexed duelId, 
//     address indexed player1, 
//     address indexed player2, 
//     tuple(uint256 id, 
//         address player1, 
//         address player2, 
//         uint256 player1DuelEntry, 
//         uint256 player2DuelEntry, 
//         address winner, 
//         uint256[] player1Heroes, 
//         uint256[] player2Heroes, 
//         uint256 startBlock, 
//         uint8 duelType, 
//         uint8 status, 
//         tuple(uint256 duelId, 
//             uint16 base, 
//             uint32 streakBonus, 
//             uint16 miscBonus, 
//             uint32 diffBonus, 
//             uint64 scoreBefore, 
//             uint64 scoreAfter) 
//         player1ScoreChange) duel)

// event DuelCreated(uint256 indexed duelId, 
//     address indexed player1, 
//     address indexed player2, 
//     tuple(uint256 id, 
//         address player1, 
//         address player2, 
//         uint256 player1DuelEntry, 
//         uint256 player2DuelEntry, 
//         address winner, 
//         uint256[] player1Heroes, 
//         uint256[] player2Heroes, 
//         uint256 startBlock, 
//         uint8 duelType, 
//         uint8 status, 
//         tuple(uint256 duelId, 
//             uint16 base, 
//             uint32 streakBonus, 
//             uint16 miscBonus, 
//             uint32 diffBonus, 
//             uint64 scoreBefore, 
//             uint64 scoreAfter) 
//         player1ScoreChange) duel)

// event DuelEntryCreated(uint256 id, 
//     address indexed player, 
//     uint256[] heroIds)

// event DuelEntryMatched(uint256 indexed duelId, 
//     uint256 indexed duelEntryId, 
//     address indexed player1, 
//     address player2)

// event PlayerScoreChanged(uint256 indexed duelId, 
//     address indexed player, 
//     tuple(uint256 duelId, 
//         uint16 base, 
//         uint32 streakBonus, 
//         uint16 miscBonus, 
//         uint32 diffBonus, 
//         uint64 scoreBefore, 
//         uint64 scoreAfter))

// event TurnOutcome(uint256 indexed duelId, 
//     uint256 indexed player1HeroId, 
//     uint256 indexed player2HeroId, 
//     tuple(uint16 turn, 
//         uint256 player1HeroId, 
//         uint256 player2HeroId, 
//         uint8 stat, 
//         uint8 background, 
//         tuple(uint8 roll, 
//             uint16 elementBonus, 
//             uint16 statValue, 
//             uint16 backgroundBonus, 
//             uint16 total) 
//         hero1Score, 
//         tuple(uint8 roll, 
//             uint16 elementBonus, 
//             uint16 statValue, 
//             uint16 backgroundBonus, 
//             uint16 total) 
//         hero2Score, 
//         uint256 winnerHeroId, 
//         address winnerPlayer) 
//     turnResult)

