"use client";

import {
  BarChart3,
  CalendarCheck,
  Flame,
  ListChecks,
  Target,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityProgressChart } from "@/components/stats/ActivityProgressChart";
import { useActivityStore } from "@/features/activities/store";
import { getTodayKey } from "@/features/activities/date";
import {
  getActiveActivities,
  getActivitiesWithTodayProgress,
  getActivityStats,
  getAnytimeActivities,
  getCurrentStreak,
  getLogsForDateRange,
  getScheduledActivitiesForDate,
  getTargetReachedLogs,
  getWeekDateKeys,
} from "@/features/activities/selectors";
import {
  formatActivityValue,
  getActivityProgress,
  isActivityComplete,
} from "@/features/activities/utils";
import type { Activity } from "@/features/activities/types";

export function StatsView() {
  const activities = useActivityStore((state) => state.activities);
  const logs = useActivityStore((state) => state.logs);

  const today = getTodayKey();

  const activitiesWithTodayProgress = getActivitiesWithTodayProgress(
    activities,
    logs,
    today,
  );

  const activeActivities = getActiveActivities(activitiesWithTodayProgress);
  const scheduledTodayActivities = getScheduledActivitiesForDate(
    activeActivities,
    today,
  );

  const completedTodayActivities =
    scheduledTodayActivities.filter(isActivityComplete);

  const pendingTodayActivities =
    scheduledTodayActivities.length - completedTodayActivities.length;

  const todayCompletionRate =
    scheduledTodayActivities.length > 0
      ? Math.round(
          (completedTodayActivities.length / scheduledTodayActivities.length) *
            100,
        )
      : 0;

  const weekDateKeys = getWeekDateKeys();
  const weekLogs = getLogsForDateRange(logs, weekDateKeys);
  const weekPositiveLogs = weekLogs.filter((log) => log.value > 0);

  const activeDaysThisWeek = new Set(
    weekPositiveLogs.map((log) => log.date),
  ).size;

  const targetReachedThisWeek = getTargetReachedLogs(
    weekPositiveLogs,
    activities,
  ).length;

  const currentStreak = getCurrentStreak(logs, today);

  const anytimeActivities = getAnytimeActivities(activeActivities);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4 shrink-0" />
          Panoramica
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Statistiche</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Una vista più chiara dei progressi, separando attività previste,
          registrazioni e risultati per singola attività.
        </p>
      </section>

      <StatsSection
        eyebrow="Oggi"
        title="Attività previste"
        description="Queste metriche considerano solo le attività programmate per oggi."
      >
        <section className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Previste"
            value={String(scheduledTodayActivities.length)}
            helper="attività di oggi"
          />

          <MetricCard
            label="Completate"
            value={String(completedTodayActivities.length)}
            helper={`${pendingTodayActivities} da fare`}
          />

          <MetricCard
            label="Da fare"
            value={String(pendingTodayActivities)}
            helper="ancora aperte"
          />

          <MetricCard
            label="Completamento"
            value={`${todayCompletionRate}%`}
            helper="target raggiunti"
          />
        </section>
      </StatsSection>

      <StatsSection
        eyebrow="Settimana"
        title="Andamento settimanale"
        description="Qui contiamo registrazioni, giorni attivi e target raggiunti nella settimana corrente."
      >
        <section className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Registrazioni"
            value={String(weekPositiveLogs.length)}
            helper="questa settimana"
          />

          <MetricCard
            label="Giorni attivi"
            value={`${activeDaysThisWeek}/7`}
            helper="con almeno una registrazione"
          />

          <MetricCard
            label="Target"
            value={String(targetReachedThisWeek)}
            helper="raggiunti"
          />

          <MetricCard
            label="Streak"
            value={String(currentStreak)}
            helper="giorni consecutivi"
          />
        </section>
      </StatsSection>

      <StatsSection
        eyebrow="Oggi"
        title="Dettaglio attività previste"
        description="Progresso delle attività che erano programmate per oggi."
      >
        {scheduledTodayActivities.length > 0 ? (
          <div className="space-y-3">
            {scheduledTodayActivities.map((activity) => (
              <ActivityProgressRow key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyStatsState message="Non ci sono attività programmate per oggi." />
        )}
      </StatsSection>

      <StatsSection
        eyebrow="Libere"
        title="Attività quando vuoi"
        description="Queste attività non entrano nel conteggio delle attività previste."
      >
        {anytimeActivities.length > 0 ? (
          <div className="space-y-3">
            {anytimeActivities.map((activity) => (
              <ActivityProgressRow key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyStatsState message="Non hai attività libere configurate." />
        )}
      </StatsSection>

      <StatsSection
        eyebrow="Per attività"
        title="Riepilogo storico"
        description="Qui i valori specifici, come minuti o parole, hanno senso perché sono separati per attività."
      >
        <div className="space-y-3">
          {activeActivities.map((activity) => {
            const stats = getActivityStats(activity, logs);

            return (
              <ActivityHistoryRow
                key={activity.id}
                activity={activity}
                totalLogs={stats.totalLogs}
                completedLogs={stats.completedLogs}
                totalValue={stats.totalValue}
              />
            );
          })}
        </div>
      </StatsSection>

      <ActivityProgressChart activities={scheduledTodayActivities} />
    </div>
  );
}

type StatsSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

function StatsSection({
  eyebrow,
  title,
  description,
  children,
}: StatsSectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">{eyebrow}</p>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}

type ActivityProgressRowProps = {
  activity: Activity;
};

function ActivityProgressRow({ activity }: ActivityProgressRowProps) {
  const progress = Math.round(getActivityProgress(activity));
  const complete = isActivityComplete(activity);

  return (
    <article className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{activity.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatActivityValue(activity)}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            complete
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {complete ? "Completata" : "Da fare"}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </article>
  );
}

type ActivityHistoryRowProps = {
  activity: Activity;
  totalLogs: number;
  completedLogs: number;
  totalValue: number;
};

function ActivityHistoryRow({
  activity,
  totalLogs,
  completedLogs,
  totalValue,
}: ActivityHistoryRowProps) {
  return (
    <article className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{activity.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalLogs} {totalLogs === 1 ? "registrazione" : "registrazioni"} ·{" "}
            {completedLogs} target raggiunti
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          {activity.type === "duration"
            ? "Durata"
            : activity.type === "quantity"
              ? "Quantità"
              : "Sì/No"}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium">
        Totale: {formatHistoricalTotal(totalValue, activity)}
      </p>
    </article>
  );
}

function formatHistoricalTotal(value: number, activity: Activity) {
  if (activity.type === "boolean") {
    return `${value} ${value === 1 ? "volta" : "volte"}`;
  }

  return `${value} ${activity.unit ?? ""}`.trim();
}

function EmptyStatsState({ message }: { message: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-card/70 px-5 py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <ListChecks className="h-5 w-5 text-muted-foreground" />
      </div>

      <p className="mt-4 font-medium">{message}</p>
    </div>
  );
}