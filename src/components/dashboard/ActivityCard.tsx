"use client";

import { useState } from "react";
import { CalendarDays, Dumbbell, PenLine, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { Activity } from "@/features/activities/types";
import { LogActivityDialog } from "@/components/activities/LogActivityDialog";
import { activityIcons } from "@/features/activities/icons";
import {
  formatActivityValue,
  getActivityProgress,
  isActivityComplete,
} from "@/features/activities/utils";
import { activityColorClasses } from "@/features/activities/colors";

type ActivityCardProps = {
  activity: Activity;
  index: number;
};

export function ActivityCard({ activity, index }: ActivityCardProps) {
  const [open, setOpen] = useState(false);

  const Icon = activityIcons[activity.icon];
  const colorClasses = activityColorClasses[activity.color ?? "olive"];

  const progress = getActivityProgress(activity);
  const isComplete = isActivityComplete(activity);

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
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${colorClasses.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-medium text-foreground">
                    {activity.name}
                  </h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {formatActivityValue(activity)}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  isComplete
                    ? colorClasses.badge
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {activity.status}
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div className={`h-full rounded-full ${colorClasses.progress}`} style={{ width: `${progress}%` }} />
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
