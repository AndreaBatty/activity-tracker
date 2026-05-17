import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { activities } from "./data/mockActivities";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default function HomePage() {
  const completed = activities.filter(
    (activity) => activity.value >= activity.target,
  ).length;

  return (
    <PageContainer>
      <DashboardView />
    </PageContainer>
  );
}
