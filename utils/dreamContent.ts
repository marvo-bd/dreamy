// A collection of content to display during the transition/loading phase.

const statusMessages: string[] = [
  "Entering the dream world...",
  "Translating subconscious symbols...",
  "Navigating the astral plane...",
  "Consulting the collective unconscious...",
  "Visualizing the narrative...",
  "Decoding hidden meanings...",
  "Harmonizing with dream frequencies...",
];

const dreamQuotes: string[] = [
  "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt",
  "\"A dream you dream alone is only a dream. A dream you dream together is reality.\" - Yoko Ono",
  "\"All that we see or seem is but a dream within a dream.\" - Edgar Allan Poe",
  "\"Dreams are illustrations from the book your soul is writing about you.\" - Marsha Norman",
  "\"The interpretation of dreams is the royal road to a knowledge of the unconscious activities of the mind.\" - Sigmund Freud",
];

const dreamFacts: string[] = [
  "Fact: You can't read text or tell time accurately in most dreams.",
  "Fact: On average, you have about 4 to 7 dreams each night.",
  "Fact: Not everyone dreams in color. Some people dream exclusively in black and white.",
  "Fact: Blind people often have more vivid dreams involving sound, smell, and touch.",
  "Fact: Animals, including mammals and birds, also experience REM sleep and are believed to dream.",
];

const allContent: string[] = [...statusMessages, ...dreamQuotes, ...dreamFacts];

/**
 * Shuffles an array in place.
 * @param array The array to shuffle.
 */
const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * Gets a specified number of random, unique items from the content collection.
 * @param count The number of items to return.
 * @returns An array of unique strings.
 */
export const getRandomContent = (count: number): string[] => {
  const shuffled = [...allContent];
  shuffleArray(shuffled);
  return shuffled.slice(0, count);
};