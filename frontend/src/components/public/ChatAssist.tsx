import { MessageCircle, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { Button } from "@/components/ui/Button";
import { openChatbot } from "@/utils/chatbot";

export function ChatAssist() {
  const config = useQuery({ queryKey: ["public", "chatbot"], queryFn: publicApi.chatbot });
  const data = config.data;
  if (!data?.enabled) return null;

  const questions = data.suggestedQuestions?.length ? data.suggestedQuestions : data.topics ?? [];

  return (
    <section className="chat-assist">
      <div className="chat-assist-orbs" aria-hidden>
        <span />
        <span />
      </div>
      <div className="chat-assist-wrap">
        <div className="chat-assist-copy">
          <p className="about-kicker">{data.sectionKicker || "Agent desk"}</p>
          <h2>{data.sectionTitle || "Ask the agent assistant"}</h2>
          <p>{data.sectionDescription}</p>
          <div className="chat-assist-chips">
            {questions.slice(0, 6).map((item) => (
              <button key={item} type="button" onClick={() => openChatbot(item)}>
                {item}
              </button>
            ))}
          </div>
          <Button variant="gold" size="lg" className="btn-shimmer mt-6" onClick={() => openChatbot()}>
            <MessageCircle className="h-4 w-4" />
            {data.launcherLabel || "Start chat"}
          </Button>
        </div>
        <aside className="chat-assist-preview" aria-hidden>
          <div className="chat-assist-preview-head">
            <span>{data.botName || "Remit2Nepal Assist"}</span>
            <em>Online</em>
          </div>
          <div className="chat-assist-preview-body">
            <p className="is-bot">{data.welcomeMessage}</p>
            <p className="is-user">How do I become an agent?</p>
            <p className="is-bot">
              <Sparkles className="mr-1 inline h-3.5 w-3.5" />
            Ask anything about Remit2Nepal — agents, DC install, rates, directors, Our Team, and this website.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
