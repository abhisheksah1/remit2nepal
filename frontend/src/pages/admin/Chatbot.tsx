import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { chatbotQaFormSchema, chatbotStepFormSchema } from "@/schemas/cms.schema";
import type { ChatbotAgentStep, ChatbotQaItem, ChatbotSettings } from "@/types/content";
import { entityId } from "@/utils/cn";

const emptySettings: ChatbotSettings = {
  enabled: true,
  botName: "Remit2Nepal Assist",
  welcomeMessage: "Hello. Ask me anything about Remit2Nepal — agents, DC install, rates, directors, Our Team, and the content on this site.",
  placeholder: "Ask anything about Remit2Nepal...",
  fallbackMessage: "I could not find that yet. Try a suggested question or contact operations.",
  launcherLabel: "Agent help",
  sectionKicker: "Agent desk",
  sectionTitle: "Ask the agent assistant",
  sectionDescription: "Ask about becoming an agent, DC install, rates, branches, directors, Our Team, fees, and anything published on this website.",
  suggestedQuestions: []
};

export default function ChatbotAdmin() {
  const { push } = useToast();
  const client = useQueryClient();
  const settingsQuery = useQuery({ queryKey: ["admin-chatbot-settings"], queryFn: adminApi.chatbot.settings });
  const knowledgeQuery = useQuery({ queryKey: ["admin-chatbot-knowledge"], queryFn: adminApi.chatbot.knowledge });
  const [form, setForm] = useState<ChatbotSettings>(emptySettings);
  const [pdfTitle, setPdfTitle] = useState("DC installation");
  const [pdfCategory, setPdfCategory] = useState("DC_INSTALL");

  useEffect(() => {
    if (!settingsQuery.data) return;
    setForm({
      ...emptySettings,
      ...settingsQuery.data,
      suggestedQuestions: settingsQuery.data.suggestedQuestions ?? []
    });
  }, [settingsQuery.data]);

  const save = useMutation({
    mutationFn: () =>
      adminApi.chatbot.updateSettings({
        ...form,
        suggestedQuestions: form.suggestedQuestions.map((item) => item.trim()).filter(Boolean)
      }),
    onSuccess: async () => {
      push({ title: "Chatbot copy saved", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-chatbot-settings"] });
      await client.invalidateQueries({ queryKey: ["public", "chatbot"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const upload = useMutation({
    mutationFn: (file: File) => adminApi.chatbot.uploadKnowledge(file, pdfTitle, pdfCategory),
    onSuccess: async (doc) => {
      push({
        title: doc.warning ? "Uploaded, but no text was found" : "PDF uploaded and indexed",
        tone: doc.warning ? "info" : "success"
      });
      await client.invalidateQueries({ queryKey: ["admin-chatbot-knowledge"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const removeDoc = useMutation({
    mutationFn: (id: string) => adminApi.chatbot.removeKnowledge(id),
    onSuccess: async () => {
      push({ title: "Guide removed", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-chatbot-knowledge"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Chatbot"
        description="The public assistant answers from this Q&A, agent steps, uploaded PDFs, and live website content (about, services, FAQs, branches, rates, charges, news, pages, and contact)."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Chatbot" }]}
      />

      <section className="rounded-2xl border border-navy/10 bg-white p-5">
        <h2 className="font-display text-xl text-navy">Appearance and default copy</h2>
        <p className="mt-1 text-sm text-ink-muted">This is what visitors see on the landing page and in the chat window.</p>
        {settingsQuery.isLoading ? (
          <SkeletonLines />
        ) : (
          <form
            className="mt-5 grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate();
            }}
          >
            <label className="flex items-center gap-2 text-sm text-navy md:col-span-2">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) => setForm((current) => ({ ...current, enabled: event.target.checked }))}
              />
              Show chatbot on the public site
            </label>
            <Input label="Bot name" value={form.botName} onChange={(event) => setForm((current) => ({ ...current, botName: event.target.value }))} />
            <Input
              label="Launcher label"
              value={form.launcherLabel}
              onChange={(event) => setForm((current) => ({ ...current, launcherLabel: event.target.value }))}
            />
            <Input
              label="Section kicker"
              value={form.sectionKicker}
              onChange={(event) => setForm((current) => ({ ...current, sectionKicker: event.target.value }))}
            />
            <Input
              label="Section title"
              value={form.sectionTitle}
              onChange={(event) => setForm((current) => ({ ...current, sectionTitle: event.target.value }))}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Landing description"
                rows={3}
                value={form.sectionDescription}
                onChange={(event) => setForm((current) => ({ ...current, sectionDescription: event.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Welcome message"
                rows={3}
                value={form.welcomeMessage}
                onChange={(event) => setForm((current) => ({ ...current, welcomeMessage: event.target.value }))}
              />
            </div>
            <Input
              label="Input placeholder"
              value={form.placeholder}
              onChange={(event) => setForm((current) => ({ ...current, placeholder: event.target.value }))}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Fallback if nothing matches"
                rows={3}
                value={form.fallbackMessage}
                onChange={(event) => setForm((current) => ({ ...current, fallbackMessage: event.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Suggested questions (one per line)"
                rows={4}
                value={form.suggestedQuestions.join("\n")}
                onChange={(event) =>
                  setForm((current) => ({ ...current, suggestedQuestions: event.target.value.split("\n") }))
                }
              />
            </div>
            <div>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving..." : "Save chatbot copy"}
              </Button>
            </div>
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-navy/10 bg-white p-5">
        <h2 className="font-display text-xl text-navy">DC installation PDF</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Upload the DC installation guide. The chatbot reads the text and answers agents when they describe a problem.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_12rem_auto]">
          <Input label="Guide title" value={pdfTitle} onChange={(event) => setPdfTitle(event.target.value)} />
          <Select
            label="Category"
            value={pdfCategory}
            onChange={(event) => setPdfCategory(event.target.value)}
            options={[
              { value: "DC_INSTALL", label: "DC installation" },
              { value: "AGENT", label: "Agent guide" },
              { value: "OTHER", label: "Other" }
            ]}
          />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-navy">PDF file</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="block w-full text-sm"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) upload.mutate(file);
                event.target.value = "";
              }}
            />
          </label>
        </div>
        <ul className="mt-5 space-y-3">
          {(knowledgeQuery.data ?? []).map((doc) => (
            <li key={entityId(doc)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/10 px-4 py-3">
              <div>
                <p className="font-medium text-navy">{doc.title}</p>
                <p className="text-xs text-ink-muted">
                  {doc.originalName} · {doc.pageCount} pages · {doc.chunkCount} readable sections
                </p>
                {doc.warning ? <p className="mt-1 text-xs text-red-700">{doc.warning}</p> : null}
              </div>
              <Button size="sm" variant="danger" onClick={() => removeDoc.mutate(entityId(doc))} disabled={removeDoc.isPending}>
                Remove
              </Button>
            </li>
          ))}
          {!knowledgeQuery.data?.length ? <p className="text-sm text-ink-muted">No PDF uploaded yet.</p> : null}
        </ul>
      </section>

      <ResourceCrud<ChatbotQaItem>
        title="Saved Q&A"
        description="Default answers the chatbot uses first. Add keywords so it can match how agents actually ask."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Chatbot" }, { label: "Q&A" }]}
        queryKey="admin-chatbot-qa"
        list={adminApi.chatbot.qa.list}
        create={adminApi.chatbot.qa.create}
        update={adminApi.chatbot.qa.update}
        remove={adminApi.chatbot.qa.remove}
        schema={chatbotQaFormSchema}
        columns={[
          { key: "question", header: "Question", render: (row) => row.question },
          { key: "category", header: "Category", render: (row) => row.category },
          { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
        ]}
        fields={[
          { name: "question", label: "Question" },
          { name: "answer", label: "Answer", type: "textarea" },
          { name: "keywords", label: "Keywords", hint: "Comma-separated words that should also match this answer" },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: [
              { value: "General", label: "General" },
              { value: "Agent", label: "Agent" },
              { value: "DC", label: "DC" },
              { value: "Payout", label: "Payout" },
              { value: "Rates", label: "Rates" }
            ]
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" }
            ]
          },
          { name: "displayOrder", label: "Display order", type: "number" }
        ]}
        toForm={(item) => ({
          question: item?.question ?? "",
          answer: item?.answer ?? "",
          keywords: item?.keywords ?? "",
          category: item?.category ?? "General",
          status: item?.status ?? "ACTIVE",
          displayOrder: item?.displayOrder ?? 0
        })}
        toPayload={(values) => values}
      />

      <ResourceCrud<ChatbotAgentStep>
        title="Agent creation steps"
        description="These steps are what the chatbot recites when someone asks how to become an agent."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Chatbot" }, { label: "Agent steps" }]}
        queryKey="admin-chatbot-steps"
        list={adminApi.chatbot.steps.list}
        create={adminApi.chatbot.steps.create}
        update={adminApi.chatbot.steps.update}
        remove={adminApi.chatbot.steps.remove}
        schema={chatbotStepFormSchema}
        columns={[
          { key: "displayOrder", header: "Order", render: (row) => row.displayOrder },
          { key: "title", header: "Step", render: (row) => row.title },
          { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
        ]}
        fields={[
          { name: "title", label: "Step title" },
          { name: "body", label: "Step details", type: "textarea" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" }
            ]
          },
          { name: "displayOrder", label: "Step number", type: "number" }
        ]}
        toForm={(item) => ({
          title: item?.title ?? "",
          body: item?.body ?? "",
          status: item?.status ?? "ACTIVE",
          displayOrder: item?.displayOrder ?? 0
        })}
        toPayload={(values) => values}
      />
    </div>
  );
}
