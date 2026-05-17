"use client";

import { useState } from "react";
import type { Activity, ActivityLog } from "@/features/activities/types";
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

type EditActivityLogDialogProps = {
  activity: Activity;
  log: ActivityLog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditActivityLogDialog({
  activity,
  log,
  open,
  onOpenChange,
}: EditActivityLogDialogProps) {
  const updateActivityLog = useActivityStore((state) => state.updateActivityLog);

  const today = getTodayKey();

  const [date, setDate] = useState(log.date);
  const [value, setValue] = useState(String(log.value));
  const [note, setNote] = useState(log.note || "");

  function handleCancel() {
    setDate(log.date);
    setValue(String(log.value));
    setNote(log.note || "");
    onOpenChange(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!date) return;

    const numericValue = Number(value);

    if (Number.isNaN(numericValue) || numericValue < 0) return;

    updateActivityLog(log.id, {
      date,
      value: numericValue,
      note,
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-[2rem] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica log</DialogTitle>
          <DialogDescription>
            Aggiorna data, valore o nota di questa registrazione.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`edit-log-date-${log.id}`}>Data</Label>
            <Input
              id={`edit-log-date-${log.id}`}
              type="date"
              value={date}
              max={today}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          {activity.type === "boolean" ? (
            <div className="space-y-2">
              <Label htmlFor={`edit-log-value-${log.id}`}>Stato</Label>
              <select
                id={`edit-log-value-${log.id}`}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="1">Completata</option>
                <option value="0">Non completata</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`edit-log-value-${log.id}`}>
                Valore registrato
              </Label>
              <Input
                id={`edit-log-value-${log.id}`}
                type="number"
                min="0"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Unità: {activity.unit ?? "valore"}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`edit-log-note-${log.id}`}>Nota</Label>
            <Textarea
              id={`edit-log-note-${log.id}`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Aggiungi una nota..."
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