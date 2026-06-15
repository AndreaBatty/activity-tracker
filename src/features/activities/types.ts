export type ActivityType = "boolean" | "quantity" | "duration";

export type ActivityIcon = "pen" | "dumbbell" | "calendar" | "sparkles";

export type Activity = {
  id: string;
  name: string;
  description?: string;
  icon: ActivityIcon;
  color: ActivityColor;
  type: ActivityType;
  unit: string | null;
  value: number;
  target: number;
  status: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  scheduleType: ActivityScheduleType;
  daysOfWeek: number[];
  tag: ActivityTag;
};

export type ActivityLog = {
  id: string;
  activityId: string;
  date: string;
  value: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type NewActivityInput = {
  name: string;
  description?: string;
  icon: ActivityIcon;
  color: ActivityColor;
  type: ActivityType;
  scheduleType: ActivityScheduleType;
  daysOfWeek: number[];
  unit?: string | null;
  target: number;
  tag: ActivityTag;
};

export type UpdateActivityProgressInput = {
  id: string;
  value: number;
};

export type UpsertActivityLogInput = {
  activityId: string;
  date: string;
  value: number;
  note?: string;
};

export type ActivityColor = "olive" | "amber" | "rose" | "sky" | "violet";

export type ActivityScheduleType = "daily" | "custom" | "anytime";

export type ActivityTag =
  | "study"
  | "fitness"
  | "creativity"
  | "wellness"
  | "leisure"
  | "other";
