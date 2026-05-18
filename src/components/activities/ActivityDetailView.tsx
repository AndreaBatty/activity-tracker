"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Activity, ActivityLog } from "@/features/activities/types";
import { activityIcons } from "@/features/activities/icons";
import {
  formatActivityTarget,
  getActivityProgress,
  isActivityComplete,
} from "@/features/activities/utils";
import { useActivityStore } from "@/features/activities/store";
import { LogActivityDialog } from "@/components/activities/LogActivityDialog";
import { useState } from "react";
import { ActivityLogChart } from "./ActivityLogChart";
import { getTodayKey } from "@/features/activities/date";
import {
  getLogsForActivity,
  withTodayProgress,
} from "@/features/activities/selectors";
import { ActivityLogItem } from "./ActivityLogItem";
import { activityColorClasses } from "@/features/activities/colors";

type ActivityDetailViewProps = {
  activityId: string;
};

export function ActivityDetailView({ activityId }: ActivityDetailViewProps) {
  const [logOpen, setLogOpen] = useState(false);

  const activities = useActivityStore((state) => state.activities);
  const logs = useActivityStore((state) => state.logs);

  const today = getTodayKey();

  const baseActivity = activities.find((item) => item.id === activityId);
  const activity = baseActivity
    ? withTodayProgress(baseActivity, logs, today)
    : undefined;

  if (!activity) {
    return (
      <div className="space-y-6">
        <Link
          href="/activities"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alle attività
        </Link>

        <section className="rounded-[2rem] border border-dashed border-border bg-card/70 px-5 py-8 text-center">
          <h1 className="font-semibold">Attività non trovata</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Questa attività potrebbe essere stata eliminata.
          </p>
        </section>
      </div>
    );
  }

  const Icon = activityIcons[activity.icon];
  const colorClasses = activityColorClasses[activity.color ?? "olive"];
  const progress = Math.round(getActivityProgress(activity));
  const complete = isActivityComplete(activity);

  const activityLogs = getLogsForActivity(logs, activity.id);

  return (
    <div className="space-y-6">
      <Link
        href="/activities"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna alle attività
      </Link>

      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colorClasses.icon}`}>
            <Icon className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Dettaglio attività</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {activity.name}
            </h1>

            {activity.description ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {activity.description}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className={`rounded-[2rem] border border-border p-5 shadow-lg ${colorClasses.detail}`}>
        <div className="mb-3 flex items-center gap-2 text-sm opacity-80">
          <Target className="h-4 w-4 shrink-0" />
          Progresso di oggi
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-semibold tracking-tight">{progress}%</p>
            <p className="mt-2 text-sm opacity-80">
              Target: {formatActivityTarget(activity)}
            </p>
          </div>

          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            {complete ? "Completata" : "Da fare"}
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-primary-foreground"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          className="mt-5 w-full rounded-full"
          onClick={() => setLogOpen(true)}
        >
          Registra progresso
        </Button>
      </section>

      <ActivitySummary activity={activity} logs={activityLogs} />

      <ActivityLogChart activity={activity} logs={activityLogs} />

      <ActivityLogList logs={activityLogs} activity={activity} />

      <LogActivityDialog
        activity={activity}
        open={logOpen}
        onOpenChange={setLogOpen}
      />
    </div>
  );
}

type ActivityLogListProps = {
  logs: ActivityLog[];
  activity: Activity;
};

function ActivityLogList({ logs, activity }: ActivityLogListProps) {
  if (logs.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-border bg-card/70 px-5 py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
        </div>

        <h2 className="mt-4 font-semibold">Nessun log per ora</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Registra questa attività per iniziare a costruire lo storico.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">Storico</p>
        <h2 className="text-xl font-semibold tracking-tight">Progressi recenti</h2>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <ActivityLogItem key={log.id} activity={activity} log={log} />
        ))}
      </div>
    </section>
  );
}

type ActivitySummaryProps = {
  activity: Activity;
  logs: ActivityLog[];
};

function ActivitySummary({ activity, logs }: ActivitySummaryProps) {
  const totalLogs = logs.length;

  const totalValue = logs.reduce((total, log) => total + log.value, 0);

  const bestLog = [...logs].sort((a, b) => b.value - a.value)[0];

  const latestLog = [...logs].sort(
    (a, b) =>
      b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt),
  )[0];

  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">Riepilogo</p>
        <h2 className="text-xl font-semibold tracking-tight">
          Andamento attività
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          label="Log"
          value={String(totalLogs)}
          helper="registrazioni"
        />

        <SummaryCard
          label="Totale"
          value={formatSummaryValue(totalValue, activity)}
          helper="valore tracciato"
        />

        <SummaryCard
          label="Migliore"
          value={bestLog ? formatSummaryValue(bestLog.value, activity) : "—"}
          helper={bestLog ? formatShortDate(bestLog.date) : "nessun log"}
        />

        <SummaryCard
          label="Ultimo"
          value={latestLog ? formatShortDate(latestLog.date) : "—"}
          helper={
            latestLog
              ? formatSummaryValue(latestLog.value, activity)
              : "nessun log"
          }
        />
      </div>
    </section>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  helper: string;
};

function SummaryCard({ label, value, helper }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}

function formatSummaryValue(value: number, activity: Activity) {
  if (activity.type === "boolean") {
    return String(value);
  }

  return `${value} ${activity.unit ?? ""}`.trim();
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}
