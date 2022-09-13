const https = require('https');

const data = JSON.stringify({
  query: `query advancedBasics {
    hmya1adv: heroes(
      orderBy: salePrice
      orderDirection: asc
      where: {
        salePrice_lte: "100000000000000000000"
        salePrice_not: null
        privateAuctionProfile: null
        mainClass_in: [
          "Warrior"
          "Knight"
          "Archer"
          "Thief"
          "Pirate"
          "Monk"
          "Wizard"
          "Priest"
          "Berserker"
          "Seer"
        ]
        active1_contains: "Advanced"
        summonsRemaining: 10
        network: "hmy"
      }) 
  {...frag}
  	hmya2adv: heroes(
      orderBy: salePrice
      orderDirection: asc
      where: {
        salePrice_lte: "100000000000000000000"
        salePrice_not: null
        privateAuctionProfile: null
        mainClass_in: [
          "Warrior"
          "Knight"
          "Archer"
          "Thief"
          "Pirate"
          "Monk"
          "Wizard"
          "Priest"
          "Berserker"
          "Seer"
        ]
        active2_contains: "Advanced"
        summonsRemaining: 10
        network: "hmy"
      }) 
  {...frag}
  	hmyp1adv: heroes(
      orderBy: salePrice
      orderDirection: asc
      where: {
        salePrice_lte: "100000000000000000000"
        salePrice_not: null
        privateAuctionProfile: null
        mainClass_in: [
          "Warrior"
          "Knight"
          "Archer"
          "Thief"
          "Pirate"
          "Monk"
          "Wizard"
          "Priest"
          "Berserker"
          "Seer"
        ]
        passive1_contains: "Advanced"
        summonsRemaining: 10
        network: "hmy"
      }) 
  {...frag}
  	hmyp2adv: heroes(
      orderBy: salePrice
      orderDirection: asc
      where: {
        salePrice_lte: "100000000000000000000"
        salePrice_not: null
        privateAuctionProfile: null
        mainClass_in: [
          "Warrior"
          "Knight"
          "Archer"
          "Thief"
          "Pirate"
          "Monk"
          "Wizard"
          "Priest"
          "Berserker"
          "Seer"
        ]
        passive2_contains: "Advanced"
        summonsRemaining: 10
        network: "hmy"
      }) 
  {...frag}
  dfka1adv: heroes(
      orderBy: salePrice
      orderDirection: asc
      where: {
        salePrice_lte: "120000000000000000000"
        salePrice_not: null
        privateAuctionProfile: null
        mainClass_in: [
          "Warrior"
          "Knight"
          "Archer"
          "Thief"
          "Pirate"
          "Monk"
          "Wizard"
          "Priest"
          "Berserker"
          "Seer"
        ]
        active1_contains: "Advanced"
        summonsRemaining: 10
        network: "dfk"
      }) 
  {...frag}
  	dfka2adv: heroes(
      orderBy: salePrice
      orderDirection: asc
      where: {
        salePrice_lte: "120000000000000000000"
        salePrice_not: null
        privateAuctionProfile: null
        mainClass_in: [
          "Warrior"
          "Knight"
          "Archer"
          "Thief"
          "Pirate"
          "Monk"
          "Wizard"
          "Priest"
          "Berserker"
          "Seer"
        ]
        active2_contains: "Advanced"
        summonsRemaining: 10
        network: "dfk"
      }) 
  {...frag}
  	dfkp1adv: heroes(
      orderBy: salePrice
      orderDirection: asc
      where: {
        salePrice_lte: "120000000000000000000"
        salePrice_not: null
        privateAuctionProfile: null
        mainClass_in: [
          "Warrior"
          "Knight"
          "Archer"
          "Thief"
          "Pirate"
          "Monk"
          "Wizard"
          "Priest"
          "Berserker"
          "Seer"
        ]
        passive1_contains: "Advanced"
        summonsRemaining: 10
        network: "dfk"
      }) 
  {...frag}
  	dfkp2adv: heroes(
      orderBy: salePrice
      orderDirection: asc
      where: {
        salePrice_lte: "120000000000000000000"
        salePrice_not: null
        privateAuctionProfile: null
        mainClass_in: [
          "Warrior"
          "Knight"
          "Archer"
          "Thief"
          "Pirate"
          "Monk"
          "Wizard"
          "Priest"
          "Berserker"
          "Seer"
        ]
        passive2_contains: "Advanced"
        summonsRemaining: 10
        network: "dfk"
      }) 
  {...frag}
}
fragment frag on Hero {
    id
    level
    rarity
    generation
    mainClass
    subClass
    salePrice
    active1
    active2
    passive1
    passive2
    network
}`,
});

const options = {
  hostname: 'defi-kingdoms-community-api-gateway-co06z8vi.uc.gateway.dev',
  path: '/graphql',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'User-Agent': 'Node',
  },
};

const req = https.request(options, (res) => {
  let data = '';
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', (d) => {
    data += d;
  });
  res.on('end', () => {
    console.log(JSON.parse(data).data);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();