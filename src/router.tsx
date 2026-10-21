import { createRouter, Link } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { previewPathRewrite } from "@/lib/preview-path-prefix";
import { routeTree } from "./routeTree.gen";

function Missing() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-6xl leading-none text-rust">404</p>
      <h1 className="font-display text-3xl uppercase tracking-wide text-fg">Not on this lot</h1>
      <p className="text-muted">That page isn't on the board.</p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-md bg-rust px-4 font-semibold text-rust-ink"
      >
        Back to the yard
      </Link>
    </main>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    rewrite: previewPathRewrite(),
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: Missing,
  });
}
