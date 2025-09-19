import ActivityClient from "./activity-client";

type ActivityParams = { id?: string | string[] };

type ActivityPageProps = {
  params: Promise<ActivityParams>;
};

export default async function ActivityPage({ params }: ActivityPageProps) {
  const resolved = await params;
  const idParam = Array.isArray(resolved.id) ? resolved.id[0] : resolved.id;

  if (!idParam) {
    return null;
  }

  return <ActivityClient id={idParam} />;
}
