import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" };

export function Button({ className = "", variant = "default", type = "button", ...props }: Props) {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50";
  const style = variant === "outline" ? "border bg-transparent" : "bg-slate-900 text-white";
  return <button type={type} className={`${base} ${style} ${className}`} {...props} />;
}
