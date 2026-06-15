"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { Activity } from "@/features/activities/types";
import { LogActivityDialog } from "@/components/activities/LogActivityDialog";
import { activityIcons } from "@/features/activities/icons";
import {
  getActivityProgress,
  isActivityComplete,
} from "@/features/activities/utils";
import { activityColorClasses } from "@/features/activities/colors";
import { ActivityTagBadge } from "../activities/ActivityTagBadge";

type ActivityCardProps = {
  activity: Activity;
  index: number;
  isRegisteredToday: boolean;
};

export function ActivityCard({ activity, index, isRegisteredToday }: ActivityCardProps) {
  const [open, setOpen] = useState(false);

  const Icon = activityIcons[activity.icon];
  const colorClasses = activityColorClasses[activity.color ?? "olive"];

  const progress = isRegisteredToday ? 100 : 0;
  const isComplete = isRegisteredToday;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="block w-full text-left"
      >
        <Card className="rounded-3xl border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${colorClasses.icon}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-medium text-foreground">
                    {activity.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <ActivityTagBadge tag={activity.tag ?? "other"} />
                  </div>
                </div>
              </div>

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  isComplete
                    ? colorClasses.badge
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {isComplete ? "Registrata oggi" : "Da registrare"}
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full ${colorClasses.progress}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.button>

      <LogActivityDialog
        activity={activity}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
