import { notFound, redirect } from "next/navigation";
import redirects from "@/data.json";
import { RedirectLoader } from "@/components/redirect-loader";

type RedirectEntry = {
  id: string;
  url: string;
  name: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PresentPage({ params }: PageProps) {
  const { id } = await params;
  const targetMs = new Date("2026-02-03T13:00:00.000Z").getTime();
  const nowMs = Date.now();

  if (nowMs < targetMs) {
    redirect("/");
  }

  const entry = (redirects as RedirectEntry[]).find(
    (item) => item.id === id,
  );

  if (!entry) {
    notFound();
  }

  return <RedirectLoader url={entry.url} id={entry.id} name={entry.name} />;
}
