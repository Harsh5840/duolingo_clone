import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-green text-white shadow-[0_4px_0_var(--green-lip)] hover:brightness-105",
  secondary:
    "bg-surface text-blue border-2 border-border shadow-[0_4px_0_var(--border)]",
  danger:
    "bg-red text-white shadow-[0_4px_0_var(--red-lip)]",
  gold:
    "bg-gold text-ink shadow-[0_4px_0_var(--gold-lip)]",
  ghost:
    "bg-surface text-muted border-2 border-border shadow-[0_4px_0_var(--border)]",
} as const;

export function DuoButton({
  variant = "primary",
  className = "",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`rounded-2xl px-6 py-3 font-extrabold uppercase tracking-[0.8px] transition-transform duration-75 enabled:active:translate-y-1 enabled:active:shadow-none disabled:bg-[#e5e5e5] disabled:text-[#afafaf] disabled:shadow-[0_4px_0_#cfcfcf] disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
