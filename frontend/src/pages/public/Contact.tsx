import { useEffect, useRef, type CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock3, Mail, MapPin, Phone, PhoneCall } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { getErrorMessage } from "@/api/client";
import { contactSchema, type ContactValues } from "@/schemas/contact.schema";
import { SeoHead } from "@/components/public/SeoHead";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { heroTitleParts } from "@/utils/hero";

function telHref(value: string) {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const { push } = useToast();
  const [params] = useSearchParams();
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const settings = site.data?.settings;
  const titleParts = heroTitleParts("How can we // help?");
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: params.get("subject") || "",
      message: ""
    }
  });
  const mutation = useMutation({
    mutationFn: (values: ContactValues) => publicApi.contact(values),
    onSuccess: () => {
      push({ title: "Message received", description: "The desk will reply during office hours.", tone: "success" });
      form.reset();
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const facts = [
    settings?.address ? { icon: MapPin, label: "Address", value: settings.address } : null,
    settings?.officeHours ? { icon: Clock3, label: "Hours", value: settings.officeHours } : null,
    settings?.phone ? { icon: Phone, label: "Phone", value: settings.phone, href: telHref(settings.phone) } : null,
    settings?.email ? { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` } : null,
    settings?.emergencyContact
      ? { icon: PhoneCall, label: "Emergency", value: settings.emergencyContact, href: telHref(settings.emergencyContact) }
      : null
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string; href?: string }[];

  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-in");
      return undefined;
    }
    const frame = window.requestAnimationFrame(() => node.classList.add("is-in"));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <SeoHead title="Contact Remit2Nepal" description="Ask about branches, rates, and transfers. Do not send passwords or one-time codes." />
      <section ref={root} className="cdesk reveal-skip" aria-labelledby="contact-title">
        <div className="cdesk-sky" aria-hidden>
          <span className="cdesk-glow is-blue" />
          <span className="cdesk-glow is-red" />
          <span className="cdesk-mesh" />
          <div className="cdesk-mountains" />
        </div>

        <header className="cdesk-head">
          <p className="cdesk-kicker">Contact us</p>
          <h1 id="contact-title">
            {titleParts.map((part, index) => (
              <span key={`${part.tone}-${index}`} className={part.tone}>
                {part.text}
              </span>
            ))}
          </h1>
          <p className="cdesk-lede">
            Use this form for branch hours, rate questions, and payout questions. Do not send transfer passwords or
            one-time codes.
          </p>
        </header>

        <div className="cdesk-grid">
          <aside className="cdesk-card cdesk-info">
            <p className="cdesk-card-kicker">Reach us</p>
            {facts.length ? (
              <ul>
                {facts.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} style={{ "--i": index } as CSSProperties}>
                      <span className="cdesk-ico" aria-hidden>
                        <Icon strokeWidth={2.2} />
                      </span>
                      <span className="cdesk-copy">
                        <span className="cdesk-label">{item.label}</span>
                        {item.href ? (
                          <a className="cdesk-value" href={item.href}>
                            {item.value}
                          </a>
                        ) : (
                          <span className="cdesk-value">{item.value}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="cdesk-empty">Contact details will appear here shortly.</p>
            )}
          </aside>

          {settings && settings.contactFormEnabled === false ? (
            <div className="cdesk-card cdesk-form is-closed">
              <p className="cdesk-card-kicker">Enquiry form</p>
              <h2>Form temporarily closed</h2>
              <p>Please call the desk during office hours.</p>
              {settings.phone ? (
                <a className="cdesk-submit" href={telHref(settings.phone)}>
                  Call desk <ArrowRight />
                </a>
              ) : null}
            </div>
          ) : (
            <form
              className="cdesk-card cdesk-form"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <p className="cdesk-card-kicker">Send a message</p>
              <div className="cdesk-fields">
                <Input label="Full name" className="cdesk-control" {...form.register("name")} error={form.formState.errors.name?.message} />
                <Input label="Email" type="email" className="cdesk-control" {...form.register("email")} error={form.formState.errors.email?.message} />
                <Input label="Phone" className="cdesk-control" {...form.register("phone")} error={form.formState.errors.phone?.message} />
                <Input label="Subject" className="cdesk-control" {...form.register("subject")} error={form.formState.errors.subject?.message} />
                <Textarea label="Message" rows={6} className="cdesk-control" {...form.register("message")} error={form.formState.errors.message?.message} />
              </div>
              <button className="cdesk-submit" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Sending…" : "Send message"}
                <ArrowRight />
              </button>
              <p className="cdesk-note">Replies go out during published office hours.</p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
