import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ol className="flex min-w-max items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <ArrowRightIcon className="size-3.5 shrink-0 text-slate-300" />}
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="rounded-md px-1 py-1 transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined} className={isCurrent ? "px-1 py-1 font-semibold text-slate-900" : "px-1 py-1"}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
