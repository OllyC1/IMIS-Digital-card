import { AdminHeader } from "@/components/admin-header";
import { CardForm } from "@/components/card-form";
import { createCardAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Create employee card", robots: { index: false, follow: false } };

export default async function NewCardPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;
  return <main className="min-h-screen bg-slate-50"><AdminHeader /><div className="mx-auto max-w-4xl px-4 py-8 sm:px-6"><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">New employee</p><h1 className="mt-1 text-3xl font-bold text-slate-950">Create digital card</h1><p className="mt-2 text-sm text-slate-500">The permanent URL is generated from the employee’s name and will not change after creation.</p>{error ? <p role="alert" className="my-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : <div className="h-6" />}<CardForm action={createCardAction} submitLabel="Create card" /></div></main>;
}
