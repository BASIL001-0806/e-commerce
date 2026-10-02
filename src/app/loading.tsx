export default function Loading() {
  return (
    <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-3 px-4 py-28">
      <span className="spin h-8 w-8 rounded-full border-2 border-slate-200 border-t-brand" />
      <p className="text-[13px] font-medium text-muted">Loading products…</p>
    </div>
  );
}
