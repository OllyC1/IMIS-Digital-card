import Link from "next/link";
import { Download, Eye, Pencil, Plus, QrCode } from "lucide-react";
import { togglePublishedAction, deleteCardAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/admin-header";
import { CopyButton } from "@/components/copy-button";
import { DeleteCardButton } from "@/components/delete-card-button";
import { requireAdmin } from "@/lib/auth";
import { listCards } from "@/lib/cards";
import { getCardUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const metadata = { title: "Card administration", robots: { index: false, follow: false } };

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ deleted?: string; error?: string }> }) {
  await requireAdmin();
  const [cards, query] = await Promise.all([listCards(), searchParams]);
  return (
    <main className="min-h-screen bg-slate-50">
      <AdminHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Administrator dashboard</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Employee cards</h1><p className="mt-2 text-sm text-slate-500">Create, preview, publish and manage every IMIS Global card.</p></div><Link href="/admin/cards/new" className="admin-button"><Plus size={17} />Create new card</Link></div>
        {query.deleted ? <p role="status" className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Card deleted.</p> : null}
        {query.error ? <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{query.error}</p> : null}

        {cards.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><h2 className="text-xl font-bold text-slate-900">No cards yet</h2><p className="mt-2 text-sm text-slate-500">Create the first employee card to begin.</p><Link href="/admin/cards/new" className="admin-button mt-6"><Plus size={17} />Create card</Link></section>
        ) : (
          <div className="mt-8 grid gap-5">
            {cards.map((card) => {
              const url = getCardUrl(card.slug);
              return (
                <article key={card.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      {card.photo_url ? <img src={card.photo_url} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-blue-100" /* eslint-disable-line @next/next/no-img-element */ /> : <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 font-bold text-blue-800">{card.full_name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("")}</div>}
                      <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-lg font-bold text-slate-900">{card.full_name}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${card.published ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>{card.published ? "Published" : "Unpublished"}</span></div><p className="mt-1 text-sm text-slate-600">{card.job_title}</p><p className="mt-1 truncate text-xs text-slate-400">/card/{card.slug}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link className="admin-button admin-button-secondary" href={`/admin/cards/${card.id}/preview`}><Eye size={16} />Preview</Link>
                      <Link className="admin-button admin-button-secondary" href={`/admin/cards/${card.id}/edit`}><Pencil size={16} />Edit</Link>
                      <form action={togglePublishedAction.bind(null, card.id)}><button className="admin-button" type="submit">{card.published ? "Unpublish" : "Publish"}</button></form>
                      <DeleteCardButton action={deleteCardAction.bind(null, card.id)} name={card.full_name} />
                    </div>
                  </div>
                  {card.published ? <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5"><CopyButton value={url} /><CopyButton value={url} label="Copy NFC link" /><a className="admin-button admin-button-secondary" href={`/admin/cards/${card.id}/qr`} download={`${card.slug}-qr.png`}><Download size={16} />Download QR</a><a className="admin-button admin-button-secondary" href={url} target="_blank" rel="noreferrer"><QrCode size={16} />Open public card</a></div> : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
