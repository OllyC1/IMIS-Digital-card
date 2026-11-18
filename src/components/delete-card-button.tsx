"use client";

import { Trash2 } from "lucide-react";

export function DeleteCardButton({ action, name }: { action: () => void | Promise<void>; name: string }) {
  return <form action={action} onSubmit={(event) => { if (!window.confirm(`Permanently delete ${name}'s card? This cannot be undone.`)) event.preventDefault(); }}><button className="admin-button admin-button-danger" type="submit"><Trash2 size={16} />Delete</button></form>;
}
