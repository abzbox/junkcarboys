import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { btn, field, labelCls } from "@/components/ui";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Junk Car Boys" }] }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="font-display text-4xl font-extrabold text-white italic">Contact</h1>
      <p className="mt-2 text-white/70">Worcester, Massachusetts</p>
      <ul className="mt-4 space-y-2 text-white">
        <li>
          <a className="inline-flex min-h-11 items-center font-bold text-[#ffe500]" href="tel:9788779945">
            (978) 877-9945
          </a>
        </li>
        <li>
          <a className="inline-flex min-h-11 items-center font-bold text-[#ffe500]" href="mailto:junkcarboyscom@gmail.com">
            junkcarboyscom@gmail.com
          </a>
        </li>
      </ul>
      <form
        className="mt-6 rounded-xl border border-white/10 bg-[#12141b] p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const text = note.trim();
          if (!text) return;
          const subject = encodeURIComponent(`Junk Car Boys — ${name.trim() || "message"}`);
          const body = encodeURIComponent(text);
          window.location.href = `mailto:junkcarboyscom@gmail.com?subject=${subject}&body=${body}`;
          setStatus("Your mail app should open. Nothing is stored on this site.");
        }}
      >
        <label className={labelCls} htmlFor="c-name">
          Name
        </label>
        <input id="c-name" className={`${field} mb-3`} value={name} onChange={(event) => setName(event.target.value)} />
        <label className={labelCls} htmlFor="c-note">
          Message
        </label>
        <textarea id="c-note" className={`${field} min-h-28`} value={note} onChange={(event) => setNote(event.target.value)} />
        <button className={`${btn("flare")} mt-3`} type="submit">
          Email this note
        </button>
        {status ? (
          <p className="mt-2 text-sm text-[#ffe500]" role="status">
            {status}
          </p>
        ) : null}
      </form>
    </div>
  );
}
