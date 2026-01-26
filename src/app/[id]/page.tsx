import { notFound } from "next/navigation";
import redirects from "@/data.json";
import { RedirectLoader } from "@/components/redirect-loader";

type RedirectEntry = {
  id: string;
  url: string;
};

type PageProps = {
  params: {
    id: string;
  };
};

export default function PresentPage({ params }: PageProps) {
  const entry = (redirects as RedirectEntry[]).find(
    (item) => item.id === params.id,
  );

  if (!entry) {
    notFound();
  }

  return <RedirectLoader url={entry.url} id={entry.id} />;
}
