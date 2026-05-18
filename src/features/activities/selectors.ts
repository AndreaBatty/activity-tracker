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

export function isActivityScheduledForDate(
  activity: Activity,
  dateKey: string,
) {
  if (activity.scheduleType === "anytime") return false;

  if (activity.scheduleType === "daily") return true;

  const date = new Date(dateKey);
  const weekday = date.getDay();

  return activity.daysOfWeek.includes(weekday);
}

export function getScheduledActivitiesForDate(
  activities: Activity[],
  dateKey: string,
) {
  return activities.filter((activity) =>
    isActivityScheduledForDate(activity, dateKey),
  );
}

export function getWeekDateKeys(referenceDate = new Date()) {
  const date = new Date(referenceDate);
  const day = date.getDay();

  // JS: domenica = 0. Per settimana lun-dom:
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  return Array.from({ length: 7 }).map((_, index) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(current.getDate()).padStart(2, "0");

    return `${year}-${month}-${dayOfMonth}`;
  });
}

export function getLogsForDateRange(
  logs: ActivityLog[],
  dateKeys: string[],
) {
  const dateSet = new Set(dateKeys);

  return logs.filter((log) => dateSet.has(log.date));
}

export function isLogTargetReached(log: ActivityLog, activities: Activity[]) {
  const activity = activities.find((item) => item.id === log.activityId);

  if (!activity) return false;

  return log.value >= activity.target;
}

export function getTargetReachedLogs(
  logs: ActivityLog[],
  activities: Activity[],
) {
  return logs.filter((log) => isLogTargetReached(log, activities));
}

export function getAnytimeActivities(activities: Activity[]) {
  return activities.filter((activity) => activity.scheduleType === "anytime");
}

export function getActivityStats(
  activity: Activity,
  logs: ActivityLog[],
) {
  const activityLogs = getLogsForActivity(logs, activity.id);

  const completedLogs = activityLogs.filter(
    (log) => log.value >= activity.target,
  );

  const totalValue = activityLogs.reduce((total, log) => {
    return total + log.value;
  }, 0);

  return {
    logs: activityLogs,
    totalLogs: activityLogs.length,
    completedLogs: completedLogs.length,
    totalValue,
  };
}