import type { PermissionKey } from "@/types/api";
import {
  Activity,
  Building2,
  CircleHelp,
  Contact,
  FileText,
  GalleryHorizontal,
  Globe,
  Handshake,
  Home,
  ImageIcon,
  ImagePlus,
  LayoutDashboard,
  MessageCircle,
  Newspaper,
  PanelTop,
  Receipt,
  Settings,
  Shield,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Users,
  Wallet
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  permission?: PermissionKey;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNav: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", path: "/admin", icon: LayoutDashboard, permission: "dashboard" }]
  },
  {
    label: "Website",
    items: [
      { label: "Homepage", path: "/admin/homepage", icon: Home, permission: "website_cms" },
      { label: "Pages", path: "/admin/pages", icon: FileText, permission: "website_cms" },
      { label: "Sections", path: "/admin/sections", icon: PanelTop, permission: "website_cms" },
      { label: "Header & Footer", path: "/admin/header-footer", icon: Globe, permission: "website_cms" },
      { label: "Banners", path: "/admin/banners", icon: ImagePlus, permission: "website_cms" }
    ]
  },
  {
    label: "Company",
    items: [
      { label: "About", path: "/admin/about", icon: ShieldCheck, permission: "about" },
      { label: "Board & Team", path: "/admin/team", icon: Users, permission: "about" },
      { label: "Partners", path: "/admin/partners", icon: Handshake, permission: "partners" },
      { label: "Partnership Settings", path: "/admin/partners/settings", icon: SlidersHorizontal, permission: "partners" },
      { label: "Partner Applications", path: "/admin/partners/applications", icon: FileText, permission: "partners" },
      { label: "Services", path: "/admin/services", icon: Wallet, permission: "services" },
      { label: "Service Charge", path: "/admin/service-charge", icon: Receipt, permission: "services" },
      { label: "Documents", path: "/admin/documents", icon: FileText, permission: "documents" }
    ]
  },
  {
    label: "Branches",
    items: [{ label: "Branches", path: "/admin/branches", icon: Building2, permission: "branches" }]
  },
  {
    label: "Exchange Rates",
    items: [
      { label: "Current Rates", path: "/admin/rates", icon: Wallet, permission: "exchange_rates" },
      { label: "Rate History", path: "/admin/rates/history", icon: Activity, permission: "exchange_rates" },
      { label: "NRB Sync", path: "/admin/rates/nrb", icon: Shield, permission: "nrb_integration" },
      { label: "Rate Settings", path: "/admin/rates/settings", icon: SlidersHorizontal, permission: "exchange_rates" }
    ]
  },
  {
    label: "Content",
    items: [
      { label: "News", path: "/admin/news", icon: Newspaper, permission: "news" },
      { label: "FAQ", path: "/admin/faq", icon: CircleHelp, permission: "faq" },
      { label: "Chatbot", path: "/admin/chatbot", icon: MessageCircle, permission: "chatbot" },
      { label: "Gallery", path: "/admin/gallery", icon: GalleryHorizontal, permission: "gallery" }
    ]
  },
  {
    label: "Operations",
    items: [
      { label: "Control numbers", path: "/admin/remittances", icon: Search, permission: "remittances" },
      { label: "Media Library", path: "/admin/media", icon: ImageIcon, permission: "media" },
      { label: "Contact Messages", path: "/admin/contact", icon: Contact, permission: "contact" },
      { label: "SEO", path: "/admin/seo", icon: Globe, permission: "seo" },
      { label: "Administrators", path: "/admin/admins", icon: Shield, permission: "admins" },
      { label: "Audit Logs", path: "/admin/audit-logs", icon: Activity, permission: "audit_logs" },
      { label: "Settings", path: "/admin/settings", icon: Settings, permission: "settings" }
    ]
  }
];

export const NEPAL_PROVINCES = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim"
] as const;

