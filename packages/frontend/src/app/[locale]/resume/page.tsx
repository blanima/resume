"use server";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("pages.resume.title"),
  };
}

export default async function HomePage() {
  const t = await getTranslations();
  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}
