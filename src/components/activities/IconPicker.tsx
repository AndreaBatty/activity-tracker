"use client";

import type { ActivityIcon } from "@/features/activities/types";
import {
  activityIconOptions,
  activityIcons,
} from "@/features/activities/icons";

type IconPickerProps = {
  value: ActivityIcon;
  onChange: (value: ActivityIcon) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {activityIconOptions.map((option) => {
        const Icon = activityIcons[option.value];
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center gap-2 rounded-3xl border px-2 py-3 text-xs font-medium transition ${
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}