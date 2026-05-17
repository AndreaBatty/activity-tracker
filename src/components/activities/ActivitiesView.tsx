"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewActivityDialog } from "@/components/activities/NewActivityDialog";

import { ActivityListItem } from "@/components/activities/ActivityListItem";
import { useActivityStore } from "@/features/activities/store";

type ActivityFilter = "all" | "duration" | "quantity" | "boolean";

const filters: {
  label: string;
  value: ActivityFilter;
}[] = [
  {
    label: "Tutte",
    value: "all",
  },
  {
    label: "Durata",
    value: "duration",
  },
  {
    label: "Quantità",
    value: "quantity",
  },
  {
    label: "Sì/No",
    value: "boolean",
  },
];

export function ActivitiesView() {
  const activities = useActivityStore((state) => state.activities);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");

  const filteredActivities = useMemo(() => {
  const normalizedSearch = search.trim().toLowerCase();

  return activities.filter((activity) => {
    const matchesArchived = !activity.archived;

    const matchesSearch =
      normalizedSearch.length === 0 ||
      activity.name.toLowerCase().includes(normalizedSearch) ||
      activity.description?.toLowerCase().includes(normalizedSearch);

    const matchesFilter =
      activeFilter === "all" ? true : activity.type === activeFilter;

    return matchesArchived && matchesSearch && matchesFilter;
  });
}, [activities, search, activeFilter]);

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Gestione</p>
          <h1 className="text-2xl font-semibold tracking-tight">Attività</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea e organizza ciò che vuoi monitorare.
          </p>
        </div>

        <NewActivityDialog />
      </section>

      <section className="rounded-3xl border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Search className="h-5 w-5 shrink-0" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cerca attività..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </section>

      <section className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <Button
              key={filter.value}
              type="button"
              variant={isActive ? "default" : "outline"}
              className="shrink-0 rounded-full"
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Button>
          );
        })}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {filteredActivities.length}{" "}
            {filteredActivities.length === 1 ? "attività" : "attività"}
          </p>

          {search || activeFilter !== "all" ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("all");
              }}
              className="text-sm font-medium text-primary"
            >
              Reset
            </button>
          ) : null}
        </div>

        {filteredActivities.length > 0 ? (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyActivitiesState />
        )}
      </section>
    </div>
  );
}

function EmptyActivitiesState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-card/70 px-5 py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>

      <h2 className="mt-4 font-semibold">Nessuna attività trovata</h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Prova a cambiare ricerca o filtro. Più avanti potrai creare nuove
        attività da qui.
      </p>
    </div>
  );
}