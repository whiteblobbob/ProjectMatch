import type { ReactNode } from "react";

type Props = {
  title: string;
  count?: number;
  attention?: boolean;
  action?: ReactNode;
  children: ReactNode;
};

export default function ActivitySection({ title, count, attention = false, action, children }: Props) {
  return (
    <section aria-labelledby={`section-${title.toLowerCase().replaceAll(" ", "-")}`}>
      <div className="mb-4 flex min-h-8 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <h2
            id={`section-${title.toLowerCase().replaceAll(" ", "-")}`}
            className="text-lg font-bold tracking-tight text-slate-950"
          >
            {title}
          </h2>
          {typeof count === "number" && (
            <span
              className={
                attention
                  ? "inline-flex min-w-6 items-center justify-center rounded-full bg-accent-soft px-2 py-1 text-xs font-bold text-accent-text"
                  : "inline-flex min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600"
              }
              aria-label={`${count} item`}
            >
              {count}
            </span>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
