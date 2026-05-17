"use client";

import { BarChart3, Clock, Sparkles, Target, Trophy } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useActivityStore } from "@/features/activities/store";
import {
  getActivityProgress,
  isActivityComplete,
} from "@/features/activities/utils";
import { ActivityProgressChart } from "./ActivityProgressChart";
import { getTodayKey } from "@/features/activities/date";
import {
  getActiveActivities,
  getActivitiesWithTodayProgress,
  getCurrentStreak,
} from "@/features/activities/selectors";

export function StatsView() {
  const activities = useActivityStore((state) => state.activities);
  const logs = useActivityStore((state) => state.logs);

  const today = getTodayKey();

  const activeActivities = getActiveActivities(
    getActivitiesWithTodayProgress(activities, logs, today),
  );

  const completedActivities = activeActivities.filter(isActivityComplete);
  const pendingActivities =
    activeActivities.length - completedActivities.length;

  const currentStreak = getCurrentStreak(logs, today);

  const completionRate =
    activeActivities.length > 0
      ? Math.round((completedActivities.length / activeActivities.length) * 100)
      : 0;

  const totalDuration = activeActivities
    .filter((activity) => activity.type === "duration")
    .reduce((total, activity) => total + activity.value, 0);

  const bestActivity = [...activeActivities].sort(
    (a, b) => getActivityProgress(b) - getActivityProgress(a),
  )[0];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4 shrink-0" />
          Panoramica
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Statistiche</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Una vista sintetica dei tuoi progressi attuali, basata sulle attività
          salvate nel tuo browser.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Totali"
          value={String(activeActivities.length)}
          helper="attività attive"
        />

        <MetricCard
          label="Completate"
          value={String(completedActivities.length)}
          helper={`${pendingActivities} da fare`}
        />

        <MetricCard
          label="Progress"
          value={`${completionRate}%`}
          helper="completamento"
        />

        <MetricCard
          label="Durata"
          value={`${totalDuration}m`}
          helper="minuti totali"
        />
      </section>
      <ActivityProgressChart activities={activeActivities} />

      <section className="rounded-[2rem] border border-border bg-primary p-5 text-primary-foreground shadow-lg">
        <div className="mb-3 flex items-center gap-2 text-sm opacity-80">
          <Trophy className="h-4 w-4 shrink-0" />
          Migliore attività
        </div>

        {bestActivity ? (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              {bestActivity.name}
            </h2>

            <p className="mt-2 text-sm leading-6 opacity-80">
              Hai raggiunto il {Math.round(getActivityProgress(bestActivity))}%
              del target impostato.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              Nessun dato
            </h2>

            <p className="mt-2 text-sm leading-6 opacity-80">
              Crea una prima attività per iniziare a vedere le statistiche.
            </p>
          </>
        )}
      </section>

      <section className="grid gap-3">
        <SmallStatRow
          icon={Target}
          label="Attività da completare"
          value={String(pendingActivities)}
        />
        <SmallStatRow
          icon={Sparkles}
          label="Streak corrente"
          value={`${currentStreak} giorni`}
        />
        <SmallStatRow
          icon={Clock}
          label="Tempo tracciato"
          value={`${totalDuration} minuti`}
        />
      </section>
    </div>
  );
}

type SmallStatRowProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

function SmallStatRow({ icon: Icon, label, value }: SmallStatRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="truncate font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
