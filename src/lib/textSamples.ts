export const getRandomText = () => {
  const texts = [
    "Did you know that a group of flamingos is called a 'flamboyance'? These vibrant birds often gather in large numbers, creating a stunning display of color against the water.",
    "The shortest war in history lasted only 38 to 45 minutes. It was fought between Britain and the Sultanate of Zanzibar on August 27, 1896.",
    "Butterflies taste with their feet. This allows them to determine if a leaf is suitable to lay their eggs on simply by landing on it.",
    "A single cloud can weigh over a million pounds. This is because they are made of millions of tiny water droplets or ice crystals.",
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "The average person walks the equivalent of three times around the world in their lifetime. That's a lot of steps!",
    "There are more possible iterations of a game of chess than there are atoms in the known universe. The possibilities are truly immense.",
    "A 'jiffy' is an actual unit of time. It's equal to 1/100th of a second.",
    "Cows have best friends and can become stressed when separated from them. Social bonds are important, even in the animal kingdom.",
    "The Great Wall of China is not visible from space with the naked eye. This is a common myth that has been debunked.",
    "Octopuses have three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body.",
    "The inventor of the microwave oven, Percy Spencer, first discovered its effects when a chocolate bar melted in his pocket. A sweet invention story!",
    "The konigsberg bridge problem, a famous puzzle, led to the development of graph theory in mathematics. Sometimes puzzles inspire new fields of study.",
    "A day on Venus is longer than a year on Venus. It takes longer to rotate on its axis than to orbit the sun.",
    "The smell of cut grass is actually a plant distress signal. It releases chemicals as a warning to surrounding plants.",
    "Vending machines kill more people than sharks each year. This is often due to people trying to rock them to get free items.",
    "The dot over the lowercase 'i' and 'j' is called a tittle. It's a small detail with a specific name.",
    "Penguins have an organ above their eyes that converts seawater into freshwater. This allows them to drink while at sea.",
    "The world's oldest known living tree is a Great Basin bristlecone pine named Methuselah, over 4,850 years old. It has witnessed millennia of history.",
    "Astronauts can grow up to two inches taller in space. This is because the lack of gravity allows the spine to expand.",
  ];
  return texts[Math.floor(Math.random() * texts.length)];
};
