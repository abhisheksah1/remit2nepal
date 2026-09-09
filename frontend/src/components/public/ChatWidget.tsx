import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight, MessageCircle, Send, X } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { getErrorMessage } from "@/api/client";
import { CHAT_OPEN_EVENT } from "@/utils/chatbot";
import type { ChatbotAgentHit, ChatbotAskLink, ChatbotAskResult } from "@/types/content";

type ChatRole = "bot" | "user";

interface ChatLine {
  id: string;
  role: ChatRole;
  text: string;
  source?: ChatbotAskResult["source"];
  sourceLabel?: string;
  links?: ChatbotAskLink[];
  agents?: ChatbotAgentHit[];
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ChatWidget() {
  const config = useQuery({ queryKey: ["public", "chatbot"], queryFn: publicApi.chatbot });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatLine[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const greeted = useRef(false);

  const data = config.data;
  const enabled = data?.enabled === true;

  useEffect(() => {
    if (!enabled || !data?.welcomeMessage || greeted.current) return;
    greeted.current = true;
    setMessages([{ id: uid(), role: "bot", text: data.welcomeMessage }]);
  }, [enabled, data?.welcomeMessage]);

  useEffect(() => {
    const node = scroller.current;
    if (!node || !open) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    const node = panel.current;
    if (!node) return;
    node.inert = !open;
  }, [open, enabled]);

  const ask = useMutation({
    mutationFn: (message: string) => publicApi.askChatbot(message),
    onSuccess: (result) => {
      setMessages((current) => [
        ...current,
        {
          id: uid(),
          role: "bot",
          text: result.reply,
          source: result.source,
          sourceLabel: result.sourceLabel,
          links: result.links,
          agents: result.agents
        }
      ]);
    },
    onError: (error) => {
      setMessages((current) => [
        ...current,
        { id: uid(), role: "bot", text: getErrorMessage(error), source: "fallback" }
      ]);
    }
  });

  function send(text: string) {
    const message = text.trim();
    if (!message || ask.isPending) return;
    setMessages((current) => [...current, { id: uid(), role: "user", text: message }]);
    setDraft("");
    setOpen(true);
    ask.mutate(message);
  }

  const sendRef = useRef(send);
  sendRef.current = send;

  useEffect(() => {
    function onOpen(event: Event) {
      const prompt = (event as CustomEvent<{ prompt?: string }>).detail?.prompt;
      setOpen(true);
      if (prompt) sendRef.current(prompt);
    }
    window.addEventListener(CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, onOpen);
  }, []);

  if (!enabled) return null;

  const name = data?.botName || "Remit2Nepal Assist";
  const suggestions = data?.suggestedQuestions?.length ? data.suggestedQuestions : data?.topics ?? [];

  return (
    <div className="chat-dock">
      <section
        ref={panel}
        className={open ? "chat-panel is-open" : "chat-panel"}
        aria-label={name}
        aria-hidden={!open}
      >
          <header className="chat-panel-head">
            <span className="chat-avatar" aria-hidden>
              {name.slice(0, 1)}
            </span>
            <div>
              <p>{name}</p>
              <span>Online for agents</span>
            </div>
            <button type="button" className="chat-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </button>
          </header>
          <div className="chat-thread" ref={scroller}>
            {messages.map((line) => {
              const jump = splitJumps(line);
              return (
              <article
                key={line.id}
                className={[
                  line.role === "user" ? "chat-bubble is-user" : "chat-bubble is-bot",
                  line.agents?.length ? "is-agent-pack" : ""
                ].filter(Boolean).join(" ")}
              >
                <p>{line.agents?.length ? introText(line.text) : line.text}</p>
                {line.role === "bot" && line.agents?.length ? (
                  <ul className="chat-agent-list">
                    {line.agents.map((agent, index) => (
                      <li key={agent.href} style={{ animationDelay: `${index * 45}ms` }}>
                        <Link to={agent.href} onClick={() => setOpen(false)}>
                          <strong>{agent.name}</strong>
                          <span>
                            {[agent.place, agent.phone].filter(Boolean).join(" · ")}
                          </span>
                          <ChevronRight className="chat-agent-go" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {line.role === "bot" && jump.all ? (
                  <Link className="chat-agent-all" to={jump.all.href} onClick={() => setOpen(false)}>
                    {jump.all.label}
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
                {line.role === "bot" && jump.chips.length ? (
                  <div className="chat-jump">
                    {jump.chips.map((item) =>
                      /^https?:\/\//i.test(item.href) ? (
                        <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
                          {item.label}
                        </a>
                      ) : (
                        <Link key={item.href} to={item.href} onClick={() => setOpen(false)}>
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
                ) : null}
                {line.role === "bot" && line.source && line.source !== "fallback" ? (
                  <small>{sourceCaption(line.source, line.sourceLabel)}</small>
                ) : null}
              </article>
            );
            })}
            {ask.isPending ? (
              <div className="chat-bubble is-bot is-typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            ) : null}
            {suggestions.length ? (
              <div className="chat-chips">
                {suggestions.slice(0, 6).map((item) => (
                  <button key={item} type="button" onClick={() => send(item)} disabled={ask.isPending}>
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <form
            className="chat-composer"
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              send(draft);
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={data?.placeholder || "Type a question"}
              maxLength={500}
              aria-label="Message"
            />
            <button type="submit" disabled={!draft.trim() || ask.isPending} aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </form>
      </section>
      <button
        type="button"
        className={open ? "chat-launcher is-open" : "chat-launcher"}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={data?.launcherLabel || "Open chat"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>{data?.launcherLabel || "Agent help"}</span>
      </button>
    </div>
  );
}

function introText(text: string) {
  const cut = text.split(/\n\n(?:Our Agent list|Matching agents|Some of our agents|Board of Directors|Our Team|FAQ)/)[0];
  return (cut || text).trim();
}

function splitJumps(line: ChatLine) {
  const links = line.links ?? [];
  if (!line.agents?.length) return { all: undefined as ChatbotAskLink | undefined, chips: links };
  const hitHrefs = new Set(line.agents.map((item) => item.href));
  const pageLinks = links.filter((item) => !hitHrefs.has(item.href));
  const all =
    pageLinks.find((item) =>
      ["/branches", "/about/board", "/about/team", "/faq"].some((path) => item.href === path || item.href.startsWith(`${path}?`))
    ) ?? pageLinks[0];
  return {
    all,
    chips: pageLinks.filter((item) => item !== all)
  };
}

function sourceCaption(source: ChatbotAskResult["source"], label?: string) {
  if (source === "steps") return "From agent creation steps";
  if (source === "document") return label ? `From ${label}` : "From uploaded guide";
  if (source === "qa") return "From saved Q&A";
  if (source === "site") return label ? `From ${label}` : "From the website";
  return "";
}
