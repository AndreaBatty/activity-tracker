"use client";

import type { ActivityTag } from "@/features/activities/types";
import { activityTagOptions } from "@/features/activities/tags";

type TagPickerProps = {
  value: ActivityTag;
  onChange: (value: ActivityTag) => void;
};

export function TagPicker({ value, onChange }: TagPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {activityTagOptions.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}