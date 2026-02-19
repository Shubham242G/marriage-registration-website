import { notFound } from "next/navigation";
import { RELIGION_THEMES, ALL_RELIGIONS } from "../constants/Religions";
import { ReligionKey } from "../types/Religion";
import ReligionHomePage from "./ReligionHomePage";

interface PageProps {
  params: Promise<{ religion: string }>;
}

export function generateStaticParams() {
  return ALL_RELIGIONS.map((r) => ({ religion: r.key }));
}

export default async function Page({ params }: PageProps) {
  const { religion } = await params;
  const theme = RELIGION_THEMES[religion as ReligionKey];
  if (!theme) notFound();
  return <ReligionHomePage theme={theme} />;
}