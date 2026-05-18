"use client";

import { FileText } from "lucide-react";
import type { Activity, ActivityLog } from "@/features/activities/types";

type CalendarDayLogsProps = {
  date: string | null;
  activities: Activity[];
  logs: ActivityLog[];
};

export function CalendarDayLogs({
  date,
  activities,
  logs,
}: CalendarDayLogsProps) {
  if (!date) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-card/70 px-5 py-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>

        <p className="mt-3 text-sm font-medium">Seleziona un giorno</p>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Tocca una data del calendario per vedere i progressi registrati.
        </p>
      </div>
    );
  }

  const dayLogs = logs
    .filter((log) => log.date === date && log.value > 0)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Giorno selezionato</p>
        <h3 className="text-lg font-semibold tracking-tight">
          {formatFullDate(date)}
        </h3>
      </div>

      {dayLogs.length > 0 ? (
        <div className="space-y-3">
          {dayLogs.map((log) => {
            const activity = activities.find(
              (item) => item.id === log.activityId,
            );

            if (!activity) return null;

            return (
              <article
                key={log.id}
                className="rounded-3xl border border-border bg-background/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate font-medium">{activity.name}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatLogValue(log, activity)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                    Log
                  </span>
                </div>

                {log.note ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {log.note}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-background/60 px-4 py-6 text-center">
          <p className="font-medium">Nessun log in questo giorno</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Non hai registrato attività positive per questa data.
          </p>
        </div>
      )}
    </div>
  );
}

function formatLogValue(log: ActivityLog, activity: Activity) {
  if (activity.type === "boolean") {
    return log.value >= 1 ? "Completata" : "Non completata";
  }

  return `${log.value} ${activity.unit ?? ""}`.trim();
}

function formatFullDate(date: string) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}