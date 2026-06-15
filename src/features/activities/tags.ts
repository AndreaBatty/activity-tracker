import type { ActivityTag } from "./types";

export const activityTagOptions: {
  value: ActivityTag;
  label: string;
}[] = [
  {
    value: "study",
    label: "Studio",
  },
  {
    value: "fitness",
    label: "Fitness",
  },
  {
    value: "creativity",
    label: "Creatività",
  },
  {
    value: "wellness",
    label: "Benessere",
  },
  {
    value: "leisure",
    label: "Svago",
  },
  {
    value: "other",
    label: "Altro",
  },
];

export const activityTagLabels: Record<ActivityTag, string> = {
  study: "Studio",
  fitness: "Fitness",
  creativity: "Creatività",
  wellness: "Benessere",
  leisure: "Svago",
  other: "Altro",
};