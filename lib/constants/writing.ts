export const WRITING_SOURCES = [
  "YouPass Collect",
  "Actual Tests",
  "Forecast",
  "Custom"
] as const;

export const TASK1_SUB_TYPES = [
  "Line Graph",
  "Bar Chart",
  "Pie Chart",
  "Table",
  "Mixed Graph",
  "Map",
  "Process"
] as const;

export const TASK2_SUB_TYPES = [
  "Education",
  "Environment",
  "Work and Careers",
  "Government & Criminal Justice",
  "Science and Technology",
  "Health",
  "Entertainment",
  "Society and Culture",
  "Economics",
  "Other Topics",
  "Travel and Transportation"
] as const;

export type WritingSource = typeof WRITING_SOURCES[number];
export type Task1SubType = typeof TASK1_SUB_TYPES[number];
export type Task2SubType = typeof TASK2_SUB_TYPES[number];
