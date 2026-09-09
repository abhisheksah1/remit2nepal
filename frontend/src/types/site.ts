import type { AboutCompany, CmsSection, CompanySettings, GalleryItem, NavItem, NewsItem, PartnerItem, SeoSettings, ServiceItem, SocialLink, TeamMember } from "./content";
import type { PublicRatesPayload } from "./rates";

export interface PublicSite {
  settings: CompanySettings | null;
  seo: SeoSettings | null;
  navigation: NavItem[];
  social: SocialLink[];
  sections: CmsSection[];
  services: ServiceItem[];
  partners: PartnerItem[];
  news: NewsItem[];
  about: AboutCompany | null;
  team: TeamMember[];
}

export interface HomePayload extends PublicSite {
  rates: PublicRatesPayload;
  gallery: GalleryItem[];
}
