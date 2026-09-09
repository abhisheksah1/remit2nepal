import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Trash2 } from "lucide-react";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { mediaUrl } from "@/utils/cn";

export function ImageUploadField({
  label,
  value,
  folder = "about",
  hint,
  onChange
}: {
  label: string;
  value: string;
  folder?: string;
  hint?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();
  const upload = useMutation({
    mutationFn: (file: File) => adminApi.media.upload(file, label, folder),
    onSuccess: (media) => {
      onChange(media.url);
      push({ title: "Image uploaded", tone: "success" });
    },
    onError: (error) => push({ title: getErrorMessage(error, "Could not upload image"), tone: "error" })
  });

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-navy">{label}</span>
      {value ? (
        <div className="overflow-hidden rounded-xl border border-navy/10 bg-navy-50">
          <img src={mediaUrl(value)} alt="" className="h-40 w-full object-cover" />
        </div>
      ) : (
        <div className="grid h-28 place-items-center rounded-xl border border-dashed border-navy/20 bg-navy-50 text-xs text-ink-muted">
          No image yet — upload from this panel
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
          <ImagePlus className="h-4 w-4" />
          {upload.isPending ? "Uploading…" : "Upload image"}
        </Button>
        {value ? (
          <Button type="button" variant="ghost" onClick={() => onChange("")}>
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) upload.mutate(file);
        }}
      />
      <Input
        label="Or paste image URL"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="/uploads/about/office.jpg"
        hint={hint}
      />
    </div>
  );
}
