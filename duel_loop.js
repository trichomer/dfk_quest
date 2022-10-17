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

// let feeBN = ethers.BigNumber.from(config.soloLowC);
// console.log(`fee BN: ${feeBN}`);
// console.log(config.backgroundMap[config.testBack]);
// console.log(config.statMap[config.testStat]);

// Enter Solo duel lobby
const startSolo = async (type, hero, fee, background, stat) => {
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
        waitMatch(e.args.id);// Pass in ID from DuelEntryCreated event
    });
};
startSolo(config.testType, config.testHero, config.soloLowC, config.testBack, config.testStat);

// event DuelEntryMatched(
//     uint256 indexed duelId, 
//     uint256 indexed duelEntryId, 
//     address indexed player1, 
//     address player2)

// Listen to DuelEntryMatched events until the argument passed in matches emitted log, 
// then pass that event's duelEntryId into complete()
const waitMatch = async (id) => {
    dfkDuelContract.on(
        "DuelEntryMatched",
        (duelId, duelEntryId, player1, player2) => {
            if (duelId === id) {
                console.log(`## DUEL ENTRY MATCHED ##\nDuel ID: ${duelId}\nDuel Entry ID: ${duelEntryId}\nPlayer 1: ${player1}\nPlayer 2: ${player2}\n----`);
                complete(duelEntryId);
        }}
    );
};

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
// complete();


// const getEntry = async (id) => {
//     entry = await dfkDuelContract.getDuelEntry(id);
//     console.log(`ID: ${id}`);
//     console.log(`Entry: ${entry.duelId}`);
//     complete(entry.duelId);
// };
// getEntry();

// // function matchMake(uint256 _lobby)

// // Matchmake heroes in lobby
// const match = async (id) => {
//     let wallet = new ethers.Wallet(pk, provider);
//     let receipt = await tryTransaction(
//         () =>
//           dfkDuelContract.connect(wallet).matchMake(id), 3);
    
// };
// match();