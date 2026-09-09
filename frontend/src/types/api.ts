export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFieldError {
  field?: string;
  message: string;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: ApiFieldError[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export type EntityId = {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type StatusFlag = "ACTIVE" | "INACTIVE";
export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type RateDisplayMode = "NRB" | "COMPANY" | "BOTH";
export type RoleName = "SUPER_ADMIN" | "ADMIN";

export type PermissionKey =
  | "dashboard"
  | "website_cms"
  | "about"
  | "services"
  | "branches"
  | "exchange_rates"
  | "nrb_integration"
  | "news"
  | "faq"
  | "gallery"
  | "partners"
  | "contact"
  | "media"
  | "seo"
  | "settings"
  | "audit_logs"
  | "admins"
  | "documents"
  | "chatbot"
  | "remittances";
