import type { EmployeeCard } from "@/types/card";

type Props = { action: (formData: FormData) => void | Promise<void>; card?: EmployeeCard | null; submitLabel: string };

export function CardForm({ action, card, submitLabel }: Props) {
  return (
    <form action={action} className="space-y-7" encType="multipart/form-data">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">Employee details</h2>
        <p className="mt-1 text-sm text-slate-500">Required information appears on every card.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="admin-field"><span>Full name *</span><input className="admin-input" name="full_name" defaultValue={card?.full_name} required maxLength={120} autoComplete="name" /></label>
          <label className="admin-field"><span>Job title *</span><input className="admin-input" name="job_title" defaultValue={card?.job_title} required maxLength={120} /></label>
          <label className="admin-field sm:col-span-2"><span>Email address *</span><input className="admin-input" name="email" type="email" defaultValue={card?.email} required maxLength={200} autoComplete="email" /></label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">Optional contact details</h2>
        <p className="mt-1 text-sm text-slate-500">Empty fields are hidden from the public card.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="admin-field"><span>Office telephone</span><input className="admin-input" name="office_phone" type="tel" defaultValue={card?.office_phone ?? ""} maxLength={60} autoComplete="tel" /></label>
          <label className="admin-field"><span>Mobile telephone</span><input className="admin-input" name="mobile_phone" type="tel" defaultValue={card?.mobile_phone ?? ""} maxLength={60} /></label>
          <label className="admin-field sm:col-span-2"><span>Office address</span><textarea className="admin-input min-h-24 resize-y" name="office_address" defaultValue={card?.office_address ?? ""} maxLength={500} /></label>
          <label className="admin-field sm:col-span-2"><span>LinkedIn URL</span><input className="admin-input" name="linkedin_url" type="url" placeholder="https://www.linkedin.com/in/..." defaultValue={card?.linkedin_url ?? ""} maxLength={500} /></label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">Professional profile</h2>
        <div className="mt-6 grid gap-5">
          <label className="admin-field"><span>Experience statement</span><textarea className="admin-input min-h-24 resize-y" name="experience" defaultValue={card?.experience ?? ""} maxLength={800} placeholder="25+ Years Maritime Technology Leadership" /></label>
          <label className="admin-field"><span>Areas of expertise / specialities</span><textarea className="admin-input min-h-32 resize-y" name="specialties" defaultValue={card?.specialties.join("\n") ?? ""} placeholder="Enter one speciality per line" /></label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">Profile photograph</h2>
        <p className="mt-1 text-sm text-slate-500">Optional JPEG, PNG or WebP, up to 5 MB. A professional initials fallback is shown when absent.</p>
        {card?.photo_url ? (
          <div className="mt-5 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.photo_url} alt="Current profile" className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-100" />
            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name="remove_photo" /> Remove current photo</label>
          </div>
        ) : null}
        <label className="admin-field mt-5"><span>{card?.photo_url ? "Replace photograph" : "Upload photograph"}</span><input className="admin-input" name="photo" type="file" accept="image/jpeg,image/png,image/webp" /></label>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button className="admin-button min-w-36" type="submit">{submitLabel}</button>
        <a href="/admin" className="admin-button admin-button-secondary">Cancel</a>
      </div>
    </form>
  );
}
