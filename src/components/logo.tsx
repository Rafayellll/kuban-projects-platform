export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-9 w-9 rounded-xl bg-brand-600 text-white grid place-items-center shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Zm0 4.2 5.5 2.7v3.2c0 3.7-2.4 7-5.5 7.6-3.1-.6-5.5-3.9-5.5-7.6V8.9L12 6.2Z"
          />
          <path fill="#E8A23B" d="M9.5 12.5 11 14l4-4 1 1.2-5 5-2.7-2.7 1.2-1Z" />
        </svg>
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-extrabold tracking-tight text-ink">ПроКубань</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted">talent · projects · region</div>
      </div>
    </div>
  );
}
