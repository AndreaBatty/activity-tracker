import { addDays } from "./date";
import type { Activity, ActivityLog } from "./types";
import { getActivityStatus } from "./utils";

export function getLogsForActivity(
  logs: ActivityLog[],
  activityId: string,
) {
  return logs
    .filter((log) => log.activityId === activityId)
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        b.updatedAt.localeCompare(a.updatedAt),
    );
}

export function getTodayLogForActivity(
  logs: ActivityLog[],
  activityId: string,
  today: string,
) {
  return logs.find(
    (log) => log.activityId === activityId && log.date === today,
  );
}

export function getTodayValueForActivity(
  logs: ActivityLog[],
  activityId: string,
  today: string,
) {
  return getTodayLogForActivity(logs, activityId, today)?.value ?? 0;
}

export function withTodayProgress(
  activity: Activity,
  logs: ActivityLog[],
  today: string,
): Activity {
  const value = getTodayValueForActivity(logs, activity.id, today);

  const activityWithTodayValue = {
    ...activity,
    value,
  };

  return {
    ...activityWithTodayValue,
    status: getActivityStatus(activityWithTodayValue),
  };
}

export function getActivitiesWithTodayProgress(
  activities: Activity[],
  logs: ActivityLog[],
  today: string,
) {
  return activities.map((activity) =>
    withTodayProgress(activity, logs, today),
  );
}

export function getActiveActivities(activities: Activity[]) {
  return activities.filter((activity) => !activity.archived);
}

export function getRecentLogs(logs: ActivityLog[], limit = 5) {
  return [...logs]
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        b.updatedAt.localeCompare(a.updatedAt),
    )
    .slice(0, limit);
}

export function getDailyCompletedDates(logs: ActivityLog[]) {
  return new Set(
    logs
      .filter((log) => log.value > 0)
      .map((log) => log.date),
  );
}

export function getCurrentStreak(logs: ActivityLog[], today: string) {
  const completedDates = getDailyCompletedDates(logs);

  let streak = 0;
  let cursor = today;

  while (completedDates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function getLogCountByDate(logs: ActivityLog[]) {
  return logs.reduce<Record<string, number>>((acc, log) => {
    if (log.value <= 0) return acc;

    acc[log.date] = (acc[log.date] ?? 0) + 1;

    return acc;
  }, {});
}