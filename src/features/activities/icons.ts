import {
  CalendarDays,
  Dumbbell,
  PenLine,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { ActivityIcon } from "./types";

export const activityIcons: Record<ActivityIcon, LucideIcon> = {
  pen: PenLine,
  dumbbell: Dumbbell,
  calendar: CalendarDays,
  sparkles: Sparkles,
};

export const activityIconOptions: {
  value: ActivityIcon;
  label: string;
}[] = [
  {
    value: "pen",
    label: "Scrittura",
  },
  {
    value: "dumbbell",
    label: "Fitness",
  },
  {
    value: "calendar",
    label: "Routine",
  },
  {
    value: "sparkles",
    label: "Altro",
  },
];