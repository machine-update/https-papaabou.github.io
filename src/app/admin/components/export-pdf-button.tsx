'use client'

export function ExportPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl border border-[#f19b32]/40 bg-[#f19b32]/12 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f19b32] transition hover:bg-[#f19b32]/20"
    >
      Export PDF
    </button>
  )
}
