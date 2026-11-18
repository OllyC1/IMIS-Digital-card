import QRCode from "qrcode";
import { requireAdmin } from "@/lib/auth";
import { getCardById } from "@/lib/cards";
import { getCardUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const card = await getCardById(id);
  if (!card || !card.published) return new Response("Publish the card before generating its QR code.", { status: 404 });
  const png = await QRCode.toBuffer(getCardUrl(card.slug), { type: "png", width: 1200, margin: 3, errorCorrectionLevel: "H", color: { dark: "#1e3a8a", light: "#ffffff" } });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Content-Disposition": `attachment; filename="${card.slug}-qr.png"`, "Cache-Control": "private, no-store" } });
}
