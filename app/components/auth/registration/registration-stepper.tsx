import type { RegistrationStepId } from "./registration-types";

export type RegistrationStep = {
  id: RegistrationStepId;
  label: string;
};

type RegistrationStepperProps = {
  steps: RegistrationStep[];
  activeStep: RegistrationStepId;
  onStepSelect: (step: RegistrationStepId) => void;
};

export default function RegistrationStepper({
  steps,
  activeStep,
  onStepSelect,
}: RegistrationStepperProps) {
  const activeIndex = steps.findIndex((step) => step.id === activeStep);

  return (
    <nav aria-label="Tahapan pendaftaran" className="max-w-full overflow-x-auto pb-2">
      <ol className="flex min-w-max items-start">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isComplete = index < activeIndex;
          const isReachable = index <= activeIndex;

          return (
            <li key={step.id} className="flex items-start last:flex-none">
              <button
                type="button"
                onClick={() => isReachable && onStepSelect(step.id)}
                disabled={!isReachable}
                aria-current={isActive ? "step" : undefined}
                className="group flex min-w-[88px] flex-col items-center gap-2 rounded-lg px-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-default"
              >
                <span
                  className={`grid size-9 place-items-center rounded-full border text-sm font-bold transition-colors ${
                    isActive
                      ? "border-brand-primary bg-brand-primary text-white"
                      : isComplete
                        ? "border-brand-primary bg-brand-soft text-brand-primary"
                        : "border-slate-300 bg-white text-slate-500"
                  }`}
                  aria-hidden="true"
                >
                  {isComplete ? (
                    <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.25">
                      <path d="m4.5 10.5 3.2 3.2 7.8-8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : index + 1}
                </span>
                <span className={`text-xs font-semibold ${isActive ? "text-brand-primary" : "text-slate-600"}`}>
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <span
                  className={`mt-[17px] h-px w-5 sm:w-10 ${index < activeIndex ? "bg-brand-primary" : "bg-slate-200"}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
