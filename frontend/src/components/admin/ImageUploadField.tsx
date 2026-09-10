import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Trash2 } from "lucide-react";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { mediaUrl } from "@/utils/cn";
import { detectImageRatio, ratioLabel, type ImageRatio } from "@/utils/image-ratio";

export function ImageUploadField({
  label,
  value,
  folder = "about",
  hint,
  fit = "cover",
  ratio,
  onChange,
  onRatioDetected
}: {
  label: string;
  value: string;
  folder?: string;
  hint?: string;
  fit?: "cover" | "contain";
  ratio?: string;
  onChange: (url: string) => void;
  onRatioDetected?: (ratio: ImageRatio) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlTimer = useRef<number>();
  const { push } = useToast();

  async function applyRatio(source: File | string) {
    if (!onRatioDetected) return;
    try {
      onRatioDetected(await detectImageRatio(source));
    } catch {
      return;
    }
  }

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
          <div className={fit === "contain" ? "grid place-items-center p-3" : ""}>
            <img
              src={mediaUrl(value)}
              alt=""
              className={fit === "contain" ? "max-h-72 max-w-full object-contain" : "h-40 w-full object-cover"}
            />
          </div>
        </div>
      ) : (
        <div className="grid h-28 place-items-center rounded-xl border border-dashed border-navy/20 bg-navy-50 text-xs text-ink-muted">
          No image yet — upload from this panel
        </div>
      )}
      {fit === "contain" && ratioLabel(ratio) ? (
        <p className="text-xs text-ink-muted">Ratio set from this photo: {ratioLabel(ratio)}</p>
      ) : null}
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
          if (!file) return;
          void applyRatio(file);
          upload.mutate(file);
        }}
      />
      <Input
        label="Or paste image URL"
        value={value}
        onChange={(event) => {
          const url = event.target.value;
          onChange(url);
          window.clearTimeout(urlTimer.current);
          if (!url.trim()) return;
          urlTimer.current = window.setTimeout(() => {
            void applyRatio(mediaUrl(url.trim()));
          }, 400);
        }}
        placeholder="/uploads/about/office.jpg"
        hint={hint}
      />
    </div>
  );
}
