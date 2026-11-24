import { cn, mediaUrl } from "@/utils/cn";
import { initials } from "@/utils/format";

const SIZE = {
  sm: "h-9 w-9 text-[11px] ring-2 ring-white shadow-sm",
  md: "h-16 w-16 text-lg ring-4 ring-white shadow-md",
  lg: "h-24 w-24 text-2xl ring-4 ring-white shadow-md"
};

export function EmployeeAvatar({
  name,
  photoUrl,
  size = "md",
  className = ""
}: {
  name: string;
  photoUrl?: string;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const src = mediaUrl(photoUrl);
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-navy to-navy-700 font-bold text-white",
        SIZE[size],
        className
      )}
    >
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initials(name || "NA")}
    </span>
  );
}
