import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { getErrorMessage } from "@/api/client";
import { contactSchema, type ContactValues } from "@/schemas/contact.schema";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";

export default function Contact() {
  const { push } = useToast();
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const settings = site.data?.settings;
  const form = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });
  const mutation = useMutation({
    mutationFn: (values: ContactValues) => publicApi.contact(values),
    onSuccess: () => {
      push({ title: "Message received", description: "A relationship officer will respond during office hours.", tone: "success" });
      form.reset();
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  return (
    <>
      <PageHero
        kicker="Relationship desk"
        title="How can we help?"
        description="Use this form for branch hours, rate queries and corporate remittance. Do not send transfer passwords or one-time codes."
      />
      <div className="mx-auto grid max-w-site gap-10 px-4 lg:px-8 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <SeoHead title="Contact Remit2Nepal" description="Speak with the relationship desk about branches, rates and transfers." />
      <div>
        <Card className="space-y-2 text-sm">
          <p>{settings?.address}</p>
          <p>{settings?.officeHours}</p>
          {settings?.phone ? <p>Phone: {settings.phone}</p> : null}
          {settings?.email ? <p>Email: {settings.email}</p> : null}
          {settings?.emergencyContact ? <p>Emergency: {settings.emergencyContact}</p> : null}
        </Card>
      </div>
      {settings && settings.contactFormEnabled === false ? (
        <Card>
          <p className="text-navy">The enquiry form is temporarily closed. Please call the relationship desk.</p>
        </Card>
      ) : (
        <form className="glass-panel space-y-4 rounded-2xl p-6" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <Input label="Full name" {...form.register("name")} error={form.formState.errors.name?.message} />
          <Input label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
          <Input label="Phone" {...form.register("phone")} error={form.formState.errors.phone?.message} />
          <Input label="Subject" {...form.register("subject")} error={form.formState.errors.subject?.message} />
          <Textarea label="Message" {...form.register("message")} error={form.formState.errors.message?.message} />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending…" : "Send message"}
          </Button>
        </form>
      )}
    </div>
    </>
  );
}
