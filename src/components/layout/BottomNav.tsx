"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, LineChart } from "lucide-react";

const items = [
  {
    label: "Oggi",
    href: "/",
    icon: Home,
  },
  {
    label: "Attività",
    href: "/activities",
    icon: CalendarDays,
  },
  {
    label: "Stats",
    href: "/stats",
    icon: LineChart,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 rounded-full border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur-xl sm:bottom-4 sm:w-[calc(100%-2rem)] sm:p-2">
      <div className="grid grid-cols-3 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 items-center justify-center gap-1 rounded-full px-2 py-2 text-xs font-medium transition sm:gap-2 sm:px-3 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}