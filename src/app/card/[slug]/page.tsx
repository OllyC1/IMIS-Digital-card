import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DigitalCard } from "@/components/digital-card";
import { getPublishedCardBySlug } from "@/lib/cards";
import { COMPANY } from "@/lib/constants";
import { getCardUrl } from "@/lib/site-url";
import { createVCard } from "@/lib/vcard";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = await getPublishedCardBySlug(slug);
  if (!card) return { title: "Card not found", robots: { index: false, follow: false } };
  return {
    title: `${card.full_name} - ${card.job_title}`,
    description: `Connect with ${card.full_name}, ${card.job_title} at ${COMPANY.name}.`,
    alternates: { canonical: getCardUrl(card.slug) },
    openGraph: {
      title: `${card.full_name} - ${card.job_title}`,
      description: `Official ${COMPANY.name} digital business card.`,
      url: getCardUrl(card.slug),
      siteName: COMPANY.name,
      type: "profile",
      images: card.photo_url ? [{ url: card.photo_url, alt: card.full_name }] : undefined,
    },
  };
}

export default async function PublicCardPage({ params }: Props) {
  const { slug } = await params;
  const card = await getPublishedCardBySlug(slug);
  if (!card) notFound();
  return <DigitalCard card={card} publicUrl={getCardUrl(card.slug)} vcard={createVCard(card)} />;
}
