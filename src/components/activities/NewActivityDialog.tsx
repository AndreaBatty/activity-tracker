"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useActivityStore } from "@/features/activities/store";
import { IconPicker } from "./IconPicker";
import { ActivityIcon } from "@/features/activities/types";

const newActivitySchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri."),
  description: z.string().optional(),
  icon: z.enum(["pen", "dumbbell", "calendar", "sparkles"]),
  type: z.enum(["boolean", "quantity", "duration"], {
    message: "Seleziona un tipo di attività.",
  }),
  unit: z.string().optional(),
  target: z.coerce
    .number({
      message: "Inserisci un numero valido.",
    })
    .positive("Il target deve essere maggiore di 0."),
});

type NewActivityFormInput = z.input<typeof newActivitySchema>;
type NewActivityFormOutput = z.output<typeof newActivitySchema>;

const defaultValues: NewActivityFormInput = {
  name: "",
  description: "",
  icon: "sparkles",
  type: "quantity",
  unit: "",
  target: 1,
};

export function NewActivityDialog() {
  const [open, setOpen] = useState(false);

  const addActivity = useActivityStore((state) => state.addActivity);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewActivityFormInput, unknown, NewActivityFormOutput>({
    resolver: zodResolver(newActivitySchema),
    defaultValues,
  });

  const type = watch("type");
  const icon = watch("icon");

  function onSubmit(values: NewActivityFormOutput) {
    addActivity({
      name: values.name,
      description: values.description,
      icon: values.icon,
      type: values.type,
      unit: values.type === "boolean" ? null : values.unit || null,
      target: values.type === "boolean" ? 1 : values.target,
    });

    reset(defaultValues);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        size="icon"
        className="shrink-0 rounded-full"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-5 w-5" />
      </Button>

      <DialogContent className="max-w-[calc(100%-2rem)] rounded-[2rem] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuova attività</DialogTitle>
          <DialogDescription>
            Crea qualcosa da monitorare ogni giorno o durante la settimana.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Es. Scrittura, Palestra, Lettura"
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              placeholder="Una breve descrizione opzionale"
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Icona</Label>
            <IconPicker
              value={icon as ActivityIcon}
              onChange={(value) =>
                setValue("icon", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) => {
                if (!value) return;

                setValue("type", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });

                if (value === "boolean") {
                  setValue("unit", "");
                  setValue("target", 1);
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

            {errors.type ? (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            ) : null}
          </div>

          {type !== "boolean" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  placeholder="500"
                  {...register("target")}
                />
                {errors.target ? (
                  <p className="text-sm text-destructive">
                    {errors.target.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unità</Label>
                <Input
                  id="unit"
                  placeholder={type === "duration" ? "minuti" : "parole"}
                  {...register("unit")}
                />
              </div>
            </div>
          ) : null}

          {type === "boolean" ? (
            <div className="rounded-3xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
              Le attività Sì/No hanno target automatico pari a 1.
            </div>
          ) : null}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => {
                reset(defaultValues);
                setOpen(false);
              }}
            >
              Annulla
            </Button>

            <Button
              type="submit"
              className="flex-1 rounded-full"
              disabled={isSubmitting}
            >
              Crea
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
