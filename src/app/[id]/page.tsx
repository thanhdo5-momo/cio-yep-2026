import { notFound, redirect } from "next/navigation";
import redirects from "@/data.json";
import { RedirectLoader } from "@/components/redirect-loader";

type RedirectEntry = {
  id: string;
  name: string;
  image?: string;
  open: string;
  body: string;
  end: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PresentPage({ params }: PageProps) {
  const { id } = await params;
  const targetMs = new Date("2026-02-03T11:30:00.000Z").getTime();
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

  return <RedirectLoader url={`/appreciation/${entry.id}`} id={entry.id} name={entry.name} />;
}
