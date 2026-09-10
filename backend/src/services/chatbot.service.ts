import type { Request } from "express";
import { ChatbotSetting } from "../models/chatbot-setting.model.js";
import { ChatbotQa } from "../models/chatbot-qa.model.js";
import { ChatbotAgentStep } from "../models/chatbot-agent-step.model.js";
import { ChatbotKnowledgeChunk, ChatbotKnowledgeDoc } from "../models/chatbot-knowledge.model.js";
import { createResourceService } from "./resource.service.js";
import { writePrivateFile, removePrivateFile } from "./file-store.service.js";
import { chunkPages, extractPdfPages } from "./pdf-text.service.js";
import { defaultChatbotQuestions, defaultChatbotSteps } from "../constants/chatbot.js";
import { loadSiteKnowledge, type SiteCard } from "./chatbot-site-knowledge.service.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { AppError, NotFoundError } from "../utils/app-error.js";
import { stripHtml } from "../utils/sanitize.js";
import { clientIp, userAgent } from "../utils/request-meta.js";

const KNOWLEDGE_FOLDER = "chatbot";
const SETTING_FIELDS = [
  "enabled",
  "botName",
  "welcomeMessage",
  "placeholder",
  "fallbackMessage",
  "launcherLabel",
  "sectionKicker",
  "sectionTitle",
  "sectionDescription",
  "suggestedQuestions"
] as const;

const STOP = new Set([
  "the", "and", "for", "are", "but", "not", "you", "your", "our", "this", "that", "with", "from",
  "how", "what", "when", "who", "why", "can", "could", "please", "hello", "help", "need", "want",
  "does", "did", "have", "has", "was", "were", "will", "just", "any", "about", "into"
]);

export const chatbotQaCatalog = createResourceService(ChatbotQa, {
  module: "chatbot",
  searchFields: ["question", "answer", "keywords", "category"]
});

export const chatbotStepCatalog = createResourceService(ChatbotAgentStep, {
  module: "chatbot",
  searchFields: ["title", "body"]
});

export async function ensureChatbotDefaults() {
  const settings = await ChatbotSetting.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default" } },
    { new: true, upsert: true }
  );
  if (!settings) throw new AppError("Chatbot settings could not be loaded", 500);

  for (const item of defaultChatbotQuestions) {
    await ChatbotQa.updateOne({ question: item.question }, { $setOnInsert: { ...item, status: "ACTIVE" } }, { upsert: true });
  }
  await ChatbotQa.updateOne(
    {
      question: "DC installation is failing. What should I do?",
      keywords: "dc, install, installation, software, error, setup, fail"
    },
    {
      $set: {
        keywords: "failing, failed, error, not working, problem, crash, cannot install, submit not working",
        answer:
          "Tell me the exact error you see on the screen. I will match it against the DC installation guide. Common fixes: use Internet Explorer, open https://www.remit2nepal.net/certsrv, add remit2nepal.net in Compatibility View Settings if Submit does not work, then wait for the certificate request to be approved before installing it. If it still fails, send a screenshot to operations at 01-5261598 / 01-5261493."
      }
    }
  );

  const suggested = settings.suggestedQuestions ?? [];
  if (suggested.includes("DC installation is failing") && !suggested.includes("How do I install DC?")) {
    settings.suggestedQuestions = suggested.map((item) => (item === "DC installation is failing" ? "How do I install DC?" : item));
  }
  const oldChips = [
    "How do I become an agent?",
    "What documents do I need?",
    "How do I install DC?",
    "How do I apply as a cooperative?"
  ];
  const nextSuggested = settings.suggestedQuestions ?? suggested;
  if (
    nextSuggested.length === 4 &&
    oldChips.every((item) => nextSuggested.includes(item)) &&
    !nextSuggested.some((item) => /rate|branch/i.test(item))
  ) {
    settings.suggestedQuestions = [
      "How do I become an agent?",
      "How do I install DC?",
      "Who are the directors?",
      "Who is on Our Team?",
      "What is the USD rate?",
      "Where can I find a branch?"
    ];
  }
  if (
    (settings.suggestedQuestions ?? []).length === 4 &&
    (settings.suggestedQuestions ?? []).includes("What is the USD rate?") &&
    !(settings.suggestedQuestions ?? []).some((item) => /director|our team/i.test(item))
  ) {
    settings.suggestedQuestions = [
      "How do I become an agent?",
      "How do I install DC?",
      "Who are the directors?",
      "Who is on Our Team?",
      "What is the USD rate?",
      "Where can I find a branch?"
    ];
  }
  if (settings.welcomeMessage.includes("becoming an agent, DC installation problems, and payout questions")) {
    settings.welcomeMessage =
      "Hello. Ask me anything about Remit2Nepal — becoming an agent, DC install, rates, branches, services, charges, and the content on this site.";
  }
  if (settings.placeholder === "Ask about agents, DC install, or payouts...") {
    settings.placeholder = "Ask anything about Remit2Nepal...";
  }
  if (settings.welcomeMessage.includes("becoming an agent, DC install, rates, branches, services, charges")) {
    settings.welcomeMessage =
      "Hello. Ask me anything about Remit2Nepal — agents, DC install, rates, directors, Our Team, and the content on this site.";
  }
  if (settings.sectionDescription.includes("Ask about becoming an agent, DC install, rates, branches, services, fees")) {
    settings.sectionDescription =
      "Ask about becoming an agent, DC install, rates, branches, directors, Our Team, fees, and anything published on this website.";
  }
  if (settings.isModified()) await settings.save();

  await ChatbotQa.updateOne(
    { question: "Who are the directors?", answer: /licensed operations/i },
    {
      $set: {
        answer:
          "The Board of Directors sets policy and keeps the payout desk accountable. Open Board of Directors to see each director."
      }
    }
  );

  if ((await ChatbotAgentStep.countDocuments()) === 0) {
    await ChatbotAgentStep.insertMany(defaultChatbotSteps.map((item) => ({ ...item, status: "ACTIVE" })));
  }
  return settings;
}

export async function getChatbotSettings() {
  return ensureChatbotDefaults();
}

export async function updateChatbotSettings(input: Record<string, unknown>, req: Request) {
  const settings = await ensureChatbotDefaults();
  const oldValue = settings.toObject();
  for (const field of SETTING_FIELDS) {
    if (field in input) (settings as unknown as Record<string, unknown>)[field] = input[field];
  }
  await settings.save();
  await writeAudit({
    action: AUDIT_ACTIONS.CHANGE_SETTINGS,
    module: "chatbot",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    oldValue,
    newValue: settings.toObject(),
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return settings;
}

export async function getPublicChatbot() {
  const settings = await ensureChatbotDefaults();
  if (!settings.enabled) {
    return { enabled: false as const };
  }
  const [questions, steps] = await Promise.all([
    ChatbotQa.find({ status: "ACTIVE" }).sort({ displayOrder: 1, createdAt: 1 }).select("question").lean(),
    ChatbotAgentStep.find({ status: "ACTIVE" }).sort({ displayOrder: 1, createdAt: 1 }).select("title").lean()
  ]);
  return {
    enabled: true as const,
    botName: settings.botName,
    welcomeMessage: settings.welcomeMessage,
    placeholder: settings.placeholder,
    launcherLabel: settings.launcherLabel,
    sectionKicker: settings.sectionKicker,
    sectionTitle: settings.sectionTitle,
    sectionDescription: settings.sectionDescription,
    suggestedQuestions: (settings.suggestedQuestions ?? []).filter(Boolean).slice(0, 8),
    topics: questions.slice(0, 8).map((item) => item.question),
    stepTitles: steps.map((item) => item.title)
  };
}

export async function listKnowledgeDocs() {
  return ChatbotKnowledgeDoc.find().sort({ createdAt: -1 }).lean();
}

export async function uploadKnowledgeDoc(file: Express.Multer.File, input: { title?: string; category?: string }, req: Request) {
  if (file.mimetype !== "application/pdf" && !file.originalname.toLowerCase().endsWith(".pdf")) {
    throw new AppError("Upload a PDF file", 400);
  }
  const stored = await writePrivateFile(KNOWLEDGE_FOLDER, file);
  const extracted = await extractPdfPages(file.buffer);
  const chunks = chunkPages(extracted.pages);
  const warning = chunks.length ? "" : "No readable text was found. Use a text PDF, not a scanned image.";
  const doc = await ChatbotKnowledgeDoc.create({
    title: (input.title || file.originalname || "DC installation").trim(),
    category: input.category || "DC_INSTALL",
    originalName: stored.originalName,
    storedName: stored.storedName,
    mimeType: stored.mimeType,
    size: stored.size,
    pageCount: extracted.pageCount,
    chunkCount: chunks.length,
    warning,
    status: "ACTIVE"
  });
  if (chunks.length) {
    await ChatbotKnowledgeChunk.insertMany(
      chunks.map((chunk) => ({
        docId: doc._id,
        title: doc.title,
        category: doc.category,
        page: chunk.page,
        text: chunk.text
      }))
    );
  }
  await writeAudit({
    action: AUDIT_ACTIONS.UPLOAD_MEDIA,
    module: "chatbot",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: String(doc._id),
    newValue: { title: doc.title, chunkCount: chunks.length }
  });
  return doc;
}

export async function deleteKnowledgeDoc(id: string, req: Request) {
  const doc = await ChatbotKnowledgeDoc.findById(id);
  if (!doc) throw new NotFoundError();
  await ChatbotKnowledgeChunk.deleteMany({ docId: doc._id });
  await removePrivateFile(KNOWLEDGE_FOLDER, doc.storedName);
  await doc.deleteOne();
  await writeAudit({
    action: AUDIT_ACTIONS.DELETE_MEDIA,
    module: "chatbot",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: id
  });
  return doc;
}

type AnswerSource = "qa" | "steps" | "document" | "site" | "fallback";

interface ChatLink {
  label: string;
  href: string;
}

interface AgentHit {
  name: string;
  place?: string;
  phone?: string;
  href: string;
}

const PAGE_LINKS: Record<SiteCard["kind"], ChatLink> = {
  company: { label: "About Us", href: "/about" },
  contact: { label: "Contact", href: "/contact" },
  about: { label: "About Us", href: "/about" },
  service: { label: "Services", href: "/services" },
  faq: { label: "FAQ", href: "/faq" },
  branch: { label: "Our Agent", href: "/branches" },
  rate: { label: "Exchange Rate", href: "/exchange-rate" },
  charge: { label: "Service Charge", href: "/service-charge" },
  news: { label: "News & Notices", href: "/news" },
  page: { label: "Home", href: "/" },
  team: { label: "Our Team", href: "/about/team" },
  partner: { label: "Become a Agent", href: "/partners" },
  section: { label: "Home", href: "/" },
  document: { label: "Compliance", href: "/about/compliance" },
  agent: { label: "Become a Agent", href: "/partners" }
};

const BECOME_LINKS: ChatLink[] = [
  { label: "Become a Agent", href: "/partners" },
  { label: "Apply now", href: "/partners/apply/national" },
  { label: "Our Agent", href: "/branches" }
];

const DC_LINKS: ChatLink[] = [
  { label: "Contact operations", href: "/contact" }
];

export async function answerChat(message: string) {
  const settings = await ensureChatbotDefaults();
  if (!settings.enabled) {
    throw new AppError("The assistant is turned off", 503);
  }
  const query = stripHtml(message).replace(/\s+/g, " ").trim();
  const queryTokens = tokenize(query);
  const baseSuggestions = (settings.suggestedQuestions ?? []).filter(Boolean).slice(0, 6);

  const [questions, steps, chunks, siteCards] = await Promise.all([
    ChatbotQa.find({ status: "ACTIVE" }).sort({ displayOrder: 1 }).lean(),
    ChatbotAgentStep.find({ status: "ACTIVE" }).sort({ displayOrder: 1, createdAt: 1 }).lean(),
    ChatbotKnowledgeChunk.find().lean(),
    loadSiteKnowledge()
  ]);
  const suggestions = relatedChips(queryTokens, questions, "", baseSuggestions);

  const stepIndex = numberedStep(query);
  const numbered = stepIndex ? steps[stepIndex - 1] : undefined;
  if (numbered) {
    return pack(
      "steps",
      `Step ${stepIndex}: ${numbered.title}\n\n${plain(numbered.body)}`,
      numbered.title,
      suggestions,
      uniqLinks(BECOME_LINKS)
    );
  }

  const wantsSteps = /become (an )?agent|become a agent|national agent|cooperativ|private agent|agent creation|apply as|how to join/.test(
    query.toLowerCase()
  );
  const wantsDc = /dc|install|software|setup|error|fail|troubleshoot|printer|device|update|connection|certsrv|certificate/.test(query.toLowerCase());
  const wantsFail = /fail|error|problem|not work|crash|cannot/.test(query.toLowerCase());
  const wantsInstallHowTo = /how\b.*\b(dc|install)|install\b.*\bdc|\bdc install|\bdc installation\b/.test(query.toLowerCase());
  const wantsRates = /rate|forex|nrb|usd|exchange|currency/.test(query.toLowerCase());
  const wantsContact = /contact|phone|email|address|office|hour|hotline|call/.test(query.toLowerCase());
  const wantsCharge = /charge|fee|commission|cost/.test(query.toLowerCase());
  const wantsAgentList =
    !wantsSteps &&
    !wantsInstallHowTo &&
    /branch|our agent|agent list|list of agent|\bagents?\b|where.*agent|find.*agent|nearby.*agent|agent.*nearby/.test(
      query.toLowerCase()
    );
  const wantsBoard = !wantsAgentList && !wantsSteps && /director|directors|board of|\bchairman\b|chairperson|\bboard\b/.test(query.toLowerCase());
  const wantsTeam =
    !wantsAgentList &&
    !wantsSteps &&
    !wantsBoard &&
    /our team|team member|department head|operations team|who is on (the )?team|staff list|our leader|who is (the )?leader/.test(query.toLowerCase());
  const wantsFaqList = !wantsInstallHowTo && !wantsSteps && /\bfaqs?\b|frequently asked|common questions/.test(query.toLowerCase());

  let bestQa: { score: number; item: (typeof questions)[number] | undefined } = { score: 0, item: undefined };
  for (const item of questions) {
    let score =
      overlap(queryTokens, item.question, 3.4) +
      overlap(queryTokens, item.keywords || "", 2.6) +
      overlap(queryTokens, item.answer, 1.1);
    if (wantsInstallHowTo && /how do i install dc/i.test(item.question)) score += 14;
    if (wantsFail && /failing/i.test(item.question)) score += 8;
    if (wantsInstallHowTo && !wantsFail && /failing/i.test(item.question)) score -= 12;
    if (score > bestQa.score) bestQa = { score, item };
  }

  let bestChunk: { score: number; item: (typeof chunks)[number] | undefined } = { score: 0, item: undefined };
  for (const item of chunks) {
    const boost = wantsDc && item.category === "DC_INSTALL" ? 1.8 : 1;
    const score = (overlap(queryTokens, item.text, 1.2) + overlap(queryTokens, item.title, 2.2)) * boost;
    if (score > bestChunk.score) bestChunk = { score, item };
  }

  let bestSite: { score: number; item: SiteCard | undefined } = { score: 0, item: undefined };
  for (const item of siteCards) {
    let score = overlap(queryTokens, item.title, 3.2) + overlap(queryTokens, item.keywords, 2.5) + overlap(queryTokens, item.text, 1.15);
    if (wantsRates && item.kind === "rate") score += 10;
    if (wantsAgentList && item.kind === "branch") score += 4;
    if (wantsContact && item.kind === "contact") score += 10;
    if (wantsCharge && item.kind === "charge") score += 8;
    if (item.kind === "service" && /service|payout|transfer|bank|cash/.test(query.toLowerCase())) score += 3;
    if (wantsBoard && item.kind === "team" && item.href === "/about/board") score += 10;
    if (wantsTeam && item.kind === "team" && item.href === "/about/team") score += 10;
    if (wantsFaqList && item.kind === "faq") score += 6;
    if (item.kind === "faq" && overlap(queryTokens, item.title, 1) >= 3) score += 5;
    if (score > bestSite.score) bestSite = { score, item };
  }

  const allAgents = siteCards.filter((item) => item.kind === "branch" && item.title !== "Our Agent network");
  const boardPeople = siteCards.filter((item) => item.kind === "team" && item.href === "/about/board");
  const teamPeople = siteCards.filter((item) => item.kind === "team" && item.href === "/about/team");
  const allPeople = [...boardPeople, ...teamPeople];
  const faqCards = siteCards.filter((item) => item.kind === "faq");

  if (wantsInstallHowTo && !wantsFail && bestQa.item && /how do i install dc/i.test(bestQa.item.question)) {
    return pack("qa", plain(bestQa.item.answer), bestQa.item.question, suggestions, uniqLinks(DC_LINKS));
  }

  if (wantsSteps && steps.length && bestQa.score < 7 && bestSite.score < 8 && (!wantsDc || bestChunk.score < 6)) {
    return pack(
      "steps",
      `${formatSteps(steps)}${agentListBlock(allAgents.slice(0, 6), allAgents.length, "Some of our agents:")}`,
      "Agent creation steps",
      suggestions,
      uniqLinks(BECOME_LINKS, [{ label: "Our Agent", href: "/branches" }]),
      toAgentHits(allAgents.slice(0, 6))
    );
  }

  if (wantsAgentList) {
    const placeStop = new Set(["branch", "branches", "agent", "agents", "find", "nearby", "location", "district", "province", "city", "list", "our"]);
    const placeTokens = queryTokens.filter((token) => !placeStop.has(token));
    const scored = allAgents
      .map((item) => ({
        item,
        score: placeTokens.length
          ? overlap(placeTokens, item.title, 4) + overlap(placeTokens, item.keywords, 3) + overlap(placeTokens, item.text, 1.5)
          : 0
      }))
      .sort((a, b) => b.score - a.score);
    const matched = placeTokens.length ? scored.filter((hit) => hit.score >= 4).slice(0, 8).map((hit) => hit.item) : [];
    const listed = matched.length ? matched : allAgents.slice(0, 8);
    const searchHref = placeTokens.length ? `/branches?q=${encodeURIComponent(placeTokens.join(" "))}` : "/branches";
    const intro = matched.length
      ? `Here are agents matching your question.`
      : `Remit2Nepal has ${allAgents.length} agents nationwide.`;
    const reply = clip(`${intro}${agentListBlock(listed, allAgents.length, matched.length ? "Matching agents" : "Our Agent list")}`, 1400);
    return pack(
      "site",
      reply,
      matched.length ? "Our Agent" : "Our Agent network",
      suggestions,
      uniqLinks([{ label: "See all agents", href: searchHref }]),
      toAgentHits(listed)
    );
  }

  const namedPeople = allPeople
    .map((item) => ({
      item,
      score: overlap(queryTokens, item.title, 5) + overlap(queryTokens, item.keywords, 2.8) + overlap(queryTokens, item.place || "", 3)
    }))
    .filter((hit) => hit.score >= 6)
    .sort((a, b) => b.score - a.score)
    .map((hit) => hit.item);

  if (!wantsSteps && !wantsInstallHowTo && !wantsAgentList && (wantsBoard || wantsTeam || namedPeople.length)) {
    const group = wantsBoard ? boardPeople : wantsTeam ? teamPeople : namedPeople[0]?.href === "/about/board" ? boardPeople : teamPeople;
    const preferred = namedPeople.filter((item) => group.includes(item));
    const listed = (wantsBoard || wantsTeam
      ? [...preferred, ...group.filter((item) => !preferred.includes(item))]
      : namedPeople
    ).slice(0, 12);
    const href = wantsBoard || listed[0]?.href === "/about/board" ? "/about/board" : "/about/team";
    const label = href === "/about/board" ? "Board of Directors" : "Our Team";
    const intro = namedPeople.length && !wantsBoard && !wantsTeam
      ? `Here is who I found.`
      : href === "/about/board"
        ? `Here are the directors of Remit2Nepal.`
        : `Here is Our Team at Remit2Nepal.`;
    const reply = clip(`${intro}${agentListBlock(listed, group.length || listed.length, label, "See the full page")}`, 1400);
    return pack(
      "site",
      reply,
      label,
      suggestions,
      uniqLinks([{ label: `Open ${label}`, href }]),
      toAgentHits(listed)
    );
  }

  if (wantsFaqList && faqCards.length) {
    const listed = faqCards.slice(0, 8);
    return pack(
      "site",
      clip(`Here are questions from the FAQ.${agentListBlock(listed, faqCards.length, "FAQ", "See all FAQs")}`, 1400),
      "FAQ",
      relatedChips(queryTokens, questions, "", listed.map((item) => item.title)),
      uniqLinks([{ label: "See all FAQs", href: "/faq" }]),
      toAgentHits(listed)
    );
  }

  const ranked = [
    { score: bestQa.score, source: "qa" as const },
    { score: bestChunk.score, source: "document" as const },
    { score: bestSite.score, source: "site" as const }
  ].sort((a, b) => b.score - a.score)[0];

  if (ranked?.source === "qa" && bestQa.item && bestQa.score >= 5) {
    const question = bestQa.item.question;
    const chips = relatedChips(queryTokens, questions, question, baseSuggestions);
    if (/director|board/i.test(question) && boardPeople.length) {
      return pack(
        "qa",
        `${plain(bestQa.item.answer)}${agentListBlock(boardPeople, boardPeople.length, "Board of Directors")}`,
        question,
        chips,
        uniqLinks(qaLinks(question), { label: "Board of Directors", href: "/about/board" }),
        toAgentHits(boardPeople)
      );
    }
    if (/our team|staff/i.test(question) && teamPeople.length) {
      return pack(
        "qa",
        `${plain(bestQa.item.answer)}${agentListBlock(teamPeople, teamPeople.length, "Our Team")}`,
        question,
        chips,
        uniqLinks(qaLinks(question), { label: "Our Team", href: "/about/team" }),
        toAgentHits(teamPeople)
      );
    }
    const extraAgents = /agent/i.test(question) ? allAgents.slice(0, 6) : [];
    const extra = extraAgents.length ? agentListBlock(extraAgents, allAgents.length, "Some of our agents") : "";
    return pack(
      "qa",
      `${plain(bestQa.item.answer)}${extra}`,
      question,
      chips,
      qaLinks(question),
      toAgentHits(extraAgents)
    );
  }

  if (ranked?.source === "document" && bestChunk.item && bestChunk.score >= 4.5) {
    return pack("document", documentReply(bestChunk.item, chunks), bestChunk.item.title || "Uploaded guide", suggestions, uniqLinks(DC_LINKS));
  }

  if (ranked?.source === "site" && bestSite.item && bestSite.score >= 3.8) {
    if (bestSite.item.kind === "team") {
      const href = bestSite.item.href || "/about/team";
      const label = href === "/about/board" ? "Board of Directors" : "Our Team";
      return pack(
        "site",
        clip(`${bestSite.item.title}\n\n${bestSite.item.place || ""}\n${bestSite.item.text}`, 900),
        bestSite.item.title,
        suggestions,
        uniqLinks({ label, href }),
        toAgentHits([bestSite.item])
      );
    }
    if (bestSite.item.kind === "faq") {
      return pack(
        "site",
        clip(`${bestSite.item.title}\n\n${bestSite.item.text}`, 1000),
        bestSite.item.title,
        relatedChips(queryTokens, questions, bestSite.item.title, baseSuggestions),
        uniqLinks({ label: "FAQ", href: "/faq" })
      );
    }
    return pack(
      "site",
      clip(`${bestSite.item.title}\n\n${bestSite.item.text}`, 1000),
      bestSite.item.title,
      suggestions,
      siteLinks(bestSite.item)
    );
  }

  if (bestQa.item && bestQa.score >= 5 && bestQa.score >= bestChunk.score) {
    return pack("qa", plain(bestQa.item.answer), bestQa.item.question, suggestions, qaLinks(bestQa.item.question));
  }

  if (bestChunk.item && bestChunk.score >= 4.5) {
    return pack("document", documentReply(bestChunk.item, chunks), bestChunk.item.title || "Uploaded guide", suggestions, uniqLinks(DC_LINKS));
  }

  if (bestSite.item && bestSite.score >= 3.2) {
    return pack(
      "site",
      clip(`${bestSite.item.title}\n\n${bestSite.item.text}`, 1000),
      bestSite.item.title,
      suggestions,
      siteLinks(bestSite.item)
    );
  }

  if (bestQa.score >= 3 && bestQa.item) {
    return pack("qa", plain(bestQa.item.answer), bestQa.item.question, suggestions, qaLinks(bestQa.item.question));
  }

  return pack("fallback", settings.fallbackMessage, "", suggestions.length ? suggestions : questions.slice(0, 4).map((item) => item.question), [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
    { label: "Our Agent", href: "/branches" }
  ]);
}

function pack(source: AnswerSource, reply: string, sourceLabel: string, suggestions: string[], links: ChatLink[] = [], agents: AgentHit[] = []) {
  return { reply, source, sourceLabel, suggestions, links, agents };
}

function documentReply(
  chosen: { title?: string; text: string; docId: unknown; page: number },
  chunks: Array<{ title?: string; text: string; docId: unknown; page: number }>
) {
  const nearby = chunks
    .filter((item) => String(item.docId) === String(chosen.docId) && Math.abs(item.page - chosen.page) <= 1)
    .sort((a, b) => a.page - b.page)
    .slice(0, 2)
    .map((item) => item.text)
    .join("\n\n");
  return clip(`${chosen.title ? `${chosen.title}\n\n` : ""}${nearby || chosen.text}`, 900);
}

function cardLink(card: SiteCard): ChatLink | undefined {
  if (!card.href) return undefined;
  return { label: card.hrefLabel || card.title, href: card.href };
}

function siteLinks(card: SiteCard) {
  return uniqLinks(cardLink(card), PAGE_LINKS[card.kind]);
}

function qaLinks(question: string) {
  if (/install dc|dc installation/i.test(question)) return uniqLinks(DC_LINKS);
  if (/director|board/i.test(question)) {
    return uniqLinks({ label: "Board of Directors", href: "/about/board" }, { label: "Our Team", href: "/about/team" });
  }
  if (/our team|staff/i.test(question)) {
    return uniqLinks({ label: "Our Team", href: "/about/team" }, { label: "Board of Directors", href: "/about/board" });
  }
  if (/agent|cooperative|partner/i.test(question)) return uniqLinks(BECOME_LINKS);
  return uniqLinks(PAGE_LINKS.faq, { label: "Contact", href: "/contact" });
}

function toAgentHits(cards: SiteCard[]): AgentHit[] {
  return cards
    .filter((card) => card.href)
    .map((card) => ({
      name: card.title,
      place: card.place || "",
      phone: card.phone || "",
      href: card.href as string
    }));
}

function agentListBlock(hits: SiteCard[], total: number, heading: string, moreLabel = "See all agents") {
  if (!hits.length) return "";
  const rows = hits.map((hit, index) => {
    const place = hit.place || "";
    const phone = hit.phone || "";
    return [`${index + 1}. ${hit.title}`, place ? `   ${place}` : "", phone ? `   ${phone}` : ""].filter(Boolean).join("\n");
  });
  const more = total > hits.length ? `\n\nShowing ${hits.length} of ${total}. Tap ${moreLabel} for the full list.` : "";
  return `\n\n${heading}\n${rows.join("\n\n")}${more}`;
}

function relatedChips(
  queryTokens: string[],
  questions: Array<{ question: string; keywords?: string }>,
  exclude: string,
  fallback: string[]
) {
  const related = questions
    .filter((item) => item.question !== exclude)
    .map((item) => ({
      question: item.question,
      score: overlap(queryTokens, item.question, 3) + overlap(queryTokens, item.keywords || "", 2.2)
    }))
    .filter((item) => item.score >= 3.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.question);
  const seen = new Set<string>();
  return [...related, ...fallback].filter((item) => {
    if (!item || seen.has(item)) return false;
    seen.add(item);
    return true;
  }).slice(0, 6);
}

function uniqLinks(...groups: Array<ChatLink | ChatLink[] | undefined>) {
  const seen = new Set<string>();
  const out: ChatLink[] = [];
  for (const group of groups) {
    const items = Array.isArray(group) ? group : group ? [group] : [];
    for (const item of items) {
      if (!item?.href || !item.label || seen.has(item.href)) continue;
      seen.add(item.href);
      out.push(item);
    }
  }
  return out.slice(0, 8);
}

function formatSteps(steps: Array<{ title: string; body: string }>) {
  return [
    "Here are the agent creation steps:",
    ...steps.map((step, index) => `${index + 1}. ${step.title}\n${plain(step.body)}`)
  ].join("\n\n");
}

function numberedStep(query: string) {
  const match = query.match(/\b(?:step|number|#)\s*(\d{1,2})\b/i) || query.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+step\b/i);
  if (!match) return 0;
  return Number(match[1]);
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9\u0900-\u097f]+/)
    .filter((token) => (token.length > 2 || token === "dc") && !STOP.has(token));
}

function overlap(queryTokens: string[], haystack: string, weight: number) {
  if (!haystack || !queryTokens.length) return 0;
  const hay = haystack.toLowerCase();
  let score = 0;
  let hits = 0;
  for (const token of queryTokens) {
    if (hay.includes(token)) {
      score += weight;
      hits += 1;
    }
  }
  if (hits === queryTokens.length) score += 2.5;
  const phrase = queryTokens.slice(0, 8).join(" ");
  if (phrase.length > 10 && hay.includes(phrase)) score += 5;
  return score;
}

function plain(value: string) {
  return stripHtml(value).replace(/\s+\n/g, "\n").trim();
}

function clip(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}…`;
}
