"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ value, label = "Copy public URL" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return <button type="button" className="admin-button admin-button-secondary" onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 2000); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : label}</button>;
}
