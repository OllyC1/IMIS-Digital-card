import Image from "next/image";
import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { logoutAction } from "@/app/admin/actions";

export function AdminHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src={COMPANY.logoPath} alt="IMIS Global" width={48} height={48} className="rounded-full" />
          <div><p className="font-bold text-slate-900">IMIS Global</p><p className="text-xs text-slate-500">Digital card administration</p></div>
        </Link>
        <nav className="flex items-center gap-2" aria-label="Administrator">
          <Link href="/admin/cards/new" className="admin-button"><Plus size={17} /> <span className="hidden sm:inline">New card</span></Link>
          <form action={logoutAction}><button className="admin-button admin-button-secondary" type="submit"><LogOut size={17} /><span className="hidden sm:inline">Sign out</span></button></form>
        </nav>
      </div>
    </header>
  );
}
