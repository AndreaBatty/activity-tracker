import { MobileHeader } from "./MobileHeader";
import { BottomNav } from "./BottomNav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        <MobileHeader />

        <main className="flex-1 pb-28">{children}</main>

        <BottomNav />
      </div>
    </div>
  );
}