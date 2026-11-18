import { MAX_PHOTO_BYTES } from "./constants";
import type { EmployeeCardInput } from "../types/card";

const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function required(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) throw new Error(`${name.replaceAll("_", " ")} is required.`);
  return value;
}

function optional(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

export function parseCardForm(formData: FormData): EmployeeCardInput {
  const email = required(formData, "email").toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");

  const linkedin = optional(formData, "linkedin_url");
  if (linkedin) {
    const url = new URL(linkedin);
    if (url.protocol !== "https:" || !/(^|\.)linkedin\.com$/i.test(url.hostname)) {
      throw new Error("LinkedIn must be a secure linkedin.com URL.");
    }
  }

  const specialties = String(formData.get("specialties") ?? "")
    .split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 20);

  return {
    full_name: required(formData, "full_name"),
    job_title: required(formData, "job_title"),
    email,
    office_phone: optional(formData, "office_phone"),
    mobile_phone: optional(formData, "mobile_phone"),
    office_address: optional(formData, "office_address"),
    linkedin_url: linkedin,
    experience: optional(formData, "experience"),
    specialties,
  };
}

export function validatePhoto(file: File) {
  if (!file.size) return null;
  if (!PHOTO_TYPES.has(file.type)) throw new Error("Profile photo must be JPEG, PNG or WebP.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Profile photo must be 5 MB or smaller.");
  return file;
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "employee";
}
