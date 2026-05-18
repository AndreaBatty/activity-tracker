"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { Activity, ActivityLog } from "@/features/activities/types";
import { getMonthDays, getMonthLabel } from "@/features/activities/date";
import { getLogCountByDate } from "@/features/activities/selectors";
import { Button } from "@/components/ui/button";
import { CalendarDayLogs } from "./CalendarDayLogs";

type ActivityCalendarProps = {
  activities: Activity[];
  logs: ActivityLog[];
};

const weekDays = [
  { key: "mon", label: "L" },
  { key: "tue", label: "M" },
  { key: "wed", label: "M" },
  { key: "thu", label: "G" },
  { key: "fri", label: "V" },
  { key: "sat", label: "S" },
  { key: "sun", label: "D" },
];

export function ActivityCalendar({ activities, logs }: ActivityCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthDays = getMonthDays(visibleMonth);
  const monthLabel = getMonthLabel(visibleMonth);
  const logCountByDate = getLogCountByDate(logs);

  const firstWeekday = monthDays[0]?.weekday ?? 1;

  // JS: domenica=0, lunedì=1.
  // Calendario italiano lun-dom:
  // lunedì -> 0, martedì -> 1, ..., domenica -> 6
  const leadingEmptyDays = firstWeekday === 0 ? 6 : firstWeekday - 1;

  function goToPreviousMonth() {
    setVisibleMonth((current) => {
      const next = new Date(current);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  }

  function goToNextMonth() {
    setVisibleMonth((current) => {
      const next = new Date(current);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  }

  function goToCurrentMonth() {
    setVisibleMonth(new Date());
  }

  const isCurrentMonth =
    visibleMonth.getFullYear() === new Date().getFullYear() &&
    visibleMonth.getMonth() === new Date().getMonth();

  return (
    <section className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" />
            Calendario
          </div>

          <h2 className="truncate text-xl font-semibold tracking-tight capitalize">
            {monthLabel}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Giorni in cui hai registrato almeno un’attività.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isCurrentMonth ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mb-4 rounded-full"
          onClick={goToCurrentMonth}
        >
          Torna al mese corrente
        </Button>
      ) : null}

      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day) => (
          <div
            key={day.key}
            className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day.label}
          </div>
        ))}

        {Array.from({ length: leadingEmptyDays }).map((_, index) => (
          <div key={`empty-${index}`} className="h-9" />
        ))}

        {monthDays.map((day) => {
          const count = logCountByDate[day.date] ?? 0;

          return (
            <CalendarDay
              key={day.date}
              day={day.day}
              count={count}
              isToday={day.isToday && isCurrentMonth}
              isSelected={selectedDate === day.date}
              onClick={() =>
                setSelectedDate((current) =>
                  current === day.date ? null : day.date,
                )
              }
            />
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <LegendItem className="bg-secondary" label="Nessuna progresso" />
        <LegendItem className="bg-primary/40" label="1 progresso" />
        <LegendItem className="bg-primary/70" label="2 progressi" />
        <LegendItem className="bg-primary" label="3+ progressi" />
      </div>

      <div className="mt-5">
        <CalendarDayLogs
          date={selectedDate}
          activities={activities}
          logs={logs}
        />
      </div>
    </section>
  );
}

type CalendarDayProps = {
  day: number;
  count: number;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
};

function CalendarDay({
  day,
  count,
  isToday,
  isSelected,
  onClick,
}: CalendarDayProps) {
  const intensityClass =
    count === 0
      ? "bg-secondary text-muted-foreground"
      : count === 1
        ? "bg-primary/40 text-foreground"
        : count === 2
          ? "bg-primary/70 text-primary-foreground"
          : "bg-primary text-primary-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-9 items-center justify-center rounded-2xl text-sm font-medium transition hover:scale-105 ${intensityClass} ${
        isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
      }`}
    >
      {day}

      {isToday ? (
        <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-foreground" />
      ) : null}
    </button>
  );
}

type LegendItemProps = {
  className: string;
  label: string;
};

function LegendItem({ className, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-full ${className}`} />
      <span>{label}</span>
    </div>
  );
}
