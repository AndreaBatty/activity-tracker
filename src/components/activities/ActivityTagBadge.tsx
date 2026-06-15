import type { ActivityTag } from "@/features/activities/types";
import { activityTagLabels } from "@/features/activities/tags";

type ActivityTagBadgeProps = {
  tag: ActivityTag;
};

export function ActivityTagBadge({ tag }: ActivityTagBadgeProps) {
  return (
    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {activityTagLabels[tag]}
    </span>
  );
}