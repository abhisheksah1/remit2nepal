import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, rows = 5, ...props },
  ref
) {
  const areaId = id ?? props.name;
  return (
    <label className="block space-y-1.5" htmlFor={areaId}>
      {label ? <span className="text-sm font-medium text-navy">{label}</span> : null}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        className={cn(
          "w-full rounded-md border border-navy/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20",
          error && "border-red-400",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
});
