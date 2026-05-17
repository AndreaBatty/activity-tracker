"use client";

import type { Activity } from "@/features/activities/types";
import { useActivityStore } from "@/features/activities/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteActivityDialogProps = {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteActivityDialog({
  activity,
  open,
  onOpenChange,
}: DeleteActivityDialogProps) {
  const deleteActivity = useActivityStore((state) => state.deleteActivity);

  function handleDelete() {
    deleteActivity(activity.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-[2rem] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminare attività?</DialogTitle>
          <DialogDescription>
            Stai per eliminare “{activity.name}”. Questa azione non può essere
            annullata.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-3xl bg-secondary px-4 py-3 text-sm leading-6 text-muted-foreground">
          Verranno rimossi anche i progressi associati a questa attività.
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