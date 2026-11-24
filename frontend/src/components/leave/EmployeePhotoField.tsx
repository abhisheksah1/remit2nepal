import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Trash2 } from "lucide-react";
import { leaveApi } from "@/api/leave.api";
import { getErrorMessage } from "@/api/client";
import { EmployeeAvatar } from "@/components/leave/EmployeeAvatar";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function EmployeePhotoField({
  name,
  value,
  onChange
}: {
  name: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();
  const upload = useMutation({
    mutationFn: (file: File) => leaveApi.employees.uploadPhoto(file),
    onSuccess: (data) => {
      onChange(data.url);
      push({ title: "Photo uploaded", tone: "success" });
    },
    onError: (error) => push({ title: getErrorMessage(error, "Could not upload photo"), tone: "error" })
  });

  return (
    <div className="rounded-2xl border border-navy/10 bg-navy-50/70 p-4">
      <p className="mb-3 text-sm font-medium text-navy">Profile photo</p>
      <div className="flex items-center gap-4">
        <EmployeeAvatar name={name || "New"} photoUrl={value} size="lg" className="ring-navy/10" />
        <div className="min-w-0 space-y-2">
          <p className="text-xs text-ink-muted">Square JPG, PNG, or WebP. This photo shows on the employee card and leave history.</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
              <ImagePlus className="h-4 w-4" />
              {upload.isPending ? "Uploading…" : value ? "Change photo" : "Upload photo"}
            </Button>
            {value ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) upload.mutate(file);
        }}
      />
    </div>
  );
}
