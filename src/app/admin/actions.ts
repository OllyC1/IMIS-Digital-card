"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateAdmin, clearAdminSession, createAdminSession, requireAdmin } from "@/lib/auth";
import { createCard, deleteCard, getCardById, setCardPublished, updateCard, uploadProfilePhoto } from "@/lib/cards";
import { parseCardForm, validatePhoto } from "@/lib/validation";

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  let result;
  try {
    result = await authenticateAdmin(email, password, ip);
  } catch (error) {
    redirect(`/admin/login?error=${encodeURIComponent(errorText(error))}`);
  }
  if (!result.ok) {
    redirect(`/admin/login?error=${encodeURIComponent(result.rateLimited ? "Too many login attempts. Try again in 15 minutes." : "Incorrect email or password.")}`);
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createCardAction(formData: FormData) {
  await requireAdmin();
  let cardId: string;
  try {
    const input = parseCardForm(formData);
    const file = validatePhoto(formData.get("photo") as File);
    const photo = file ? await uploadProfilePhoto(file) : null;
    const card = await createCard(input, photo);
    cardId = card.id;
  } catch (error) {
    redirect(`/admin/cards/new?error=${encodeURIComponent(errorText(error))}`);
  }
  redirect(`/admin/cards/${cardId}/edit?created=1`);
}

export async function updateCardAction(id: string, formData: FormData) {
  await requireAdmin();
  const card = await getCardById(id);
  if (!card) redirect("/admin?error=Card%20not%20found");
  try {
    const input = parseCardForm(formData);
    const file = validatePhoto(formData.get("photo") as File);
    const photo = file ? await uploadProfilePhoto(file) : null;
    await updateCard(card, input, photo, formData.get("remove_photo") === "on");
  } catch (error) {
    redirect(`/admin/cards/${card.id}/edit?error=${encodeURIComponent(errorText(error))}`);
  }
  redirect(`/admin/cards/${card.id}/edit?saved=1`);
}

export async function togglePublishedAction(id: string) {
  await requireAdmin();
  const card = await getCardById(id);
  if (!card) redirect("/admin?error=Card%20not%20found");
  await setCardPublished(card, !card.published);
  redirect("/admin");
}

export async function deleteCardAction(id: string) {
  await requireAdmin();
  const card = await getCardById(id);
  if (!card) redirect("/admin?error=Card%20not%20found");
  await deleteCard(card);
  redirect("/admin?deleted=1");
}
