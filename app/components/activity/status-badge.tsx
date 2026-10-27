type Props = {
  children: React.ReactNode;
  tone?: "attention" | "success" | "neutral" | "brand";
};

const tones = {
  attention: "bg-accent-soft text-accent-text",
  success: "bg-success-background text-success-text",
  neutral: "bg-slate-100 text-slate-700",
  brand: "bg-brand-soft text-brand-primary",
};

export default function StatusBadge({ children, tone = "neutral" }: Props) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
