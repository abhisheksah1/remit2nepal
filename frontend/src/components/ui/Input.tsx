import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id ?? props.name;
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-navy">{label}</span> : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-md border border-navy/15 bg-white px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink-muted/70 focus:border-gold focus:ring-2 focus:ring-gold/20",
          error && "border-red-400 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {hint && !error ? <span className="text-xs text-ink-muted">{hint}</span> : null}
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
});
