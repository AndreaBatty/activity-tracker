"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Activity } from "@/features/activities/types";
import { getActivityProgress } from "@/features/activities/utils";

type ActivityProgressChartProps = {
  activities: Activity[];
};

export function ActivityProgressChart({
  activities,
}: ActivityProgressChartProps) {
  const data = activities.map((activity) => ({
    name: activity.name,
    progress: Math.round(getActivityProgress(activity)),
  }));

  if (data.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-card/70 px-5 py-8 text-center">
        <p className="font-medium">Nessun dato per il grafico</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Crea almeno un’attività per visualizzare i progressi.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Grafico</p>
        <h2 className="text-lg font-semibold tracking-tight">
          Progressi per attività
        </h2>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickMargin={8}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Bar
              dataKey="progress"
              radius={[12, 12, 12, 12]}
              fill="var(--primary)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}