"use client";

import { Sparkles } from "lucide-react";
import { NewActivityDialog } from "@/components/activities/NewActivityDialog";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { useActivityStore } from "@/features/activities/store";
import { RecentLogs } from "./RecentLogs";
import { getTodayKey } from "@/features/activities/date";
import {
  getActiveActivities,
  getActivitiesWithTodayProgress,
  getCurrentStreak,
  getScheduledActivitiesForDate,
} from "@/features/activities/selectors";
import { ActivityCalendar } from "./ActivityCalendar";

export function DashboardView() {
  const activities = useActivityStore((state) => state.activities);

  const logs = useActivityStore((state) => state.logs);

  const today = getTodayKey();

  const activitiesWithTodayProgress = getActivitiesWithTodayProgress(
    activities,
    logs,
    today,
  );

  const activeActivities = getActiveActivities(activitiesWithTodayProgress);

const todayActivities = getScheduledActivitiesForDate(activeActivities, today);

  const completed = todayActivities.filter(
  (activity) => activity.value >= activity.target,
).length;

  const currentStreak = getCurrentStreak(logs, today);

  return (
    <>
      <section className="rounded-[2rem] border border-border bg-primary p-4 text-primary-foreground shadow-lg sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm opacity-80">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>Focus di oggi</span>
        </div>

        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Tieni il ritmo, senza complicarti la vita.
        </h2>

        <p className="mt-3 text-sm leading-6 opacity-80">
          Registra le attività in pochi secondi e controlla i progressi della
          giornata.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Completate"
          value={`${completed}/${todayActivities.length}`}
          helper="attività di oggi"
        />
        <MetricCard
          label="Streak"
          value={String(currentStreak)}
          helper="giorni consecutivi"
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Oggi</p>
            <h2 className="truncate text-xl font-semibold tracking-tight">
              Le tue attività
            </h2>
          </div>

          <NewActivityDialog />
        </div>

        {todayActivities.length > 0 ? (
          <div className="space-y-3">
            {todayActivities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyDashboardState />
        )}
      </section>

      <ActivityCalendar activities={activities} logs={logs} />

      <RecentLogs activities={activities} logs={logs} />
    </>
  );
}

function EmptyDashboardState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-card/70 px-5 py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <Sparkles className="h-5 w-5 text-muted-foreground" />
      </div>

      <h2 className="mt-4 font-semibold">Nessuna attività ancora</h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Crea la tua prima attività dalla sezione Attività per iniziare a
        monitorare i progressi.
      </p>
    </div>
  );
}
