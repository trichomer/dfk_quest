const config = require("./config.json");
const fetch = require('node-fetch');
const RARITY_MAP = {
  4: "Mythic",
  3: "Legendary",
  2: "Rare",
  1: "Uncommon",
  0: "Common",
};

async function fetchHeroXP(wal) {
  const data = JSON.stringify({
    query: `query heroXP($wallet: String) {
      heroes(where: {owner: $wallet}, orderBy: xp, orderDirection: desc){
        id
        level
        generation
        rarity
        mainClass
        subClass
        xp
      }
    }`,
    variables: `{
        "wallet": "${wal}"
      }`,
  });

  const response = await fetch(
    'https://defi-kingdoms-community-api-gateway-co06z8vi.uc.gateway.dev/graphql',
    {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Node',
      },
    }
  );

  const json = await response.json();

  let arr = json.data.heroes
  
  arr.forEach((h) => {
    if ( h.xp === reqXP(h.level) ) { // if hero xp == xpReq, then log "heroId at max xp", else no logging
       console.log(`➕ Hero ${h.id} Lv.${h.level} ${RARITY_MAP[h.rarity]} ${h.mainClass}/${h.subClass} is at max XP`);
    }
  });
};
fetchHeroXP(config.testWallet);



function reqXP(level) {
    let xpReq;
    const nextLevel = level + 1;
    switch (true) {
      case level < 6:
        xpReq = nextLevel * 1000;
        break;
      case level < 9:
        xpReq = 4000 + (nextLevel - 5) * 2000;
        break;
      case level < 16:
        xpReq = 12000 + (nextLevel - 9) * 4000;
        break;
      case level < 36:
        xpReq = 40000 + (nextLevel - 16) * 5000;
        break;
      case level < 56:
        xpReq = 140000 + (nextLevel - 36) * 7500;
        break;
      case level >= 56:
        xpReq = 290000 + (nextLevel - 56) * 10000;
        break;
      default:
        xpReq = 0;
        break;
    }
    return xpReq;
};