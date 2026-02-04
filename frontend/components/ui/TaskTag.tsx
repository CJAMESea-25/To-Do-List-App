export default function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">
      {label}
    </span>
  );
}
