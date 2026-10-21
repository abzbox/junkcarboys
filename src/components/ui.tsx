import type { ReactNode } from "react";

const kinds = {
  rust: "bg-rust text-rust-ink hover:bg-bone",
  flare: "bg-flare text-white hover:brightness-110",
  ghost: "bg-transparent text-fg hover:bg-raised",
  line: "border border-line bg-surface text-fg hover:border-rust",
  quiet: "bg-transparent text-muted hover:text-fg",
} as const;

export function btn(kind: keyof typeof kinds = "rust", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-md px-4 font-semibold min-h-11 transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 ${kinds[kind]} ${extra}`;
}

export const field =
  "min-h-11 w-full rounded-md border border-line bg-bg px-3 text-base text-fg placeholder:text-faint";

export const labelCls = "mb-1 block text-sm font-medium text-muted";

export function Stamp({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-rust px-2 py-1 font-display text-sm uppercase tracking-widest text-rust">
      {children}
    </span>
  );
}

export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>;
}
