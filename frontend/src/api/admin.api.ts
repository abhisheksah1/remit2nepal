import { unwrap, api } from "./client";
import type { ListParams, Paginated } from "@/types/api";
import type { AdminAccount, PermissionOption } from "@/types/auth";
import type {
  AboutCompany,
  BannerItem,
  BranchItem,
  ChatbotAgentStep,
  ChatbotKnowledgeDoc,
  ChatbotQaItem,
  ChatbotSettings,
  CmsPage,
  CmsSection,
  CompanySettings,
  ContactMessage,
  DocumentItem,
  FaqItem,
  GalleryItem,
  MediaItem,
  NavItem,
  NewsItem,
  RemittanceItem,
  PartnerApplicationItem,
  PartnerApplicationStatus,
  PartnerItem,
  PartnershipSettings,
  SeoSettings,
  ServiceChargePage,
  ServiceChargeRow,
  ServiceItem,
  SocialLink,
  TeamMember
} from "@/types/content";
import type {
  CompanyRateInput,
  CurrencyItem,
  ExchangeRate,
  NrbConfig,
  NrbSyncLog,
  RateChartPayload,
  RateHistoryItem
} from "@/types/rates";
import type { AuditLogItem, DashboardPayload } from "@/types/ops";

function list<T>(path: string, params?: ListParams) {
  return unwrap<Paginated<T>>(api.get(path, { params }));
}

function get<T>(path: string) {
  return unwrap<T>(api.get(path));
}

function create<T>(path: string, body: unknown) {
  return unwrap<T>(api.post(path, body));
}

function patch<T>(path: string, body: unknown) {
  return unwrap<T>(api.patch(path, body));
}

function remove<T>(path: string) {
  return unwrap<T>(api.delete(path));
}

export const adminApi = {
  dashboard: () => get<DashboardPayload>("/dashboard"),

  pages: {
    list: (params?: ListParams) => list<CmsPage>("/pages", params),
    get: (id: string) => get<CmsPage>(`/pages/${id}`),
    create: (body: unknown) => create<CmsPage>("/pages", body),
    update: (id: string, body: unknown) => patch<CmsPage>(`/pages/${id}`, body),
    remove: (id: string) => remove<CmsPage>(`/pages/${id}`)
  },
  sections: {
    list: (params?: ListParams) => list<CmsSection>("/sections", params),
    get: (id: string) => get<CmsSection>(`/sections/${id}`),
    create: (body: unknown) => create<CmsSection>("/sections", body),
    update: (id: string, body: unknown) => patch<CmsSection>(`/sections/${id}`, body),
    remove: (id: string) => remove<CmsSection>(`/sections/${id}`)
  },
  navigation: {
    list: (params?: ListParams) => list<NavItem>("/navigation", params),
    get: (id: string) => get<NavItem>(`/navigation/${id}`),
    create: (body: unknown) => create<NavItem>("/navigation", body),
    update: (id: string, body: unknown) => patch<NavItem>(`/navigation/${id}`, body),
    remove: (id: string) => remove<NavItem>(`/navigation/${id}`)
  },
  social: {
    list: (params?: ListParams) => list<SocialLink>("/social", params),
    get: (id: string) => get<SocialLink>(`/social/${id}`),
    create: (body: unknown) => create<SocialLink>("/social", body),
    update: (id: string, body: unknown) => patch<SocialLink>(`/social/${id}`, body),
    remove: (id: string) => remove<SocialLink>(`/social/${id}`)
  },
  services: {
    list: (params?: ListParams) => list<ServiceItem>("/services", params),
    get: (id: string) => get<ServiceItem>(`/services/${id}`),
    create: (body: unknown) => create<ServiceItem>("/services", body),
    update: (id: string, body: unknown) => patch<ServiceItem>(`/services/${id}`, body),
    remove: (id: string) => remove<ServiceItem>(`/services/${id}`)
  },
  branches: {
    list: (params?: ListParams) => list<BranchItem>("/branches", params),
    get: (id: string) => get<BranchItem>(`/branches/${id}`),
    create: (body: unknown) => create<BranchItem>("/branches", body),
    update: (id: string, body: unknown) => patch<BranchItem>(`/branches/${id}`, body),
    remove: (id: string) => remove<BranchItem>(`/branches/${id}`)
  },
  partners: {
    list: (params?: ListParams) => list<PartnerItem>("/partners", params),
    get: (id: string) => get<PartnerItem>(`/partners/${id}`),
    create: (body: unknown) => create<PartnerItem>("/partners", body),
    update: (id: string, body: unknown) => patch<PartnerItem>(`/partners/${id}`, body),
    remove: (id: string) => remove<PartnerItem>(`/partners/${id}`)
  },
  partnership: {
    settings: () => get<PartnershipSettings>("/partnership-settings"),
    updateSettings: (body: unknown) => patch<PartnershipSettings>("/partnership-settings", body),
    uploadAgreement: (slot: string, file: File) => {
      const form = new FormData();
      form.append("file", file);
      return unwrap<PartnershipSettings>(api.post(`/partnership-settings/agreements/${slot}`, form));
    }
  },
  partnerApplications: {
    list: (params?: ListParams) => unwrap<Paginated<PartnerApplicationItem>>(api.get("/partner-applications", { params })),
    get: (id: string) => get<PartnerApplicationItem>(`/partner-applications/${id}`),
    update: (id: string, body: { status?: PartnerApplicationStatus; adminNotes?: string }) =>
      patch<PartnerApplicationItem>(`/partner-applications/${id}`, body),
    remove: (id: string) => remove<null>(`/partner-applications/${id}`)
  },
  banners: {
    list: (params?: ListParams) => list<BannerItem>("/banners", params),
    get: (id: string) => get<BannerItem>(`/banners/${id}`),
    create: (body: unknown) => create<BannerItem>("/banners", body),
    update: (id: string, body: unknown) => patch<BannerItem>(`/banners/${id}`, body),
    remove: (id: string) => remove<BannerItem>(`/banners/${id}`)
  },
  news: {
    list: (params?: ListParams) => list<NewsItem>("/news", params),
    get: (id: string) => get<NewsItem>(`/news/${id}`),
    create: (body: unknown) => create<NewsItem>("/news", body),
    update: (id: string, body: unknown) => patch<NewsItem>(`/news/${id}`, body),
    remove: (id: string) => remove<NewsItem>(`/news/${id}`)
  },
  faqs: {
    list: (params?: ListParams) => list<FaqItem>("/faqs", params),
    get: (id: string) => get<FaqItem>(`/faqs/${id}`),
    create: (body: unknown) => create<FaqItem>("/faqs", body),
    update: (id: string, body: unknown) => patch<FaqItem>(`/faqs/${id}`, body),
    remove: (id: string) => remove<FaqItem>(`/faqs/${id}`)
  },
  remittances: {
    list: (params?: ListParams) => list<RemittanceItem>("/remittances", params),
    get: (id: string) => get<RemittanceItem>(`/remittances/${id}`),
    create: (body: unknown) => create<RemittanceItem>("/remittances", body),
    update: (id: string, body: unknown) => patch<RemittanceItem>(`/remittances/${id}`, body),
    remove: (id: string) => remove<RemittanceItem>(`/remittances/${id}`)
  },
  serviceCharges: {
    list: (params?: ListParams) => list<ServiceChargeRow>("/service-charges", params),
    get: (id: string) => get<ServiceChargeRow>(`/service-charges/${id}`),
    create: (body: unknown) => create<ServiceChargeRow>("/service-charges", body),
    update: (id: string, body: unknown) => patch<ServiceChargeRow>(`/service-charges/${id}`, body),
    remove: (id: string) => remove<ServiceChargeRow>(`/service-charges/${id}`),
    page: () => get<ServiceChargePage>("/service-charges/page"),
    updatePage: (body: unknown) => patch<ServiceChargePage>("/service-charges/page", body)
  },
  gallery: {
    list: (params?: ListParams) => list<GalleryItem>("/gallery", params),
    get: (id: string) => get<GalleryItem>(`/gallery/${id}`),
    create: (body: unknown) => create<GalleryItem>("/gallery", body),
    update: (id: string, body: unknown) => patch<GalleryItem>(`/gallery/${id}`, body),
    remove: (id: string) => remove<GalleryItem>(`/gallery/${id}`)
  },
  documents: {
    list: (params?: ListParams) => list<DocumentItem>("/documents", params),
    get: (id: string) => get<DocumentItem>(`/documents/${id}`),
    create: (body: unknown) => create<DocumentItem>("/documents", body),
    update: (id: string, body: unknown) => patch<DocumentItem>(`/documents/${id}`, body),
    remove: (id: string) => remove<DocumentItem>(`/documents/${id}`)
  },
  team: {
    list: (params?: ListParams) => list<TeamMember>("/team", params),
    get: (id: string) => get<TeamMember>(`/team/${id}`),
    create: (body: unknown) => create<TeamMember>("/team", body),
    update: (id: string, body: unknown) => patch<TeamMember>(`/team/${id}`, body),
    remove: (id: string) => remove<TeamMember>(`/team/${id}`)
  },
  media: {
    list: (params?: ListParams) => unwrap<Paginated<MediaItem>>(api.get("/media", { params })),
    upload: (file: File, altText: string, folder: string) => {
      const form = new FormData();
      form.append("file", file);
      form.append("altText", altText);
      form.append("folder", folder);
      return unwrap<MediaItem>(api.post("/media", form));
    },
    update: (id: string, body: unknown) => patch<MediaItem>(`/media/${id}`, body),
    remove: (id: string) => remove<null>(`/media/${id}`)
  },
  about: {
    get: () => get<AboutCompany>("/about"),
    update: (body: unknown) => patch<AboutCompany>("/about", body)
  },
  settings: {
    get: () => get<CompanySettings>("/settings"),
    update: (body: unknown) => patch<CompanySettings>("/settings", body)
  },
  seo: {
    get: () => get<SeoSettings>("/seo"),
    update: (body: unknown) => patch<SeoSettings>("/seo", body)
  },
  contact: {
    list: (params?: ListParams) => unwrap<Paginated<ContactMessage>>(api.get("/contact", { params })),
    update: (id: string, status: ContactMessage["status"]) =>
      patch<ContactMessage>(`/contact/${id}`, { status }),
    remove: (id: string) => remove<null>(`/contact/${id}`)
  },
  admins: {
    list: (params?: ListParams) => unwrap<Paginated<AdminAccount>>(api.get("/admins", { params })),
    create: (body: unknown) => create<AdminAccount>("/admins", body),
    update: (id: string, body: unknown) => patch<AdminAccount>(`/admins/${id}`, body),
    remove: (id: string) => remove<AdminAccount>(`/admins/${id}`),
    permissions: () => get<PermissionOption[]>("/admins/permissions")
  },
  auditLogs: (params?: ListParams & { module?: string; userId?: string; action?: string }) =>
    unwrap<Paginated<AuditLogItem>>(api.get("/audit-logs", { params })),
  rates: {
    list: () => get<ExchangeRate[]>("/exchange-rates"),
    currencies: () => get<CurrencyItem[]>("/exchange-rates/currencies"),
    saveCurrency: (body: unknown) => create<CurrencyItem>("/exchange-rates/currencies", body),
    history: (params?: Record<string, string | number | undefined>) =>
      unwrap<Paginated<RateHistoryItem>>(api.get("/exchange-rates/history", { params })),
    chart: (params: { currencyCode: string; from: string; to: string; rateKind?: "NRB" | "COMPANY" }) =>
      unwrap<RateChartPayload>(api.get("/exchange-rates/chart", { params })),
    company: (body: CompanyRateInput) => create<ExchangeRate>("/exchange-rates/company", body),
    exportHistory: (params?: Record<string, string | undefined>) =>
      api.get<string>("/exchange-rates/history/export", { params, responseType: "blob" })
  },
  nrb: {
    config: () => get<NrbConfig>("/nrb/config"),
    saveConfig: (body: unknown) => patch<NrbConfig>("/nrb/config", body),
    sync: () => create<{ status: string; currenciesUpdated?: number }>("/nrb/sync", {}),
    logs: () => get<NrbSyncLog[]>("/nrb/logs")
  },
  chatbot: {
    settings: () => get<ChatbotSettings>("/chatbot/settings"),
    updateSettings: (body: unknown) => patch<ChatbotSettings>("/chatbot/settings", body),
    qa: {
      list: (params?: ListParams) => list<ChatbotQaItem>("/chatbot/qa", params),
      create: (body: unknown) => create<ChatbotQaItem>("/chatbot/qa", body),
      update: (id: string, body: unknown) => patch<ChatbotQaItem>(`/chatbot/qa/${id}`, body),
      remove: (id: string) => remove<ChatbotQaItem>(`/chatbot/qa/${id}`)
    },
    steps: {
      list: (params?: ListParams) => list<ChatbotAgentStep>("/chatbot/steps", params),
      create: (body: unknown) => create<ChatbotAgentStep>("/chatbot/steps", body),
      update: (id: string, body: unknown) => patch<ChatbotAgentStep>(`/chatbot/steps/${id}`, body),
      remove: (id: string) => remove<ChatbotAgentStep>(`/chatbot/steps/${id}`)
    },
    knowledge: () => get<ChatbotKnowledgeDoc[]>("/chatbot/knowledge"),
    uploadKnowledge: (file: File, title: string, category: string) => {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("category", category);
      return unwrap<ChatbotKnowledgeDoc>(api.post("/chatbot/knowledge", form));
    },
    removeKnowledge: (id: string) => remove<null>(`/chatbot/knowledge/${id}`)
  }
};
