import type { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "./icons";

type SelectControlProps = SelectHTMLAttributes<HTMLSelectElement> & {
  containerClassName?: string;
};

export function SelectControl({
  className = "",
  containerClassName = "",
  children,
  ...props
}: SelectControlProps) {
  return (
    <div className={`relative flex min-h-12 min-w-0 items-center ${containerClassName}`}>
      <select
        {...props}
        className={`peer min-h-12 w-full min-w-0 appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-12 text-left text-sm font-medium text-slate-800 outline-none transition hover:border-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-5 shrink-0 -translate-y-1/2 text-slate-500 transition-colors peer-focus:text-brand-primary" />
    </div>
  );
}
