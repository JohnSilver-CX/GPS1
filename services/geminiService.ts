
import { SCHOOL_INFO, THOUGHTS } from "../constants.tsx";

/**
 * ENHANCED LOCAL KNOWLEDGE BASE
 * Now includes expanded GK, National Symbols, Detailed School Facilities, and Logic/Math teasers.
 */
const LOCAL_KNOWLEDGE: Record<string, string> = {
  // --- General Knowledge: Science & Nature ---
  "sky": "The sky looks blue because of how sunlight interacts with the atmosphere! It's like a big blue blanket for Earth. ☁️",
  "sun": "The sun is a giant star that gives us light and warmth! It's the center of our solar system. ☀️",
  "moon": "The moon is Earth's best friend in space! It reflects sunlight to glow at night. 🌙",
  "star": "Stars are giant glowing balls of gas far away in space. They're like distant suns! ✨",
  "water": "Water is life! It covers most of our planet and we need it to stay healthy. 💧",
  "dinosaur": "Dinosaurs were amazing creatures that lived millions of years ago. Some were huge like houses! 🦖",
  "planet": "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune! 🪐",
  "rainbow": "A rainbow has 7 colors: Red, Orange, Yellow, Green, Blue, Indigo, and Violet! (VIBGYOR) 🌈",
  "gravity": "Gravity is the invisible force that pulls everything toward the ground. It's why we don't float away! 🌍",
  
  // --- General Knowledge: Incredible India (Expanded) ---
  "india": "India is a beautiful country! Its capital is New Delhi. 🇮🇳",
  "capital": "The capital of India is New Delhi! 🏛️",
  "national bird": "The Peacock is the national bird of India. It's so colorful! 🦚",
  "national animal": "The Royal Bengal Tiger is the national animal of India. Roar! 🐯",
  "national flower": "The Lotus is the national flower of India. It grows in water! 🪷",
  "national fruit": "The Mango is the national fruit of India. It's so sweet and yummy! 🥭",
  "national tree": "The Banyan Tree is the national tree of India. Its roots hang down like swings! 🌳",
  "national anthem": "Our National Anthem is 'Jana Gana Mana', written by Rabindranath Tagore. 🇮🇳",
  "national song": "Our National Song is 'Vande Mataram', which means 'I bow to thee, Mother'. 🎶",
  "national river": "The Ganges (Ganga) is the holy and national river of India. 🌊",
  "national flag": "Our flag is the Tiranga (Tricolor) with Saffron, White, and Green, and the Ashoka Chakra in the middle! 🇮🇳",

  // --- Calculations & Logic ---
  "math": "Math is the language of the universe! I love numbers. Try my Math Whiz game in the Activity Zone to test your skills! 🧮",
  "logic": "Logic is thinking like a scientist! It helps us solve problems step-by-step. We teach this in our AI classes! 🧠",
  "calculate": "I can do quick math, but our teachers help you understand the 'why' behind the numbers. Come join our classes! 🔢",
  "2+2": "That's easy! 2 + 2 is 4. Like two shoes and two more shoes! 👟👟",
  "coding": "Coding is just logic for robots! It's like writing a recipe for a computer to follow. ⌨️🤖",
  
  // --- School Specifics (Expanded) ---
  "ai": "AI stands for Artificial Intelligence. At Gurukul, we teach computers how to think and help us solve problems! We start learning it from Class 1. 🤖",
  "school": `${SCHOOL_INFO.name} is the best place to learn and play! We've been a leader in education since ${SCHOOL_INFO.estd}. 🏫`,
  "admission": "Admissions are currently open for Playgroup to Class 5! Why don't you visit us? We'd love to show you around. 🎒",
  "principal": `${SCHOOL_INFO.principal} is our wonderful leader who has been guiding Gurukul for over 34 years! 👩‍🏫`,
  "computer lab": "Our computer lab is super high-tech with the latest AI learning tools for kids! 💻",
  "science lab": "We have a discovery zone where we do fun experiments to learn how the world works! 🧪",
  "music room": "We love singing and playing instruments in our music room. It's full of happy sounds! 🎵",
  "green campus": "We have lots of trees and plants that keep our school cool and fresh. It's a healthy place to grow! 🌳",
  "visit": "We would love to meet you! Call us at +91-94127 82755 to schedule a visit to our beautiful campus near Hazari Ka Piyau. 📍✨",
  "fee": `Our fee structure is designed to be affordable for all families. Please call us at ${SCHOOL_INFO.phone} for the latest details. 💰`,
  "contact": `You can reach us at ${SCHOOL_INFO.phone} or visit us near Hazari Ka Piyau, Meerut Cantt! 📞`,
  "location": `We are located at ${SCHOOL_INFO.address}. Come visit our beautiful green campus! 📍`,
  "safety": "Safety first! We have CCTV cameras everywhere and GPS-tracked transport to keep everyone safe. 🛡️",
  "transport": "We have safe school vans with GPS and helpful attendants to pick you up and drop you home! 🚐",

  // --- Values & Manners ---
  "kindness": "Being kind is a superpower! Always help your friends and be polite. ✨",
  "sharing": "Sharing is caring! When we share toys or knowledge, everyone gets happier. 🤝",

  // --- Fun Stuff & Jokes ---
  "joke": "Why did the student eat his homework? Because his teacher said it was a piece of cake! 😂",
  "riddle": "What has keys but can't open locks? A piano! 🎹",
};

/**
 * Generates a response using local logic (Instant and No API required)
 */
export const generateSchoolAssistantResponse = async (userPrompt: string) => {
  const promptLower = userPrompt.toLowerCase();
  const contactSuffix = `\n\nWant to see the magic in person? Call us at ${SCHOOL_INFO.phone} or visit our green campus! 🏫✨`;

  // 1. Check for specific keywords in our local knowledge base
  const keys = Object.keys(LOCAL_KNOWLEDGE).sort((a, b) => b.length - a.length);
  
  for (const key of keys) {
    if (promptLower.includes(key)) {
      return LOCAL_KNOWLEDGE[key] + contactSuffix;
    }
  }

  // 2. Handle greetings
  if (promptLower.match(/\b(hi|hello|hey|greetings|hola)\b/)) {
    return "Hi there! I'm Guru, your magical school robot buddy. I know about India, Math, Science, and everything about Gurukul School! Ask me anything! 👋" + contactSuffix;
  }

  // 3. Handle thanks
  if (promptLower.includes("thank")) {
    return "You're very welcome! Helping friends is what I was built for. Have a super day! 😊" + contactSuffix;
  }

  // 4. Handle time
  if (promptLower.includes("time")) {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Time to learn something new! ⏰`;
  }

  // 5. Default fallback
  return "Ooh, that's a clever question! Even a robot like me is still learning. Why don't you call our office at " + SCHOOL_INFO.phone + "? Our teachers are super smart! 🌟" + contactSuffix;
};

/**
 * Returns a daily thought from our pre-defined local list.
 */
export const getDailyThought = async () => {
  return THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
};
