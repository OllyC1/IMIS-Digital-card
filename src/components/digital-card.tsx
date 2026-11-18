"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Building2,
  BriefcaseBusiness,
  Download,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Share2,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { COMPANY } from "@/lib/constants";
import type { EmployeeCard } from "@/types/card";

const particles = [
  [8, 13, 0.2, 3.1], [18, 72, 1.1, 4.2], [26, 36, 2.2, 2.8], [34, 86, 0.6, 3.5],
  [43, 18, 1.8, 4.7], [51, 58, 0.1, 2.6], [59, 92, 2.7, 4.1], [67, 29, 1.3, 3.2],
  [76, 67, 0.8, 4.5], [85, 10, 2.4, 2.9], [92, 44, 1.6, 3.8], [12, 48, 2.9, 4.9],
  [23, 95, 0.4, 3.6], [38, 7, 1.5, 2.7], [48, 78, 2.1, 4.3], [62, 49, 0.9, 3],
  [71, 4, 2.5, 4.6], [81, 88, 1.2, 3.3], [95, 75, 0.3, 4], [4, 91, 1.9, 2.5],
] as const;

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

type Props = { card: EmployeeCard; publicUrl: string; vcard: string };

export function DigitalCard({ card, publicUrl, vcard }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<"contact" | "about">("contact");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsLoaded(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const contactItems = useMemo(() => [
    card.office_phone ? { icon: Phone, label: "Office", value: card.office_phone, href: `tel:${card.office_phone}`, color: "bg-blue-100 text-blue-600" } : null,
    card.mobile_phone ? { icon: Phone, label: "Mobile", value: card.mobile_phone, href: `tel:${card.mobile_phone}`, color: "bg-green-100 text-green-600" } : null,
    { icon: Mail, label: "Email", value: card.email, href: `mailto:${card.email}`, color: "bg-red-100 text-red-600" },
    { icon: Globe, label: "Website", value: COMPANY.website, href: COMPANY.websiteUrl, color: "bg-purple-100 text-purple-600" },
    card.linkedin_url ? { icon: BriefcaseBusiness, label: "LinkedIn", value: "View professional profile", href: card.linkedin_url, color: "bg-sky-100 text-sky-700" } : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item)), [card]);

  function downloadVCard() {
    setIsDownloading(true);
    const url = URL.createObjectURL(new Blob([vcard], { type: "text/vcard;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${card.full_name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    window.setTimeout(() => {
      setIsDownloading(false);
      setToast("Contact saved successfully");
    }, 600);
  }

  async function shareContact() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.full_name} - ${card.job_title}`,
          text: `Connect with ${card.full_name}, ${card.job_title} at ${COMPANY.name}`,
          url: publicUrl,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(publicUrl);
    setToast("Profile link copied");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      <div className="absolute inset-0" aria-hidden="true">
        {particles.map(([left, top, delay, duration], index) => (
          <div key={index} className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse" style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s`, animationDuration: `${duration}s` }} />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        <div className={`transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full blur-lg opacity-60 animate-pulse" />
              <div className="relative bg-white rounded-full p-4 shadow-2xl border-4 border-white/50">
                <Image src={COMPANY.logoPath} alt="IMIS Global Logo" width={100} height={100} className="rounded-full" priority />
              </div>
            </div>
          </div>

          <Card className="mb-8 overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 reference-pattern" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                      {card.photo_url ? (
                        // Dynamic Supabase image hosts cannot be enumerated at build time.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.photo_url} alt={card.full_name} width={140} height={140} className="relative w-[140px] h-[140px] rounded-full border-4 border-white shadow-2xl object-cover transform transition-transform duration-300 hover:scale-105" />
                      ) : (
                        <div aria-label={`${card.full_name} profile placeholder`} className="relative grid w-[140px] h-[140px] place-items-center rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-slate-100 to-blue-100 text-blue-800 text-4xl font-bold">
                          {initials(card.full_name)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center text-white">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">{card.full_name}</h1>
                    <div className="flex justify-center mb-3">
                      <Badge className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white border-0 px-4 py-1 text-sm font-medium shadow-lg">{card.job_title}</Badge>
                    </div>
                    {card.experience ? (
                      <div className="flex items-center justify-center gap-1 text-cyan-300 mb-2">
                        <Star className="w-4 h-4 fill-current" /><span className="text-sm font-medium">{card.experience}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-white to-blue-50 px-8 py-6 border-t border-blue-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-700 mb-1"><Building2 className="w-5 h-5" /><span className="text-xl font-bold">{COMPANY.name}</span></div>
                  <p className="text-blue-600 text-sm font-medium">{COMPANY.fullName}</p>
                  <div className="mt-3 flex items-center justify-center gap-4 text-xs text-blue-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />Maritime Technology Leader</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Global Operations</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className={`transform transition-all duration-1000 delay-200 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="flex bg-white/10 backdrop-blur-xl rounded-2xl p-1 mb-6 border border-white/20">
            {([{ id: "contact", label: "Contact", icon: Phone }, { id: "about", label: "About", icon: Star }] as const).map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveSection(id)} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${activeSection === id ? "bg-white text-blue-600 shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                <Icon className="w-4 h-4" /><span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`transform transition-all duration-1000 delay-400 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          {activeSection === "contact" ? (
            <Card className="mb-8 shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2"><Phone className="w-6 h-6 text-blue-600" />Contact Information</h2>
                <div className="space-y-6">
                  {contactItems.map(({ icon: Icon, label, value, href, color }) => (
                    <div key={label} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                      <div className={`${color} p-3 rounded-full group-hover:scale-110 transition-transform duration-300`}><Icon className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0"><p className="text-sm text-gray-600 font-medium">{label}</p><a href={href} className="block break-words text-gray-800 hover:text-blue-600 transition-colors font-semibold group-hover:underline" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>{value}</a></div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  ))}
                  {card.office_address ? (
                    <div className="border-t pt-6"><div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"><div className="bg-orange-100 p-3 rounded-full"><MapPin className="w-5 h-5 text-orange-600" /></div><div><p className="text-sm text-gray-600 font-medium mb-1">Address</p><p className="text-gray-800 leading-relaxed">{card.office_address}</p></div></div></div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2"><Star className="w-6 h-6 text-blue-600" />Professional Profile</h2>
                <div className="space-y-6">
                  {card.experience ? <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"><h3 className="font-semibold text-gray-800 mb-2">Experience</h3><p className="text-gray-700">{card.experience}</p></div> : null}
                  {card.specialties.length ? <div><h3 className="font-semibold text-gray-800 mb-4">Areas of Expertise</h3><div className="grid grid-cols-1 gap-3">{card.specialties.map((specialty) => <div key={specialty} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><span className="w-2 h-2 bg-blue-600 rounded-full" /><span className="text-gray-700 font-medium">{specialty}</span></div>)}</div></div> : null}
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl"><h3 className="font-semibold text-gray-800 mb-2">About IMIS Global</h3><p className="text-gray-700 leading-relaxed">Leading provider of International Maritime Information Systems, delivering cutting-edge technology solutions for the global maritime industry.</p></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className={`space-y-4 transform transition-all duration-1000 delay-600 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <Button onClick={downloadVCard} disabled={isDownloading} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 border-0"><Download className="w-6 h-6 mr-3" />{isDownloading ? "Saving Contact..." : "Save to Contacts"}</Button>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={shareContact} variant="outline" className="py-6 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-xl transform transition-all duration-300 hover:scale-105"><Share2 className="w-5 h-5 mr-2" />Share</Button>
            <Button onClick={() => window.open(COMPANY.websiteUrl, "_blank", "noopener,noreferrer")} variant="outline" className="py-6 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-xl transform transition-all duration-300 hover:scale-105"><Globe className="w-5 h-5 mr-2" />Website</Button>
          </div>
        </div>

        <div className={`text-center mt-12 transform transition-all duration-1000 delay-800 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"><div className="flex items-center justify-center gap-2 text-white/80 mb-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-sm font-medium">Powered by NFC Technology</span></div><p className="text-white/60 text-xs">© {new Date().getFullYear()} IMIS Global. Premium Digital Business Card</p></div>
        </div>
      </div>
      {toast ? <div role="status" className="fixed z-50 right-5 bottom-5 rounded-xl bg-white px-5 py-4 text-sm font-semibold text-blue-900 shadow-2xl">{toast}</div> : null}
    </main>
  );
}
