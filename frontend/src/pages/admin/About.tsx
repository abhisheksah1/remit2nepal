import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { aboutFormSchema } from "@/schemas/cms.schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { splitCsv } from "@/utils/cn";

type AboutForm = {
  introduction: string;
  mission: string;
  vision: string;
  history: string;
  chairmanMessage: string;
  chairmanName: string;
  chairmanTitle: string;
  chairmanPhotoUrl: string;
  coreValuesJson: string;
  statisticsJson: string;
  certifications: string;
  licenses: string;
  awards: string;
};

export default function About() {
  const { push } = useToast();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["admin-about"], queryFn: adminApi.about.get });
  const form = useForm<AboutForm>({ resolver: zodResolver(aboutFormSchema) });

  useEffect(() => {
    if (!query.data) return;
    form.reset({
      introduction: query.data.introduction,
      mission: query.data.mission,
      vision: query.data.vision,
      history: query.data.history,
      chairmanMessage: query.data.chairmanMessage,
      chairmanName: query.data.chairmanName,
      chairmanTitle: query.data.chairmanTitle,
      chairmanPhotoUrl: query.data.chairmanPhotoUrl,
      coreValuesJson: JSON.stringify(query.data.coreValues ?? [], null, 2),
      statisticsJson: JSON.stringify(query.data.statistics ?? [], null, 2),
      certifications: (query.data.certifications ?? []).join(", "),
      licenses: (query.data.licenses ?? []).join(", "),
      awards: (query.data.awards ?? []).join(", ")
    });
  }, [query.data, form]);

  const save = useMutation({
    mutationFn: (values: AboutForm) =>
      adminApi.about.update({
        ...values,
        coreValues: JSON.parse(values.coreValuesJson || "[]"),
        statistics: JSON.parse(values.statisticsJson || "[]"),
        certifications: splitCsv(values.certifications),
        licenses: splitCsv(values.licenses),
        awards: splitCsv(values.awards)
      }),
    onSuccess: async () => {
      push({ title: "About updated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-about"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (query.isLoading) return <SkeletonLines />;

  return (
    <div>
      <PageHeader title="About the company" crumbs={[{ label: "Admin", to: "/admin" }, { label: "About" }]} />
      <form className="max-w-3xl space-y-4" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
        <Textarea label="Introduction" {...form.register("introduction")} />
        <Textarea label="Mission" {...form.register("mission")} />
        <Textarea label="Vision" {...form.register("vision")} />
        <Textarea label="History" {...form.register("history")} />
        <Input label="Chairman name" {...form.register("chairmanName")} />
        <Input label="Chairman title" {...form.register("chairmanTitle")} />
        <Input label="Chairman photo URL" {...form.register("chairmanPhotoUrl")} />
        <Textarea label="Chairman message" {...form.register("chairmanMessage")} />
        <Textarea label="Core values JSON" {...form.register("coreValuesJson")} />
        <Textarea label="Statistics JSON" {...form.register("statisticsJson")} />
        <Input label="Licenses (comma separated)" {...form.register("licenses")} />
        <Input label="Certifications" {...form.register("certifications")} />
        <Input label="Awards" {...form.register("awards")} />
        <Button type="submit" disabled={save.isPending}>Save about</Button>
      </form>
    </div>
  );
}
