import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 bg-background/85 px-3 py-4 backdrop-blur-xl sm:px-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            Domenica, 17 maggio
          </p>
          <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
            Ciao Andrea
          </h1>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="shrink-0 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}