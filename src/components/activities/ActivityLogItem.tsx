"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { Activity, ActivityLog } from "@/features/activities/types";
import { Button } from "@/components/ui/button";
import { EditActivityLogDialog } from "./EditActivityLogDialog";
import { DeleteActivityLogDialog } from "./DeleteActivityLogDialog";

type ActivityLogItemProps = {
  activity: Activity;
  log: ActivityLog;
};

export function ActivityLogItem({ activity, log }: ActivityLogItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <article className="relative rounded-3xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium">{formatLogValue(log, activity)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatLogDate(log.date)}
            </p>
          </div>

          <div className="relative shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              onClick={() => setMenuOpen((current) => !current)}
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>

            {menuOpen ? (
              <div className="absolute bottom-11 right-0 z-50 w-36 overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-xl">
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditOpen(true);
                  }}
                >
                  Modifica
                </button>

                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-destructive hover:bg-secondary"
                  onClick={() => {
                    setMenuOpen(false);
                    setDeleteOpen(true);
                  }}
                >
                  Elimina
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {log.note ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {log.note}
          </p>
        ) : null}
      </article>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Chiudi menu"
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <EditActivityLogDialog
        activity={activity}
        log={log}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteActivityLogDialog
        activity={activity}
        log={log}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

function formatLogValue(log: ActivityLog, activity: Activity) {
  if (activity.type === "boolean") {
    return log.value >= 1 ? "Completata" : "Non completata";
  }

  return `${log.value} ${activity.unit ?? ""}`.trim();
}

function formatLogDate(date: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}