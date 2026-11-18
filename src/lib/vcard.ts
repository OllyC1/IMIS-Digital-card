import { COMPANY } from "./constants";
import type { EmployeeCard } from "../types/card";

function escapeValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function folded(line: string) {
  const pieces: string[] = [];
  let remaining = line;
  while (Buffer.byteLength(remaining, "utf8") > 73) {
    let index = Math.min(73, remaining.length);
    while (Buffer.byteLength(remaining.slice(0, index), "utf8") > 73) index--;
    pieces.push(remaining.slice(0, index));
    remaining = remaining.slice(index);
  }
  pieces.push(remaining);
  return pieces.join("\r\n ");
}

export function createVCard(card: EmployeeCard) {
  const nameParts = card.full_name.trim().split(/\s+/);
  const family = nameParts.length > 1 ? nameParts.pop()! : "";
  const given = nameParts.shift() ?? card.full_name;
  const middle = nameParts.join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN;CHARSET=UTF-8:${escapeValue(card.full_name)}`,
    `N;CHARSET=UTF-8:${escapeValue(family)};${escapeValue(given)};${escapeValue(middle)};;`,
    `ORG;CHARSET=UTF-8:${escapeValue(COMPANY.name)};${escapeValue(COMPANY.fullName)}`,
    `TITLE;CHARSET=UTF-8:${escapeValue(card.job_title)}`,
    card.office_phone ? `TEL;TYPE=WORK,VOICE:${escapeValue(card.office_phone)}` : null,
    card.mobile_phone ? `TEL;TYPE=CELL,VOICE:${escapeValue(card.mobile_phone)}` : null,
    `EMAIL;TYPE=INTERNET,WORK:${escapeValue(card.email)}`,
    `URL;TYPE=WORK:${COMPANY.websiteUrl}`,
    card.linkedin_url ? `X-SOCIALPROFILE;TYPE=linkedin:${escapeValue(card.linkedin_url)}` : null,
    card.office_address ? `ADR;TYPE=WORK;CHARSET=UTF-8:;;${escapeValue(card.office_address)};;;;` : null,
    card.experience ? `NOTE;CHARSET=UTF-8:${escapeValue(card.experience)}` : null,
    card.specialties.length ? `CATEGORIES;CHARSET=UTF-8:${card.specialties.map(escapeValue).join(",")}` : null,
    "END:VCARD",
  ].filter((line): line is string => Boolean(line));
  return `${lines.map(folded).join("\r\n")}\r\n`;
}
