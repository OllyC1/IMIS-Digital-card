import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, ExternalLink } from "lucide-react";
import { updateCardAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/admin-header";
import { CardForm } from "@/components/card-form";
import { CopyButton } from "@/components/copy-button";
import { requireAdmin } from "@/lib/auth";
import { getCardById } from "@/lib/cards";
import { getCardUrl } from "@/lib/site-url";

export const metadata = { title: "Edit employee card", robots: { index: false, follow: false } };

export default async function EditCardPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; saved?: string; created?: string }> }) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const card = await getCardById(id);
  if (!card) notFound();
  const url = getCardUrl(card.slug);
  return (
    <main className="min-h-screen bg-slate-50">
      <AdminHeader />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Employee card</p><h1 className="mt-1 text-3xl font-bold text-slate-950">Edit {card.full_name}</h1><p className="mt-2 text-sm text-slate-500">Permanent slug: <code>/card/{card.slug}</code></p></div><Link className="admin-button admin-button-secondary" href={`/admin/cards/${card.id}/preview`}><ExternalLink size={16} />Preview</Link></div>
        {query.error ? <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{query.error}</p> : null}
        {query.saved || query.created ? <p role="status" className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{query.created ? "Card created. Preview it, then publish when ready." : "Changes saved."}</p> : null}
        {card.published ? (
          <section className="my-7 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
            <h2 className="font-bold text-blue-950">Published card</h2><p className="mt-1 break-all text-sm text-blue-800">{url}</p>
            <div className="mt-4 flex flex-wrap gap-2"><CopyButton value={url} /><CopyButton value={url} label="Copy NFC link" /><a className="admin-button admin-button-secondary" href={`/admin/cards/${card.id}/qr`} download={`${card.slug}-qr.png`}><Download size={16} />Download QR code</a><a className="admin-button admin-button-secondary" href={url} target="_blank" rel="noreferrer"><ExternalLink size={16} />Open public card</a></div>
            <div className="mt-5 border-t border-blue-200 pt-4 text-sm text-blue-950"><p className="font-bold">Write this link to an NFC card</p><ol className="mt-2 list-decimal space-y-1 pl-5 text-blue-900"><li>Open NFC Tools on your phone.</li><li>Choose Write → Add a record → URL / URI.</li><li>Paste the copied NFC link, tap Write, then hold the phone over the NFC card.</li><li>Scan the card once to confirm the public profile opens.</li></ol></div>
          </section>
        ) : <div className="my-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">This card is unpublished. Preview and review it, then publish it from the dashboard to activate the permanent URL, QR code and NFC link.</div>}
        <CardForm action={updateCardAction.bind(null, card.id)} card={card} submitLabel="Save changes" />
      </div>
    </main>
  );
}
