import { describe, expect, it } from "vitest";
import { createVCard } from "./vcard";
import { slugify } from "./validation";
import type { EmployeeCard } from "../types/card";

const card: EmployeeCard = {
  id: "00000000-0000-0000-0000-000000000001",
  slug: "trevor-evans",
  full_name: "Trevor G Evans",
  job_title: "Chief Executive Officer",
  email: "trevor.e@imisglobal.com",
  office_phone: "+44 (0) 1489 885 343",
  mobile_phone: "+44 (0) 7789 766 537",
  office_address: "25 Barnes Wallis Road, Fareham, UK",
  linkedin_url: "https://www.linkedin.com/in/trevor-evans-imis",
  experience: "25+ Years Maritime Technology Leadership",
  specialties: ["Maritime Information Systems", "Strategic Leadership"],
  photo_url: "/images/trevor-photo.jpeg",
  photo_path: null,
  published: true,
  created_at: "2026-11-18T00:00:00Z",
  updated_at: "2026-11-18T00:00:00Z",
};

describe("permanent card slugs", () => {
  it("normalises names into stable URL-safe values", () => {
    expect(slugify("  María O'Connor  ")).toBe("maria-o-connor");
  });
});

describe("vCard generation", () => {
  it("includes required, optional and fixed company fields with CRLF line endings", () => {
    const output = createVCard(card);
    const unfolded = output.replace(/\r\n /g, "");
    expect(output).toContain("BEGIN:VCARD\r\nVERSION:3.0\r\n");
    expect(output).toContain("FN;CHARSET=UTF-8:Trevor G Evans");
    expect(output).toContain("ORG;CHARSET=UTF-8:IMIS Global;International Maritime Information Systems");
    expect(output).toContain("TEL;TYPE=WORK,VOICE:+44 (0) 1489 885 343");
    expect(unfolded).toContain("X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/trevor-evans-imis");
    expect(output.endsWith("END:VCARD\r\n")).toBe(true);
  });

  it("omits unavailable optional fields", () => {
    const output = createVCard({ ...card, office_phone: null, mobile_phone: null, office_address: null, linkedin_url: null, experience: null, specialties: [] });
    expect(output).not.toContain("TEL;");
    expect(output).not.toContain("ADR;");
    expect(output).not.toContain("X-SOCIALPROFILE");
    expect(output).not.toContain("NOTE;");
  });
});
