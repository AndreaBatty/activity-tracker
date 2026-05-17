"use client";

import { FileText } from "lucide-react";
import type { Activity, ActivityLog } from "@/features/activities/types";
import { getRecentLogs } from "@/features/activities/selectors";

type RecentLogsProps = {
  activities: Activity[];
  logs: ActivityLog[];
};

export function RecentLogs({ activities, logs }: RecentLogsProps) {
  const recentLogs = getRecentLogs(logs, 5);

  if (recentLogs.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-border bg-card/70 px-5 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>

        <h2 className="mt-4 font-semibold">Nessun log ancora</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Registra una prima attività dalla dashboard per vedere qui lo storico
          recente.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">Storico</p>
        <h2 className="text-xl font-semibold tracking-tight">Ultimi log</h2>
      </div>

      <div className="space-y-3">
        {recentLogs.map((log) => {
          const activity = activities.find(
            (item) => item.id === log.activityId,
          );

          if (!activity) return null;

          return (
            <article
              key={log.id}
              className="rounded-3xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-foreground">
                    {activity.name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatLogValue(log, activity)} · {formatLogDate(log.date)}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  Log
                </span>
              </div>

              {log.note ? (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {log.note}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function formatLogValue(log: ActivityLog, activity: Activity) {
  if (activity.type === "boolean") {
    return log.value >= 1 ? "Completata" : "Non completata";
  }

  return `${log.value} ${activity.unit ?? ""}`.trim();
}

function formatLogDate(date: string) {
  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (date === todayKey) return "oggi";

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}
