import { getPublishedCardBySlug } from "@/lib/cards";
import { createVCard } from "@/lib/vcard";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = await getPublishedCardBySlug(slug);
  if (!card) return new Response("Not found", { status: 404 });
  return new Response(createVCard(card), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${card.slug}.vcf"`,
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
