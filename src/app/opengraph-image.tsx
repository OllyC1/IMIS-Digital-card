import { ImageResponse } from "next/og";
import { COMPANY } from "@/lib/constants";

export const alt = "IMIS Global official digital business cards";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0f172a,#1e3a8a,#1e293b)", color: "white", fontFamily: "Arial" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><div style={{ fontSize: 70, fontWeight: 800 }}>{COMPANY.name}</div><div style={{ marginTop: 20, color: "#67e8f9", fontSize: 32 }}>{COMPANY.fullName}</div><div style={{ marginTop: 45, border: "1px solid rgba(255,255,255,.35)", borderRadius: 999, padding: "16px 30px", fontSize: 24 }}>Official Digital Business Cards</div></div>
    </div>,
    size,
  );
}
