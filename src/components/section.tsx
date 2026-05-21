export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={"mx-auto max-w-7xl px-4 sm:px-6 " + className}>
      {children}
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          {eyebrow}
        </div>
      )}
      <h2 className="headline text-3xl sm:text-4xl text-ink">{title}</h2>
      {description && (
        <p className={"mt-3 text-base text-muted " + (align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
