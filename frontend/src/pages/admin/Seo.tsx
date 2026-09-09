import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { seoFormSchema, type SeoFormValues } from "@/schemas/settings.schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { SkeletonLines } from "@/components/ui/Skeleton";

export default function Seo() {
  const { push } = useToast();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["admin-seo"], queryFn: adminApi.seo.get });
  const form = useForm<SeoFormValues>({ resolver: zodResolver(seoFormSchema) });

  useEffect(() => {
    if (query.data) {
      form.reset({
        siteTitle: query.data.siteTitle,
        metaDescription: query.data.metaDescription,
        keywords: query.data.keywords,
        faviconUrl: query.data.faviconUrl,
        ogImage: query.data.ogImage,
        robots: query.data.robots,
        canonicalUrl: query.data.canonicalUrl
      });
    }
  }, [query.data, form]);

  const save = useMutation({
    mutationFn: (values: SeoFormValues) => adminApi.seo.update(values),
    onSuccess: async () => {
      push({ title: "SEO updated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-seo"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (query.isLoading) return <SkeletonLines />;

  return (
    <div>
      <PageHeader
        title="SEO"
        description="Search titles, descriptions, and social preview fields for the public site."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "SEO" }]}
      />
      <form className="admin-panel space-y-4" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
        <Input label="Site title" {...form.register("siteTitle")} error={form.formState.errors.siteTitle?.message} />
        <Textarea label="Meta description" {...form.register("metaDescription")} />
        <Input label="Keywords" {...form.register("keywords")} />
        <Input label="Favicon URL" {...form.register("faviconUrl")} />
        <Input label="Open Graph image" {...form.register("ogImage")} />
        <Input label="Robots" {...form.register("robots")} />
        <Input label="Canonical URL" {...form.register("canonicalUrl")} />
        <div className="admin-form-save">
          <Button type="submit" disabled={save.isPending}>Save SEO</Button>
        </div>
      </form>
    </div>
  );
}
