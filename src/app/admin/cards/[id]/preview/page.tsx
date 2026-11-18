import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { DigitalCard } from "@/components/digital-card";
import { requireAdmin } from "@/lib/auth";
import { getCardById } from "@/lib/cards";
import { getCardUrl } from "@/lib/site-url";
import { createVCard } from "@/lib/vcard";

export const metadata = { title: "Card preview", robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const card = await getCardById(id);
  if (!card) notFound();
  return <><div className="fixed inset-x-0 top-0 z-[100] flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:px-6"><div className="flex items-center gap-3"><Link href="/admin" className="admin-button admin-button-secondary"><ArrowLeft size={16} />Dashboard</Link><span className="text-sm font-semibold text-slate-700">Administrator preview · {card.published ? "Published" : "Unpublished"}</span></div><Link href={`/admin/cards/${card.id}/edit`} className="admin-button"><Pencil size={16} />Edit card</Link></div><div className="pt-[61px]"><DigitalCard card={card} publicUrl={getCardUrl(card.slug)} vcard={createVCard(card)} /></div></>;
}
