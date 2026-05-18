"use client";

import type { ActivityScheduleType } from "@/features/activities/types";
import { Button } from "@/components/ui/button";

type SchedulePickerProps = {
  scheduleType: ActivityScheduleType;
  daysOfWeek: number[];
  onScheduleTypeChange: (value: ActivityScheduleType) => void;
  onDaysOfWeekChange: (value: number[]) => void;
};

const scheduleOptions: {
  value: ActivityScheduleType;
  label: string;
  description: string;
}[] = [
  {
    value: "daily",
    label: "Ogni giorno",
    description: "Compare tutti i giorni",
  },
  {
    value: "custom",
    label: "Giorni specifici",
    description: "Scegli i giorni della settimana",
  },
  {
    value: "anytime",
    label: "Quando voglio",
    description: "Non ha una programmazione fissa",
  },
];

const weekDays = [
  { value: 1, label: "L" },
  { value: 2, label: "M" },
  { value: 3, label: "M" },
  { value: 4, label: "G" },
  { value: 5, label: "V" },
  { value: 6, label: "S" },
  { value: 0, label: "D" },
];

export function SchedulePicker({
  scheduleType,
  daysOfWeek,
  onScheduleTypeChange,
  onDaysOfWeekChange,
}: SchedulePickerProps) {
  function toggleDay(day: number) {
    if (daysOfWeek.includes(day)) {
      onDaysOfWeekChange(daysOfWeek.filter((item) => item !== day));
      return;
    }

    onDaysOfWeekChange([...daysOfWeek, day]);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {scheduleOptions.map((option) => {
          const isSelected = scheduleType === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onScheduleTypeChange(option.value);

                if (option.value === "daily") {
                  onDaysOfWeekChange([0, 1, 2, 3, 4, 5, 6]);
                }

                if (option.value === "anytime") {
                  onDaysOfWeekChange([]);
                }

                if (option.value === "custom") {
                  onDaysOfWeekChange([]);
                }
              }}
              className={`rounded-3xl border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              <p className="text-sm font-medium">{option.label}</p>
              <p
                className={`mt-1 text-xs ${
                  isSelected
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {scheduleType === "custom" ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Giorni</p>

          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map((day) => {
              const isSelected = daysOfWeek.includes(day.value);

              return (
                <Button
                  key={day.value}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className="h-10 rounded-2xl px-0"
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </Button>
              );
            })}
          </div>

          {daysOfWeek.length === 0 ? (
            <p className="text-sm text-destructive">
              Seleziona almeno un giorno.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
