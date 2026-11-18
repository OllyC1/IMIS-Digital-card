import Image from "next/image";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/auth";
import { COMPANY } from "@/lib/constants";

export const metadata = { title: "Administrator login", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAdminSession()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white/15 bg-white p-7 shadow-2xl sm:p-9" aria-labelledby="login-title">
        <div className="flex justify-center">
          <div className="relative h-[92px] w-[92px]">
            <Image src={COMPANY.logoPath} alt="IMIS Global" fill sizes="92px" className="rounded-full object-cover shadow-lg" priority />
          </div>
        </div>
        <div className="mt-6 text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-blue-700"><LockKeyhole size={21} /></div><h1 id="login-title" className="mt-4 text-2xl font-bold text-slate-900">Administrator login</h1><p className="mt-2 text-sm text-slate-500">Private access for the sole IMIS Global card administrator.</p></div>
        {error ? <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
        <form action={loginAction} className="mt-7 space-y-5">
          <label className="admin-field"><span>Email address</span><input className="admin-input" type="email" name="email" required autoComplete="username" autoFocus /></label>
          <label className="admin-field"><span>Password</span><input className="admin-input" type="password" name="password" required autoComplete="current-password" /></label>
          <button className="admin-button w-full" type="submit">Sign in securely</button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">No employee accounts or public registration are available.</p>
      </section>
    </main>
  );
}
