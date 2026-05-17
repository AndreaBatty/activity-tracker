"use client";

import React from "react";
import type { Activity, ActivityIcon } from "@/features/activities/types";
import { useActivityStore } from "@/features/activities/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IconPicker } from "./IconPicker";

type EditActivityDialogProps = {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditActivityDialog({
  activity,
  open,
  onOpenChange,
}: EditActivityDialogProps) {
  const updateActivity = useActivityStore((state) => state.updateActivity);

  const [name, setName] = React.useState(activity.name);
  const [icon, setIcon] = React.useState<ActivityIcon>(activity.icon);
  const [description, setDescription] = React.useState(
    activity.description || "",
  );
  const [type, setType] = React.useState<Activity["type"]>(activity.type);
  const [target, setTarget] = React.useState(String(activity.target));
  const [unit, setUnit] = React.useState(activity.unit || "");

  function handleCancel() {
    setName(activity.name);
    setDescription(activity.description || "");
    setIcon(activity.icon);
    setType(activity.type);
    setTarget(String(activity.target));
    setUnit(activity.unit || "");
    onOpenChange(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2) return;

    const numericTarget = Number(target);

    if (Number.isNaN(numericTarget) || numericTarget <= 0) return;

    updateActivity(activity.id, {
      name: name.trim(),
      description: description.trim(),
      type,
      icon,
      target: type === "boolean" ? 1 : numericTarget,
      unit: type === "boolean" ? null : unit.trim() || null,
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-[2rem] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica attività</DialogTitle>
          <DialogDescription>
            Aggiorna nome, tipo e obiettivo di questa attività.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`edit-name-${activity.id}`}>Nome</Label>
            <Input
              id={`edit-name-${activity.id}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            {name.trim().length > 0 && name.trim().length < 2 ? (
              <p className="text-sm text-destructive">
                Il nome deve avere almeno 2 caratteri.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-description-${activity.id}`}>
              Descrizione
            </Label>
            <Textarea
              id={`edit-description-${activity.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Icona</Label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) => {
                if (!value) return;

                setType(value);

                if (value === "boolean") {
                  setTarget("1");
                  setUnit("");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="boolean">Sì/No</SelectItem>
                <SelectItem value="quantity">Quantità</SelectItem>
                <SelectItem value="duration">Durata</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type !== "boolean" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`edit-target-${activity.id}`}>Target</Label>
                <Input
                  id={`edit-target-${activity.id}`}
                  type="number"
                  min="1"
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`edit-unit-${activity.id}`}>Unità</Label>
                <Input
                  id={`edit-unit-${activity.id}`}
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
              Le attività Sì/No hanno target automatico pari a 1.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={handleCancel}
            >
              Annulla
            </Button>

            <Button type="submit" className="flex-1 rounded-full">
              Salva
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
