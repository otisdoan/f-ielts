export const LISTENING_SOURCES = [
  "YouPass Collect",
  "Actual Tests",
  "Cambridge",
  "Forecast",
  "Custom",
] as const;

export const SECTION_TYPES = [
  { value: "full", label: "Full Test (4 Parts)" },
  { value: "part1", label: "Section 1" },
  { value: "part2", label: "Section 2" },
  { value: "part3", label: "Section 3" },
  { value: "part4", label: "Section 4" },
] as const;

export const QUESTION_GROUP_TYPES = [
  { value: "gap_fill", label: "Gap Filling / Note Completion" },
  { value: "multiple_choice_one", label: "Multiple Choice (One Answer)" },
  { value: "multiple_choice_many", label: "Multiple Choice (Many Answers)" },
  { value: "matching", label: "Matching Information / Features" },
  { value: "map_labeling", label: "Map / Diagram Labeling" },
] as const;

export type ListeningSource = (typeof LISTENING_SOURCES)[number];
export type SectionType = (typeof SECTION_TYPES)[number]["value"];
export type QuestionGroupType = (typeof QUESTION_GROUP_TYPES)[number]["value"];
