const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config.json");
const dfkDuelAddress = "0xf724FE22b45D519D149477aA2eC5348Cee08Cae3";
const dfkDuelABI = [
  "event DuelCompleted(uint256 indexed duelId, address indexed player1, address indexed player2, tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status, tuple(uint256 duelId, uint16 base, uint32 streakBonus, uint16 miscBonus, uint32 diffBonus, uint64 scoreBefore, uint64 scoreAfter) player1ScoreChange) duel)",
  "event DuelCreated(uint256 indexed duelId, address indexed player1, address indexed player2, tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status, tuple(uint256 duelId, uint16 base, uint32 streakBonus, uint16 miscBonus, uint32 diffBonus, uint64 scoreBefore, uint64 scoreAfter) player1ScoreChange) duel)",
  "event DuelEntryCreated(uint256 id, address indexed player, uint256[] heroIds)",
  "event DuelEntryMatched(uint256 indexed duelId, uint256 indexed duelEntryId, address indexed player1, address player2)",
  "event PlayerScoreChanged(uint256 indexed duelId, address indexed player, tuple(uint256 duelId, uint16 base, uint32 streakBonus, uint16 miscBonus, uint32 diffBonus, uint64 scoreBefore, uint64 scoreAfter))",
  "event TurnOutcome(uint256 indexed duelId, uint256 indexed player1HeroId, uint256 indexed player2HeroId, tuple(uint16 turn, uint256 player1HeroId, uint256 player2HeroId, uint8 stat, uint8 background, tuple(uint8 roll, uint16 elementBonus, uint16 statValue, uint16 backgroundBonus, uint16 total) hero1Score, tuple(uint8 roll, uint16 elementBonus, uint16 statValue, uint16 backgroundBonus, uint16 total) hero2Score, uint256 winnerHeroId, address winnerPlayer) turnResult)",
    
  "function acceptChallenge(uint256 _duelId, uint256[] _heroIds, uint8 _background, uint8 _stat)",
  "function completeDuel(uint256 _duelId)",
  "function enterDuelLobby(uint256 _type, uint256[] _heroIds, uint256 _tokenFee, uint8 _background, uint8 _stat)",
  "function getActiveDuels(address _address) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status, tuple(uint256 duelId, uint16 base, uint32 streakBonus, uint16 miscBonus, uint32 diffBonus, uint64 scoreBefore, uint64 scoreAfter) player1ScoreChange)[])",
  "function getChallenges(address _profile) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status, tuple(uint256 duelId, uint16 base, uint32 streakBonus, uint16 miscBonus, uint32 diffBonus, uint64 scoreBefore, uint64 scoreAfter) player1ScoreChange)[])",
  "function getCurrentHeroScoreDuelId(uint256 _heroId) view returns (uint256)",
  "function getDuel(uint256 _id) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status, tuple(uint256 duelId, uint16 base, uint32 streakBonus, uint16 miscBonus, uint32 diffBonus, uint64 scoreBefore, uint64 scoreAfter) player1ScoreChange))",
  "function getDuelEntry(uint256 _id) view returns (tuple(uint256 id, address player, uint256[] heroes, uint256 startBlock, uint256 heroPower, uint256 score, uint256 scoreAfter, uint256 tokenFee, uint256 duelId, uint256 custom1, uint256 custom2, uint8 duelType, uint8 status, uint64 winStreak, uint64 loseStreak))",
  "function getDuelHistory(address _profile) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status, tuple(uint256 duelId, uint16 base, uint32 streakBonus, uint16 miscBonus, uint32 diffBonus, uint64 scoreBefore, uint64 scoreAfter) player1ScoreChange)[100])",
  "function getDuelIndexP1(uint256 _duelId) view returns (uint256)",
  "function getDuelRewards(uint256 _id) view returns (tuple(address item, address recipient, uint256 qty)[])",
  "function getDuelTurns(uint256 _id) view returns (tuple(uint16 turn, uint256 player1HeroId, uint256 player2HeroId, uint8 stat, uint8 background, tuple(uint8 roll, uint16 elementBonus, uint16 statValue, uint16 backgroundBonus, uint16 total) hero1Score, tuple(uint8 roll, uint16 elementBonus, uint16 statValue, uint16 backgroundBonus, uint16 total) hero2Score, uint256 winnerHeroId, address winnerPlayer)[])",
  "function getHeroDuel(uint256 _heroId) view returns (tuple(uint256 id, address player1, address player2, uint256 player1DuelEntry, uint256 player2DuelEntry, address winner, uint256[] player1Heroes, uint256[] player2Heroes, uint256 startBlock, uint8 duelType, uint8 status, tuple(uint256 duelId, uint16 base, uint32 streakBonus, uint16 miscBonus, uint32 diffBonus, uint64 scoreBefore, uint64 scoreAfter) player1ScoreChange))",
  "function getHeroDuelEntry(uint256 _heroId) view returns (tuple(uint256 id, address player, uint256[] heroes, uint256 startBlock, uint256 heroPower, uint256 score, uint256 scoreAfter, uint256 tokenFee, uint256 duelId, uint256 custom1, uint256 custom2, uint8 duelType, uint8 status, uint64 winStreak, uint64 loseStreak))",
  "function getHighestScore(uint256 _type) view returns (uint64)",
  "function getPlayerDuelEntries(address _profile) view returns (tuple(uint256 id, address player, uint256[] heroes, uint256 startBlock, uint256 heroPower, uint256 score, uint256 scoreAfter, uint256 tokenFee, uint256 duelId, uint256 custom1, uint256 custom2, uint8 duelType, uint8 status, uint64 winStreak, uint64 loseStreak)[])",
  "function getPlayerScore(address _profile, uint256 _type) view returns (uint64)",
  "function getPracticeEntry(uint256 _type, uint8 _rank) view returns (tuple(uint256 id, address player, uint256[] heroes, uint256 startBlock, uint256 heroPower, uint256 score, uint256 scoreAfter, uint256 tokenFee, uint256 duelId, uint256 custom1, uint256 custom2, uint8 duelType, uint8 status, uint64 winStreak, uint64 loseStreak))",
  "function getTotalDuelEntries() view returns (uint256)",
  "function getTotalDuels() view returns (uint256)",
  "function getTotalOpenDuelEntries(uint256 _lobby) view returns (uint256)",
  "function getTotalPlayerDuels(address _profile, uint256 _type) view returns (uint64)",
  "function getTotalPlayerWins(address _profile, uint256 _type) view returns (uint64)",
  "function getWinStreaks(address _player, uint256 _type) view returns (uint256)",
  "function matchMake(uint256 _lobby)",
  "function startPracticeDuel(uint256 _type, uint256[] _heroIds, uint8 _rank, uint8 _background, uint8 _stat)",
  "function startPrivateDuel(uint256 _type, uint256[] _heroIds, address _opponent, uint8 _background, uint8 _stat)",
];

// const url = "https://avax-dfk.gateway.pokt.network/v1/lb/6244818c00b9f0003ad1b619/ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc";
const url = "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc";

const provider = new ethers.providers.JsonRpcProvider(url);
const dfkDuelContract = new ethers.Contract(dfkDuelAddress, dfkDuelABI, provider);


dfkDuelContract.on(
  "DuelEntryCreated",
  (id, player, heroIds) => {
    console.log(`~~ DUEL ENTRY CREATED ~~\nID: ${id}\nPlayer: ${player}\nHero ID(s): ${heroIds[0]}\n----`);
  }
);

dfkDuelContract.on(
  "DuelEntryMatched",
  (duelId, duelEntryId, player1, player2) => {
    console.log(`## DUEL ENTRY MATCHED ##\nDuel ID: ${duelId}\nDuel Entry ID: ${duelEntryId}\nPlayer 1: ${player1}\nPlayer 2: ${player2}\n----`);
  }
);

dfkDuelContract.on(
  "DuelCreated",
  (duelId, player1, player2) => {
    console.log(`++ DUEL CREATED ++\nDuel ID: ${duelId}\nPlayer 1: ${player1}\nPlayer 2: ${player2}\n----`);//need to parse the tuples in this event
  }
);

dfkDuelContract.on(
  "DuelCompleted",
  (duelId, player1, player2) => {
    console.log(`$$ DUEL COMPLETED $$\nDuel ID: ${duelId}\nWinner: \n----`);//need to parse the tuples in this event
  }
);



