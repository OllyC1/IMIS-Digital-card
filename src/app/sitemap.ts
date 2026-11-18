import type { MetadataRoute } from "next";
import { listPublishedCards } from "@/lib/cards";
import { getCardUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await listPublishedCards();
  return cards.map((card) => ({ url: getCardUrl(card.slug), lastModified: new Date(card.updated_at), changeFrequency: "monthly", priority: 1 }));
}
