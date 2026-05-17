"use client";

import { useMemo, useState } from "react";
import type { Activity } from "@/features/activities/types";
import { useActivityStore } from "@/features/activities/store";
import { getTodayKey } from "@/features/activities/date";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type LogActivityDialogProps = {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LogActivityDialog({
  activity,
  open,
  onOpenChange,
}: LogActivityDialogProps) {
  const today = getTodayKey();

  const logs = useActivityStore((state) => state.logs);
  const upsertActivityLog = useActivityStore(
    (state) => state.upsertActivityLog,
  );

  const [date, setDate] = useState(today);

  const selectedLog = useMemo(() => {
    return logs.find(
      (log) => log.activityId === activity.id && log.date === date,
    );
  }, [logs, activity.id, date]);

  const [value, setValue] = useState(String(selectedLog?.value ?? activity.value));
  const [note, setNote] = useState(selectedLog?.note ?? "");

  function handleDateChange(nextDate: string) {
    setDate(nextDate);

    const logForDate = logs.find(
      (log) => log.activityId === activity.id && log.date === nextDate,
    );

    setValue(String(logForDate?.value ?? 0));
    setNote(logForDate?.note ?? "");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!date) return;

    if (activity.type === "boolean") {
      const nextValue = selectedLog?.value && selectedLog.value >= 1 ? 0 : 1;

      upsertActivityLog({
        activityId: activity.id,
        date,
        value: nextValue,
        note,
      });

      onOpenChange(false);
      return;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return;

    upsertActivityLog({
      activityId: activity.id,
      date,
      value: numericValue,
      note,
    });

    onOpenChange(false);
  }

  function handleCancel() {
    setDate(today);
    setValue(String(activity.value));
    setNote("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-[2rem] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{activity.name}</DialogTitle>
          <DialogDescription>
            Registra o aggiorna il progresso per una data specifica.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`activity-date-${activity.id}`}>Data</Label>
            <Input
              id={`activity-date-${activity.id}`}
              type="date"
              value={date}
              max={today}
              onChange={(event) => handleDateChange(event.target.value)}
            />
          </div>

          {activity.type === "boolean" ? (
            <div className="rounded-3xl bg-secondary px-4 py-4 text-sm leading-6 text-muted-foreground">
              Questa attività è di tipo Sì/No. Cliccando salva cambierai lo
              stato della data selezionata tra completata e da fare.
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`activity-value-${activity.id}`}>
                Valore registrato
              </Label>
              <Input
                id={`activity-value-${activity.id}`}
                type="number"
                min="0"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={`Es. ${activity.target}`}
              />
              <p className="text-sm text-muted-foreground">
                Target: {activity.target} {activity.unit}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`activity-note-${activity.id}`}>Nota</Label>
            <Textarea
              id={`activity-note-${activity.id}`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Es. sessione leggera, bozza articolo, upper body..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={handleCancel}
            >
              Annulla
            </Button>

            <Button type="submit" className="flex-1 rounded-full">
              Salva
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}