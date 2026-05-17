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