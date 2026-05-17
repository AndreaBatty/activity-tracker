"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Activity, ActivityLog } from "@/features/activities/types";

type ActivityLogChartProps = {
  activity: Activity;
  logs: ActivityLog[];
};

export function ActivityLogChart({ activity, logs }: ActivityLogChartProps) {
  const data = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((log) => ({
      date: formatChartDate(log.date),
      value: log.value,
    }));

  if (data.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-border bg-card/70 px-5 py-8 text-center">
        <p className="font-medium">Nessun dato per il grafico</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Registra almeno un log per visualizzare l’andamento.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Grafico</p>
        <h2 className="text-lg font-semibold tracking-tight">
          Andamento nel tempo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Valori registrati per {activity.name}.
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) =>
                activity.unit ? `${value}` : String(value)
              }
            />
            <Bar
              dataKey="value"
              radius={[12, 12, 12, 12]}
              fill="var(--primary)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function formatChartDate(date: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}