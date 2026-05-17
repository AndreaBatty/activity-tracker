type ActivityTypeBadgeProps = {
  type: "boolean" | "quantity" | "duration";
};

const labels = {
  boolean: "Sì/No",
  quantity: "Quantità",
  duration: "Durata",
};

export function ActivityTypeBadge({ type }: ActivityTypeBadgeProps) {
  return (
    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {labels[type]}
    </span>
  );
}