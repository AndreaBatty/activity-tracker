"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { activities as mockActivities } from "@/app/data/mockActivities";
import type {
  Activity,
  ActivityLog,
  NewActivityInput,
  UpsertActivityLogInput,
} from "./types";
import { getActivityStatus } from "./utils";
import { getTodayKey } from "./date";

type UpdateActivityInput = {
  name: string;
  description?: string;
  icon: Activity["icon"];
  color: Activity["color"];
  type: Activity["type"];
  scheduleType: Activity["scheduleType"];
  daysOfWeek: number[];
  unit?: string | null;
  target: number;
};

type ActivityStore = {
  activities: Activity[];
  logs: ActivityLog[];

  addActivity: (input: NewActivityInput) => void;
  updateActivityProgress: (id: string, value: number) => void;
  upsertActivityLog: (input: UpsertActivityLogInput) => void;
  updateActivity: (id: string, input: UpdateActivityInput) => void;
  deleteActivity: (id: string) => void;
  updateActivityLog: (
    id: string,
    input: {
      date: string;
      value: number;
      note?: string;
    },
  ) => void;
  deleteActivityLog: (id: string) => void;
};

function createActivity(input: NewActivityInput): Activity {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description || "",
    icon: input.icon,
    color: input.color,
    type: input.type,
    unit: input.type === "boolean" ? null : input.unit || null,
    value: 0,
    target: input.type === "boolean" ? 1 : input.target,
    status: "Da fare",
    archived: false,
    createdAt: now,
    updatedAt: now,
    scheduleType: input.scheduleType,
    daysOfWeek: input.daysOfWeek,
  };
}

function createInitialLogsFromMockActivities(): ActivityLog[] {
  const today = getTodayKey();
  const now = new Date().toISOString();

  return mockActivities
    .filter((activity) => activity.value > 0)
    .map((activity) => ({
      id: crypto.randomUUID(),
      activityId: activity.id,
      date: today,
      value: activity.value,
      note: "",
      createdAt: now,
      updatedAt: now,
    }));
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set) => ({
      activities: mockActivities,
      logs: createInitialLogsFromMockActivities(),

      addActivity: (input) =>
        set((state) => ({
          activities: [createActivity(input), ...state.activities],
        })),

      upsertActivityLog: (input) =>
        set((state) => {
          const now = new Date().toISOString();

          const existingLog = state.logs.find(
            (log) =>
              log.activityId === input.activityId && log.date === input.date,
          );

          const nextLogs = existingLog
            ? state.logs.map((log) => {
                if (log.id !== existingLog.id) return log;

                return {
                  ...log,
                  value: Math.max(0, input.value),
                  note: input.note || "",
                  updatedAt: now,
                };
              })
            : [
                {
                  id: crypto.randomUUID(),
                  activityId: input.activityId,
                  date: input.date,
                  value: Math.max(0, input.value),
                  note: input.note || "",
                  createdAt: now,
                  updatedAt: now,
                },
                ...state.logs,
              ];

          const today = getTodayKey();

          const nextActivities = state.activities.map((activity) => {
            if (activity.id !== input.activityId) return activity;

            if (input.date !== today) {
              return activity;
            }

            const updatedActivity = {
              ...activity,
              value: Math.max(0, input.value),
              updatedAt: now,
            };

            return {
              ...updatedActivity,
              status: getActivityStatus(updatedActivity),
            };
          });

          return {
            logs: nextLogs,
            activities: nextActivities,
          };
        }),

      updateActivityProgress: (id, value) =>
        set((state) => {
          const today = getTodayKey();
          const now = new Date().toISOString();

          const existingLog = state.logs.find(
            (log) => log.activityId === id && log.date === today,
          );

          const nextLogs = existingLog
            ? state.logs.map((log) => {
                if (log.id !== existingLog.id) return log;

                return {
                  ...log,
                  value: Math.max(0, value),
                  updatedAt: now,
                };
              })
            : [
                {
                  id: crypto.randomUUID(),
                  activityId: id,
                  date: today,
                  value: Math.max(0, value),
                  note: "",
                  createdAt: now,
                  updatedAt: now,
                },
                ...state.logs,
              ];

          const nextActivities = state.activities.map((activity) => {
            if (activity.id !== id) return activity;

            const nextValue = Math.max(0, value);

            const updatedActivity = {
              ...activity,
              value: nextValue,
              updatedAt: now,
            };

            return {
              ...updatedActivity,
              status: getActivityStatus(updatedActivity),
            };
          });

          return {
            logs: nextLogs,
            activities: nextActivities,
          };
        }),

      updateActivity: (id, input) =>
        set((state) => ({
          activities: state.activities.map((activity) => {
            if (activity.id !== id) return activity;

            const updatedActivity: Activity = {
              ...activity,
              name: input.name,
              description: input.description || "",
              icon: input.icon,
              color: input.color,
              type: input.type,
              unit: input.type === "boolean" ? null : input.unit || null,
              target: input.type === "boolean" ? 1 : input.target,
              updatedAt: new Date().toISOString(),
              scheduleType: input.scheduleType,
              daysOfWeek: input.daysOfWeek,
            };

            return {
              ...updatedActivity,
              status: getActivityStatus(updatedActivity),
            };
          }),
        })),

      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
          logs: state.logs.filter((log) => log.activityId !== id),
        })),
      updateActivityLog: (id, input) =>
        set((state) => {
          const now = new Date().toISOString();

          const targetLog = state.logs.find((log) => log.id === id);

          if (!targetLog) return state;

          const today = getTodayKey();

          const nextLogs = state.logs.map((log) => {
            if (log.id !== id) return log;

            return {
              ...log,
              date: input.date,
              value: Math.max(0, input.value),
              note: input.note || "",
              updatedAt: now,
            };
          });

          const nextActivities = state.activities.map((activity) => {
            if (activity.id !== targetLog.activityId) return activity;

            if (input.date !== today && targetLog.date !== today) {
              return activity;
            }

            const todayLog = nextLogs.find(
              (log) => log.activityId === activity.id && log.date === today,
            );

            const updatedActivity = {
              ...activity,
              value: todayLog?.value ?? 0,
              updatedAt: now,
            };

            return {
              ...updatedActivity,
              status: getActivityStatus(updatedActivity),
            };
          });

          return {
            logs: nextLogs,
            activities: nextActivities,
          };
        }),

      deleteActivityLog: (id) =>
        set((state) => {
          const targetLog = state.logs.find((log) => log.id === id);

          if (!targetLog) return state;

          const today = getTodayKey();

          const nextLogs = state.logs.filter((log) => log.id !== id);

          const nextActivities = state.activities.map((activity) => {
            if (activity.id !== targetLog.activityId) return activity;

            if (targetLog.date !== today) {
              return activity;
            }

            const todayLog = nextLogs.find(
              (log) => log.activityId === activity.id && log.date === today,
            );

            const updatedActivity = {
              ...activity,
              value: todayLog?.value ?? 0,
              updatedAt: new Date().toISOString(),
            };

            return {
              ...updatedActivity,
              status: getActivityStatus(updatedActivity),
            };
          });

          return {
            logs: nextLogs,
            activities: nextActivities,
          };
        }),
    }),

    {
      name: "activity-tracker-storage",
    },
  ),
);
