export const SPEAKING_PARTS = [
  { value: 1, label: "Part 1 - Introduction & Interview", duration: 180 },
  { value: 2, label: "Part 2 - Individual Long Turn", duration: 120, preparationTime: 60 },
  { value: 3, label: "Part 3 - Two-way Discussion", duration: 240 },
] as const;

export const SPEAKING_TOPICS = [
  "Work and Studies",
  "Hometown and Home",
  "Family",
  "Friends",
  "Hobbies",
  "Travel",
  "Food",
  "Technology",
  "Education",
  "Environment",
  "Health",
  "Culture",
  "Media",
  "Sports",
  "Shopping",
  "Transport",
] as const;

export const DIFFICULTY_LEVELS = [
  { value: "Easy", label: "Easy", color: "green" },
  { value: "Medium", label: "Medium", color: "yellow" },
  { value: "Hard", label: "Hard", color: "red" },
] as const;

export const SPEAKING_CATEGORIES = [
  "Personal",
  "People",
  "Places",
  "Objects",
  "Events",
  "Experience",
  "Abstract",
] as const;

export const ASSESSMENT_CRITERIA = [
  {
    name: "Fluency and Coherence",
    description: "Ability to speak at length without noticeable effort or loss of coherence",
    weight: 25,
  },
  {
    name: "Lexical Resource",
    description: "Range and accuracy of vocabulary usage",
    weight: 25,
  },
  {
    name: "Grammatical Range and Accuracy",
    description: "Range and accuracy of grammatical structures",
    weight: 25,
  },
  {
    name: "Pronunciation",
    description: "Ability to use pronunciation features to enhance communication",
    weight: 25,
  },
] as const;

export type SpeakingPart = (typeof SPEAKING_PARTS)[number]["value"];
export type SpeakingTopic = (typeof SPEAKING_TOPICS)[number];
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]["value"];
export type SpeakingCategory = (typeof SPEAKING_CATEGORIES)[number];
