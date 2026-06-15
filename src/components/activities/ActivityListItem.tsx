"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Activity } from "@/features/activities/types";
import { activityIcons } from "@/features/activities/icons";
import { EditActivityDialog } from "./EditActivityDialog";
import { DeleteActivityDialog } from "./DeleteActivityDialog";
import Link from "next/link";
import { activityColorClasses } from "@/features/activities/colors";
import { ActivityTagBadge } from "./ActivityTagBadge";

type ActivityListItemProps = {
  activity: Activity;
};

export function ActivityListItem({ activity }: ActivityListItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const colorClasses = activityColorClasses[activity.color ?? "olive"];
  const [deleteOpen, setDeleteOpen] = useState(false);

  const Icon = activityIcons[activity.icon];

  return (
    <>
      <Card className="relative overflow-visible rounded-3xl border-border bg-card shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${colorClasses.icon}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <Link
              href={`/activities/${activity.id}`}
              className="min-w-0 flex-1"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h3 className="min-w-0 max-w-full truncate font-medium text-foreground">
                  {activity.name}
                </h3>
                <ActivityTagBadge tag={activity.tag ?? "other"} />
              </div>

              <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                {activity.description}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                {formatScheduleLabel(activity)}
              </p>
            </Link>

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
        </CardContent>
      </Card>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Chiudi menu"
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <EditActivityDialog
        key={activity.id}
        activity={activity}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteActivityDialog
        activity={activity}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

function formatScheduleLabel(activity: Activity) {
  if (activity.scheduleType === "daily") return "Ogni giorno";
  if (activity.scheduleType === "anytime") return "Quando vuoi";

  return "Giorni specifici";
}
