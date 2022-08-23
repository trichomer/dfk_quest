// const allHeroes = [
//   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
//   22, 23, 24, 25, 26,
// ];

const fullStamHeroes = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

const heroesOnQuest = [1, 2];

const quests = [
  {
    name: "Fishing",
    professionHeroes: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    nonProfessionHeroes: [],
    contractAddress: "0x407ab39B3675f29A719476af6eb3B9E5d93969E6",
    level: 0,
    professionMaxAttempts: 1,
  },
  {
    name: "Foraging",
    professionHeroes: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 26],
    nonProfessionHeroes: [],
    contractAddress: "0xAd51199B453075C73FA106aFcAAD59f705EF7872",
    level: 0,
    professionMaxAttempts: 1,
  },
  {
    name: "No Stam",
    professionHeroes: [24, 25],
    nonProfessionHeroes: [],
    contractAddress: "0xAd51199B453075C73FA106aFcAAD59f705EF7872",
    level: 0,
    professionMaxAttempts: 1,
  },
  {
    name: "No Heroes",
    professionHeroes: [],
    nonProfessionHeroes: [],
    contractAddress: "0xAd51199B453075C73FA106aFcAAD59f705EF7872",
    level: 0,
    professionMaxAttempts: 1,
  },
];

const filterFullStamHeroes = quests.map((quest) => {
  // get full stamina heroes
  const hardCodedHeroes = quest.professionHeroes;
  const updatedHeroes = hardCodedHeroes.filter(
    (h) => fullStamHeroes.includes(h) && !heroesOnQuest.includes(h)
  );
  quest.professionHeroes = updatedHeroes;
  return quest;
});

filterFullStamHeroes.forEach((q) => {
  console.log(q.professionHeroes.length);
});
// console.log(filterFullStamHeroes);

const questsWithFullStamHeroes = filterFullStamHeroes.filter(
  // get quests that contain full stamina heroes
  (q) => q.professionHeroes.length > 0
);

console.log(questsWithFullStamHeroes);

const mapFullstamQuests = () => {
  const heroGroups = new Array();
  questsWithFullStamHeroes.forEach((quest) => {
    // chunk full stam heroes into groups of 6
    const allHeroes = quest.professionHeroes;
    let i = 0;
    while (i < allHeroes.length) {
      heroGroups.push(allHeroes.slice(i, (i += 6)));
    }
  });

  const updatedQuests = heroGroups.map((group) => {
    // duplicate quest info to contain hero groups of max size 6
    const quests = [...questsWithFullStamHeroes];
    const targetQuest = quests.filter((quest) =>
      quest.professionHeroes.includes(group[0])
    );
    return { ...targetQuest[0], professionHeroes: group };
  });
  return updatedQuests;
};

console.log(mapFullstamQuests());
// mapFullstamQuests();
