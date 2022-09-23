const { ethers } = require("ethers");
const fs = require("fs");

const config = require("./config.json");

const DuelAddress = "0xE97196f4011dc9DA0829dd8E151EcFc0f37EE3c7";

const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";

const duelABI = [
    "event DuelCompleted(uint256 indexed duelId, address indexed player1, address indexed player2, tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status) duel)",
    "event DuelCreated(uint256 indexed duelId, address indexed player1, address indexed player2, tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status) duel)",
    "event DuelEntryCreated(uint256 id, address indexed player, uint256[] heroIds)",
    "event DuelEntryMatched(uint256 indexed duelId, uint256 indexed duelEntryId, address indexed player1, address player2)",
    "event TurnOutcome(uint256 indexed duelId, uint256 indexed player1HeroId, uint256 indexed player2HeroId, tuple(uint16 turn, uint256 player1HeroId, uint256 player2HeroId, uint8 stat, uint8 background, tuple(uint8 roll, uint16 elementBonus, uint16 statValue, uint16 backgroundBonus, uint16 total) hero1Score, tuple(uint8 roll, uint16 elementBonus, uint16 statValue, uint16 backgroundBonus, uint16 total) hero2Score, uint256 winnerHeroId, address winnerPlayer) turnResult)",
  
    "function completeDuel(uint256 _duelId)",
    "function enterDuelLobby(uint256 _type, uint256[] _heroIds, uint256 _jewelFee, uint8 _background, uint8 _stat)",
    "function getActiveDuels(address _address) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status)[])",
    "function getChallenges(address _profile) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status)[])",
    "function getDuel(uint256 _id) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status))",
    "function getDuelEntry(uint256 _id) view returns (tuple(uint256 id, address player, uint256[] heroes, uint256 startBlock, uint256 score, uint256 scoreAfter, uint256 jewelFee, uint256 duelId, uint256 custom1, uint256 custom2, uint8 duelType, uint8 status))",
    "function getDuelHistory(address _profile) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status)[100])",
    "function getDuelIndexP1(uint256 _duelId) view returns (uint256)",
    "function getDuelRewards(uint256 _id) view returns (tuple(address item, address recipient, uint256 qty)[])",
    "function getDuelTurns(uint256 _id) view returns (tuple(uint16 turn, uint256 player1HeroId, uint256 player2HeroId, uint8 stat, uint8 background, tuple(uint8 roll, uint16 elementBonus, uint16 statValue, uint16 backgroundBonus, uint16 total) hero1Score, tuple(uint8 roll, uint16 elementBonus, uint16 statValue, uint16 backgroundBonus, uint16 total) hero2Score, uint256 winnerHeroId, address winnerPlayer)[])",
    "function getHeroDuel(uint256 _heroId) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status))",
    "function getHighestScore() view returns (uint64)",
    "function getPlayerDuelEntries(address _profile) view returns (tuple(uint256 id, address player, uint256[] heroes, uint256 startBlock, uint256 score, uint256 scoreAfter, uint256 jewelFee, uint256 duelId, uint256 custom1, uint256 custom2, uint8 duelType, uint8 status)[])",
    "function getPlayerScore(address _profile) view returns (uint64)",
    "function getPracticeEntry(uint256 _type, uint8 _rank) view returns (tuple(uint256 id, address player, uint256[] heroes, uint256 startBlock, uint256 score, uint256 scoreAfter, uint256 jewelFee, uint256 duelId, uint256 custom1, uint256 custom2, uint8 duelType, uint8 status))",
    "function getTotalDuelEntries() view returns (uint256)",
    "function getTotalDuels() view returns (uint256)",
    "function getTotalOpenDuelEntries(uint256 _lobby) view returns (uint256)",
    "function getTotalPlayerDuels(address _profile) view returns (uint64)",
    "function getTotalPlayerWins(address _profile) view returns (uint64)",
    "function _heroMMScore(tuple(uint256 id, tuple(uint256 summonedTime, uint256 nextSummonTime, uint256 summonerId, uint256 assistantId, uint32 summons, uint32 maxSummons) summoningInfo, tuple(uint256 statGenes, uint256 visualGenes, uint8 rarity, bool shiny, uint16 generation, uint32 firstName, uint32 lastName, uint8 shinyStyle, uint8 class, uint8 subClass) info, tuple(uint256 staminaFullAt, uint256 hpFullAt, uint256 mpFullAt, uint16 level, uint64 xp, address currentQuest, uint8 sp, uint8 status) state, tuple(uint16 strength, uint16 intelligence, uint16 wisdom, uint16 luck, uint16 agility, uint16 vitality, uint16 endurance, uint16 dexterity, uint16 hp, uint16 mp, uint16 stamina) stats, tuple(uint16 strength, uint16 intelligence, uint16 wisdom, uint16 luck, uint16 agility, uint16 vitality, uint16 endurance, uint16 dexterity, uint16 hpSm, uint16 hpRg, uint16 hpLg, uint16 mpSm, uint16 mpRg, uint16 mpLg) primaryStatGrowth, tuple(uint16 strength, uint16 intelligence, uint16 wisdom, uint16 luck, uint16 agility, uint16 vitality, uint16 endurance, uint16 dexterity, uint16 hpSm, uint16 hpRg, uint16 hpLg, uint16 mpSm, uint16 mpRg, uint16 mpLg) secondaryStatGrowth, tuple(uint16 mining, uint16 gardening, uint16 foraging, uint16 fishing) professions) _hero) view returns (uint64)",
    "function _partyMMScore(tuple(uint256 id, tuple(uint256 summonedTime, uint256 nextSummonTime, uint256 summonerId, uint256 assistantId, uint32 summons, uint32 maxSummons) summoningInfo, tuple(uint256 statGenes, uint256 visualGenes, uint8 rarity, bool shiny, uint16 generation, uint32 firstName, uint32 lastName, uint8 shinyStyle, uint8 class, uint8 subClass) info, tuple(uint256 staminaFullAt, uint256 hpFullAt, uint256 mpFullAt, uint16 level, uint64 xp, address currentQuest, uint8 sp, uint8 status) state, tuple(uint16 strength, uint16 intelligence, uint16 wisdom, uint16 luck, uint16 agility, uint16 vitality, uint16 endurance, uint16 dexterity, uint16 hp, uint16 mp, uint16 stamina) stats, tuple(uint16 strength, uint16 intelligence, uint16 wisdom, uint16 luck, uint16 agility, uint16 vitality, uint16 endurance, uint16 dexterity, uint16 hpSm, uint16 hpRg, uint16 hpLg, uint16 mpSm, uint16 mpRg, uint16 mpLg) primaryStatGrowth, tuple(uint16 strength, uint16 intelligence, uint16 wisdom, uint16 luck, uint16 agility, uint16 vitality, uint16 endurance, uint16 dexterity, uint16 hpSm, uint16 hpRg, uint16 hpLg, uint16 mpSm, uint16 mpRg, uint16 mpLg) secondaryStatGrowth, tuple(uint16 mining, uint16 gardening, uint16 foraging, uint16 fishing) professions)[] _heroes) view returns (uint64)",
    "function matchMake(uint256 _lobby)",
    "function acceptChallenge(uint256 _duelId, uint256[] _heroIds, uint8 _background, uint8 _stat)",
    "function startPracticeDuel(uint256 _type, uint256[] _heroIds, uint8 _rank, uint8 _background, uint8 _stat)",
    "function startPrivateDuel(uint256 _type, uint256[] _heroIds, address _opponent, uint8 _background, uint8 _stat)",
];

let provider = new ethers.providers.JsonRpcProvider(url);

const completeQuest = async (heroId) => {
    try {
      console.log(`Completing quest led by hero ${heroId}.`);
      let receipt = await tryTransaction(
        () => questContract.connect(wallet).completeQuest(heroId, config.txnOptions),
        3
      );
  
      // testing estimateGas() for completeQuest()
      let estimateGas = await provider.estimateGas(receipt);
      console.log(`Estimated Gas for completeQuest():  ${estimateGas}`);
  
      console.log(`\n **** Completed quest led by hero ${heroId}. ****`);
  
      let xpEvents = receipt.events.filter((e) => e.event === "QuestXP");
      // console.log(
      //   `XP: ${xpEvents.reduce(
      //     (total, result) => total + Number(result.args.xpEarned),
      //     0
      //   )}`
      // );
      xpEvents.forEach((e) => {
        console.log(`${e.args.xpEarned} XP Earned by Hero ${e.args.heroId}`);
        //   console.log(e);
      });
  
      let suEvents = receipt.events.filter((e) => e.event === "QuestSkillUp");
      // console.log(
      //   `SkillUp: ${
      //     suEvents.reduce(
      //       (total, result) => total + Number(result.args.skillUp),
      //       0
      //     ) / 10
      //   }`
      // );
      suEvents.forEach((e) => {
        console.log(`${e.args.skillUp} Skill Up Earned by Hero ${e.args.heroId}`);
      });
  
      console.log("\n*****\n");
    } catch (err) {
      console.log("Complete Quest error: " + err.message);
    }
  };
  
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

