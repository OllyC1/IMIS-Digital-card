import "server-only";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { PROFILE_PHOTO_BUCKET } from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/validation";
import type { EmployeeCard, EmployeeCardInput } from "@/types/card";

function databaseError(context: string, error: { message: string }) {
  return new Error(`${context}: ${error.message}`);
}

export async function listCards() {
  const { data, error } = await getSupabaseAdmin().from("cards").select("*").order("created_at", { ascending: false });
  if (error) throw databaseError("Unable to load cards", error);
  return (data ?? []) as EmployeeCard[];
}

export async function listPublishedCards() {
  const { data, error } = await getSupabaseAdmin().from("cards").select("slug,updated_at").eq("published", true).order("updated_at", { ascending: false });
  if (error) throw databaseError("Unable to load published cards", error);
  return (data ?? []) as Pick<EmployeeCard, "slug" | "updated_at">[];
}

export async function getCardById(id: string) {
  const { data, error } = await getSupabaseAdmin().from("cards").select("*").eq("id", id).maybeSingle();
  if (error) throw databaseError("Unable to load card", error);
  return data as EmployeeCard | null;
}

export async function getPublishedCardBySlug(slug: string) {
  const { data, error } = await getSupabaseAdmin().from("cards").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) throw databaseError("Unable to load card", error);
  return data as EmployeeCard | null;
}

export async function createPermanentSlug(fullName: string) {
  const base = slugify(fullName);
  let candidate = base;
  let suffix = 2;
  while (true) {
    const { data, error } = await getSupabaseAdmin().from("cards").select("id").eq("slug", candidate).maybeSingle();
    if (error) throw databaseError("Unable to create card URL", error);
    if (!data) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

export async function uploadProfilePhoto(file: File) {
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${randomUUID()}/${randomUUID()}.${extension}`;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(PROFILE_PHOTO_BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw databaseError("Unable to upload profile photo", error);
  const { data } = supabase.storage.from(PROFILE_PHOTO_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function removeProfilePhoto(path: string | null) {
  if (!path) return;
  const { error } = await getSupabaseAdmin().storage.from(PROFILE_PHOTO_BUCKET).remove([path]);
  if (error) throw databaseError("Unable to remove profile photo", error);
}

export async function createCard(input: EmployeeCardInput, photo?: { path: string; url: string } | null) {
  const slug = await createPermanentSlug(input.full_name);
  const { data, error } = await getSupabaseAdmin()
    .from("cards")
    .insert({ ...input, slug, photo_path: photo?.path ?? null, photo_url: photo?.url ?? null })
    .select("*")
    .single();
  if (error) {
    if (photo) await removeProfilePhoto(photo.path).catch(() => undefined);
    throw databaseError("Unable to create card", error);
  }
  revalidatePath("/admin");
  return data as EmployeeCard;
}

export async function updateCard(card: EmployeeCard, input: EmployeeCardInput, photo?: { path: string; url: string } | null, removePhoto = false) {
  const photoFields = photo ? { photo_path: photo.path, photo_url: photo.url } : removePhoto ? { photo_path: null, photo_url: null } : {};
  const { data, error } = await getSupabaseAdmin().from("cards").update({ ...input, ...photoFields }).eq("id", card.id).select("*").single();
  if (error) {
    if (photo) await removeProfilePhoto(photo.path).catch(() => undefined);
    throw databaseError("Unable to update card", error);
  }
  if ((photo || removePhoto) && card.photo_path) await removeProfilePhoto(card.photo_path);
  revalidatePath("/admin");
  revalidatePath(`/card/${card.slug}`);
  return data as EmployeeCard;
}

export async function setCardPublished(card: EmployeeCard, published: boolean) {
  const { error } = await getSupabaseAdmin().from("cards").update({ published }).eq("id", card.id);
  if (error) throw databaseError("Unable to change publication status", error);
  revalidatePath("/admin");
  revalidatePath(`/card/${card.slug}`);
}

export async function deleteCard(card: EmployeeCard) {
  if (card.photo_path) await removeProfilePhoto(card.photo_path);
  const { error } = await getSupabaseAdmin().from("cards").delete().eq("id", card.id);
  if (error) throw databaseError("Unable to delete card", error);
  revalidatePath("/admin");
}
