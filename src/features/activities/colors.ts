import type { ActivityColor } from "./types";

export const activityColorOptions: {
  value: ActivityColor;
  label: string;
  swatch: string;
}[] = [
  {
    value: "olive",
    label: "Oliva",
    swatch: "bg-primary",
  },
  {
    value: "amber",
    label: "Ambra",
    swatch: "bg-amber-500",
  },
  {
    value: "rose",
    label: "Rosa",
    swatch: "bg-rose-500",
  },
  {
    value: "sky",
    label: "Cielo",
    swatch: "bg-sky-500",
  },
  {
    value: "violet",
    label: "Viola",
    swatch: "bg-violet-500",
  },
];

export const activityColorClasses: Record<
  ActivityColor,
  {
    icon: string;
    progress: string;
    badge: string;
    detail: string;
  }
> = {
  olive: {
    icon: "bg-secondary text-primary",
    progress: "bg-primary",
    badge: "bg-primary text-primary-foreground",
    detail: "bg-primary text-primary-foreground",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700",
    progress: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700",
    detail: "bg-amber-500 text-white",
  },
  rose: {
    icon: "bg-rose-100 text-rose-700",
    progress: "bg-rose-500",
    badge: "bg-rose-100 text-rose-700",
    detail: "bg-rose-500 text-white",
  },
  sky: {
    icon: "bg-sky-100 text-sky-700",
    progress: "bg-sky-500",
    badge: "bg-sky-100 text-sky-700",
    detail: "bg-sky-500 text-white",
  },
  violet: {
    icon: "bg-violet-100 text-violet-700",
    progress: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700",
    detail: "bg-violet-500 text-white",
  },
};