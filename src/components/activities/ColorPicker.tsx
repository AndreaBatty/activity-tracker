"use client";

import type { ActivityColor } from "@/features/activities/types";
import { activityColorOptions } from "@/features/activities/colors";

type ColorPickerProps = {
  value: ActivityColor;
  onChange: (value: ActivityColor) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {activityColorOptions.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center gap-2 rounded-3xl border px-2 py-3 text-xs font-medium transition ${
              isSelected
                ? "border-primary bg-card text-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full ${option.swatch} ${
                isSelected ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            />
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}