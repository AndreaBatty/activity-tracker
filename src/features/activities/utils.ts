import type { Activity } from "./types";

export function getActivityProgress(activity: Activity) {
  if (activity.target <= 0) return 0;

  return Math.min((activity.value / activity.target) * 100, 100);
}

export function isActivityComplete(activity: Activity) {
  return activity.value >= activity.target;
}

export function getActivityStatus(activity: Activity) {
  return isActivityComplete(activity) ? "Completata" : "Da fare";
}

export function formatActivityTarget(activity: Activity) {
  return `${activity.target} ${activity.unit ?? "volta"}`;
}

export function formatActivityValue(activity: Activity) {
  return `${activity.value} / ${activity.target} ${
    activity.unit ?? "completato"
  }`;
}