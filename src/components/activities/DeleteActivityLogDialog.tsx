"use client";

import type { Activity, ActivityLog } from "@/features/activities/types";
import { useActivityStore } from "@/features/activities/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteActivityLogDialogProps = {
  activity: Activity;
  log: ActivityLog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteActivityLogDialog({
  activity,
  log,
  open,
  onOpenChange,
}: DeleteActivityLogDialogProps) {
  const deleteActivityLog = useActivityStore((state) => state.deleteActivityLog);

  function handleDelete() {
    deleteActivityLog(log.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-[2rem] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminare log?</DialogTitle>
          <DialogDescription>
            Stai per eliminare una registrazione di “{activity.name}”.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-3xl bg-secondary px-4 py-3 text-sm leading-6 text-muted-foreground">
          Questa azione rimuoverà il log dallo storico e aggiornerà eventuali
          statistiche collegate.
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Annulla
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="flex-1 rounded-full"
            onClick={handleDelete}
          >
            Elimina
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}