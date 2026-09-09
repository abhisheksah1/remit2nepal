import { unwrap, api } from "./client";
import type { Paginated } from "@/types/api";
import type { BranchItem, CmsPage, DocumentItem, FaqItem, GalleryItem, NewsItem, PartnerItem, PublicChatbot, ChatbotAskResult, PublicPartnership, PublicServiceCharges, ServiceItem } from "@/types/content";
import type { HomePayload, PublicSite } from "@/types/site";
import type { PublicRatesPayload } from "@/types/rates";

export const publicApi = {
  site: () => unwrap<PublicSite>(api.get("/public/site")),
  home: () => unwrap<HomePayload>(api.get("/public/home")),
  rates: () => unwrap<PublicRatesPayload>(api.get("/public/exchange-rates")),
  branches: (params?: Record<string, string | number | undefined>) =>
    unwrap<Paginated<BranchItem>>(api.get("/public/branches", { params })),
  branch: (id: string) => unwrap<BranchItem>(api.get(`/public/branches/${id}`)),
  services: () => unwrap<ServiceItem[]>(api.get("/public/services")),
  service: (id: string) => unwrap<ServiceItem>(api.get(`/public/services/${id}`)),
  news: (category?: string) => unwrap<NewsItem[]>(api.get("/public/news", { params: { category } })),
  faqs: () => unwrap<FaqItem[]>(api.get("/public/faqs")),
  serviceCharges: () => unwrap<PublicServiceCharges>(api.get("/public/service-charges")),
  gallery: () => unwrap<GalleryItem[]>(api.get("/public/gallery")),
  documents: () => unwrap<DocumentItem[]>(api.get("/public/documents")),
  partners: () => unwrap<PartnerItem[]>(api.get("/public/partners")),
  partnership: () => unwrap<PublicPartnership>(api.get("/public/partnership")),
  applyPartnership: (form: FormData) => unwrap<{ id: string; status: string }>(api.post("/public/partner-applications", form)),
  page: (slug: string) => unwrap<CmsPage | null>(api.get(`/public/pages/${slug}`)),
  contact: (payload: { name: string; email: string; phone?: string; subject: string; message: string }) =>
    unwrap<null>(api.post("/public/contact", payload)),
  chatbot: () => unwrap<PublicChatbot>(api.get("/public/chatbot")),
  askChatbot: (message: string) => unwrap<ChatbotAskResult>(api.post("/public/chatbot/ask", { message }))
};
