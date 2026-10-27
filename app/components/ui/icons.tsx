import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const iconDefaults = {
  "aria-hidden": true,
  fill: "none",
  focusable: false,
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
} as const;

export function ChevronDownIcon({ className = "size-[18px]", ...props }: IconProps) {
  return (
    <svg {...iconDefaults} {...props} viewBox="0 0 24 24" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PlusIcon({ className = "size-[18px]", ...props }: IconProps) {
  return (
    <svg {...iconDefaults} {...props} viewBox="0 0 24 24" className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function XIcon({ className = "size-[18px]", ...props }: IconProps) {
  return (
    <svg {...iconDefaults} {...props} viewBox="0 0 24 24" className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
