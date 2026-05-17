import { PageContainer } from "@/components/layout/PageContainer";
import { ActivityDetailView } from "@/components/activities/ActivityDetailView";

type ActivityDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;

  return (
    <PageContainer>
      <ActivityDetailView activityId={id} />
    </PageContainer>
  );
}