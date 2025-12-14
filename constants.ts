import { StoryPhase, Character } from './types';

export const STORY_PHASES: StoryPhase[] = [
  {
    id: 1,
    title: "The Founding",
    description: "José Arcadio Buendía and Úrsula Iguarán leave Riohacha to find a new home. They dream of a city of mirrors made of ice and name it Macondo.",
    imagePrompt: "A group of weary travelers setting up tents in a jungle clearing near a river with polished stones like prehistoric eggs, sepia sketch style, mysterious atmosphere"
  },
  {
    id: 2,
    title: "The Gypsies & Ice",
    description: "Melquíades arrives with magnets and magnifying glasses. José Arcadio Buendía discovers ice, believing it to be the greatest invention of our time.",
    imagePrompt: "An old gypsy holding a block of glowing ice in a tropical tent, amazed onlookers, rusty lake art style, dark outlines, muted colors"
  },
  {
    id: 3,
    title: "The Insomnia Plague",
    description: "Rebecca arrives bringing the sickness. The town forgets the names of things. They label everything: 'This is a cow, she must be milked'.",
    imagePrompt: "A cow with a sign hanging on it that says 'COW', surreal, foggy atmosphere, hand-drawn vintage style"
  },
  {
    id: 4,
    title: "The 32 Wars",
    description: "Colonel Aureliano Buendía starts thirty-two uprisings and loses them all. He retires to make little gold fishes in his workshop.",
    imagePrompt: "A tired soldier in a workshop crafting tiny golden fish, shadows, solitude, melancholic sketch"
  },
  {
    id: 5,
    title: "The Banana Company",
    description: "The Americans arrive. Macondo is transformed. The massacre at the train station happens, but later, no one remembers it.",
    imagePrompt: "A train station filled with yellow butterflies and shadows, ominous atmosphere, vintage illustration style"
  },
  {
    id: 6,
    title: "The Rains",
    description: "It rained for four years, eleven months, and two days. The town dissolves in the dampness.",
    imagePrompt: "A wooden house rotting in heavy rain, overgrown vegetation, gloomy and wet, pencil sketch style"
  },
  {
    id: 7,
    title: "The End",
    description: "Aureliano Babilonia deciphers the parchments. A hurricane of wind wipes Macondo from the face of the earth.",
    imagePrompt: "A man reading parchments while a whirlwind destroys a house made of mirrors, apocalyptic sketch, swirling lines"
  }
];

export const BUENDIA_FAMILY: Character[] = [
  // --- External Key Figures (Gen 0) ---
  {
    id: 'ext_melquiades',
    name: "Melquíades",
    relation: "The Prophet",
    description: "Bring science and the parchments. Even after death, his ghost returns to guide the family.",
    imagePrompt: "Portrait of an old gypsy with a heavy hat and raven feathers, writing on ancient parchments, mysterious, rusty lake style",
    generation: 0,
    type: 'EXTERNAL',
    symbol: 'Scroll'
  },
  {
    id: 'ext_pilar',
    name: "Pilar Ternera",
    relation: "The Seer",
    description: "Card reader. bore children to two Buendia men. Lived to be over 140, witnessing the entire cycle.",
    imagePrompt: "Portrait of a laughing woman holding tarot cards in a smoky room, mystical atmosphere, rusty lake style",
    generation: 0,
    type: 'EXTERNAL',
    symbol: 'Sparkles'
  },

  // --- Generation 1 ---
  {
    id: 'gen1_jose',
    name: "José Arcadio Buendía",
    relation: "The Patriarch",
    description: "Founder of Macondo. Obsessed with science. Died tied to a chestnut tree speaking Latin.",
    imagePrompt: "Portrait of a wild-eyed man tied to a large chestnut tree, surrounded by ghosts, surreal sketch, rusty lake style",
    generation: 1,
    type: 'FAMILY',
    partner: 'gen1_ursula',
    symbol: 'FlaskConical'
  },
  {
    id: 'gen1_ursula',
    name: "Úrsula Iguarán",
    relation: "The Matriarch",
    description: "The pillar of the house. Lived 115+ years. Died blind but kept the house standing.",
    imagePrompt: "Portrait of a tiny, ancient woman in colonial dress, blind white eyes, holding a small candy animal, sepia sketch",
    generation: 1,
    type: 'FAMILY',
    partner: 'gen1_jose',
    symbol: 'Home'
  },

  // --- Generation 2 ---
  {
    id: 'gen2_jose_arcadio',
    name: "José Arcadio",
    relation: "The Prodigal Son",
    description: "Massive strength. Married his adopted sister Rebeca. Died mysteriously with the smell of gunpowder.",
    imagePrompt: "Portrait of a giant man with tattoos of anchors, rough appearance, gunpowder smoke, rusty lake style",
    generation: 2,
    type: 'FAMILY',
    parents: ['gen1_jose', 'gen1_ursula'],
    symbol: 'Anchor'
  },
  {
    id: 'gen2_aureliano',
    name: "Col. Aureliano Buendía",
    relation: "The Warrior",
    description: "Fought 32 wars, lost them all. Fathered 17 sons. Died making gold fish.",
    imagePrompt: "Portrait of a colonel in uniform, solemn face, standing in a circle of chalk, holding a gold fish, vintage style",
    generation: 2,
    type: 'FAMILY',
    parents: ['gen1_jose', 'gen1_ursula'],
    symbol: 'Fish'
  },
  {
    id: 'gen2_amaranta',
    name: "Amaranta",
    relation: "The Virgin",
    description: "Rejected all suitors. Wore a black bandage on her hand until death. Wove her own shroud.",
    imagePrompt: "Portrait of a severe woman with a black bandage on her hand, weaving a white shroud, rusty lake style",
    generation: 2,
    type: 'FAMILY',
    parents: ['gen1_jose', 'gen1_ursula'],
    symbol: 'Scissors'
  },
  {
    id: 'gen2_rebeca',
    name: "Rebeca",
    relation: "The Orphan",
    description: "Adopted. Ate earth and whitewash. Married José Arcadio. Lived in solitude.",
    imagePrompt: "Portrait of a woman with a bag of earth, looking guilty, cracks in the wall behind her, surreal sketch",
    generation: 2,
    type: 'FAMILY',
    parents: ['gen1_jose', 'gen1_ursula'],
    symbol: 'Bone'
  },

  // --- Generation 3 ---
  {
    id: 'gen3_arcadio',
    name: "Arcadio",
    relation: "The Dictator",
    description: "Cruel ruler of Macondo. Executed by firing squad. 'To the memory of the liberals!'",
    imagePrompt: "Portrait of a man in military uniform standing before a firing squad wall, defiant, rusty lake style",
    generation: 3,
    type: 'FAMILY',
    parents: ['gen2_jose_arcadio'],
    symbol: 'Sword'
  },
  {
    id: 'gen3_aureliano_jose',
    name: "Aureliano José",
    relation: "The Obsessed",
    description: "Obsessed with his aunt Amaranta. Shot in the back at the theatre.",
    imagePrompt: "Portrait of a young soldier with a bleeding chest, holding a theatre ticket, surreal atmosphere",
    generation: 3,
    type: 'FAMILY',
    parents: ['gen2_aureliano'],
    symbol: 'Ticket'
  },
  {
    id: 'gen3_17_aurelianos',
    name: "The 17 Aurelianos",
    relation: "The Ash Wednesday Sons",
    description: "Sons of the Colonel. All marked with an Ash Wednesday cross. All assassinated.",
    imagePrompt: "A group of shadowy men, each with an ash cross on their forehead, mysterious, hunting, rusty lake style",
    generation: 3,
    type: 'FAMILY',
    parents: ['gen2_aureliano'],
    symbol: 'Cross'
  },

  // --- Generation 4 ---
  {
    id: 'gen4_remedios',
    name: "Remedios the Beauty",
    relation: "The Ascended",
    description: "Too beautiful for this world. Ascended to heaven while folding sheets.",
    imagePrompt: "Portrait of a glowing woman floating into the sky wrapped in white sheets, yellow butterflies, ethereal",
    generation: 4,
    type: 'FAMILY',
    parents: ['gen3_arcadio'],
    symbol: 'Wind'
  },
  {
    id: 'gen4_jose_segundo',
    name: "José Arcadio Segundo",
    relation: "The Survivor",
    description: "Survived the Banana Massacre. Reading parchments in Melquíades' room until death.",
    imagePrompt: "Portrait of a gaunt man surrounded by books and parchment, haunted eyes, monochrome sketch",
    generation: 4,
    type: 'FAMILY',
    parents: ['gen3_arcadio'],
    symbol: 'BookOpen'
  },
  {
    id: 'gen4_aureliano_segundo',
    name: "Aureliano Segundo",
    relation: "The Hedonist",
    description: "Lived with wife Fernanda and mistress Petra. His livestock multiplied magically.",
    imagePrompt: "Portrait of a fat, happy man playing an accordion, surrounded by cows and rabbits, festive but surreal",
    generation: 4,
    type: 'FAMILY',
    parents: ['gen3_arcadio'],
    symbol: 'CircleDollarSign'
  },
  {
    id: 'gen4_fernanda',
    name: "Fernanda del Carpio",
    relation: "The Queen",
    description: "Wife of Aureliano Segundo. Religious, rigid, brought the golden chamber pot.",
    imagePrompt: "Portrait of a woman in a heavy velvet queen's robe, holding a golden chamber pot, stern face, rusty lake style",
    generation: 4,
    type: 'EXTERNAL',
    partner: 'gen4_aureliano_segundo',
    symbol: 'Crown'
  },
  {
    id: 'gen4_petra',
    name: "Petra Cotes",
    relation: "The Mistress",
    description: "The love of Aureliano Segundo's life. Her love made nature fertile.",
    imagePrompt: "Portrait of a woman with a tiger, abundant vegetation in background, warm colors, surreal sketch",
    generation: 4,
    type: 'EXTERNAL',
    symbol: 'PawPrint'
  },

  // --- Generation 5 ---
  {
    id: 'gen5_meme',
    name: "Meme (Renata)",
    relation: "The Silenced",
    description: "Loved a mechanic. Sent to a convent. Took a vow of silence.",
    imagePrompt: "Portrait of a nun with a sad face, surrounded by yellow butterflies, iron bars in foreground, rusty lake style",
    generation: 5,
    type: 'FAMILY',
    parents: ['gen4_aureliano_segundo', 'gen4_fernanda'],
    symbol: 'Music'
  },
  {
    id: 'gen5_jose_arcadio_ii',
    name: "José Arcadio (II)",
    relation: "The Pope",
    description: "Sent to Rome to be Pope. Returned corrupt. Drowned by children for gold.",
    imagePrompt: "Portrait of a man in decadent robes, water dripping from him, gold coins floating, dark atmosphere",
    generation: 5,
    type: 'FAMILY',
    parents: ['gen4_aureliano_segundo', 'gen4_fernanda'],
    symbol: 'Droplets'
  },
  {
    id: 'gen5_amaranta_ursula',
    name: "Amaranta Úrsula",
    relation: "The Modern Woman",
    description: "Returned from Europe. Unknowingly fell in love with her nephew Aureliano.",
    imagePrompt: "Portrait of a fashionable woman with short hair, holding a silver necklace, modern but tragic, sketch style",
    generation: 5,
    type: 'FAMILY',
    parents: ['gen4_aureliano_segundo', 'gen4_fernanda'],
    symbol: 'Footprints'
  },

  // --- Generation 6 ---
  {
    id: 'gen6_aureliano',
    name: "Aureliano Babilonia",
    relation: "The Scholar",
    description: "Bastard son of Meme. Hid in the house. Deciphered the manuscripts.",
    imagePrompt: "Portrait of a scholarly man reading Sanskrit parchments, wind blowing papers, ants at his feet, rusty lake style",
    generation: 6,
    type: 'FAMILY',
    parents: ['gen5_meme'],
    symbol: 'FileText'
  },

  // --- Generation 7 ---
  {
    id: 'gen7_child',
    name: "The Child",
    relation: "The End of the Line",
    description: "Born with a pig's tail. Eaten by ants. The prophecy is fulfilled.",
    imagePrompt: "A newborn baby with a small pig's tail, being carried away by a line of giant ants, apocalyptic, surreal sketch",
    generation: 7,
    type: 'FAMILY',
    parents: ['gen6_aureliano', 'gen5_amaranta_ursula'],
    symbol: 'Bug'
  }
];
