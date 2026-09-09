import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, className, id, placeholder, ...props },
  ref
) {
  const selectId = id ?? props.name;
  return (
    <label className="block space-y-1.5" htmlFor={selectId}>
      {label ? <span className="text-sm font-medium text-navy">{label}</span> : null}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          "w-full rounded-md border border-navy/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20",
          error && "border-red-400",
          className
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
});
