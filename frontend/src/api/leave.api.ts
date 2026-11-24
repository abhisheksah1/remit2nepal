import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getCsrfToken, needsCsrf } from "./csrf";
import { ApiError, unwrap } from "./client";
import type { ApiErrorBody, ApiSuccess, ListParams } from "@/types/api";
import type {
  LeaveAuthPayload,
  LeaveDashboard,
  LeaveEmployee,
  LeaveList,
  LeaveRecord,
  LeaveType,
  AttendanceReport,
  MonthRegister
} from "@/types/leave";

export const leaveHttp = axios.create({
  baseURL: "/api/v1/leave-tracker",
  withCredentials: true,
  timeout: 30000,
  headers: { Accept: "application/json" }
});

leaveHttp.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method ?? "get";
  if (needsCsrf(method)) {
    const token = getCsrfToken();
    if (token) config.headers.set("X-CSRF-Token", token);
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

function isAuthPath(url: string | undefined) {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/refresh") || url.includes("/auth/logout");
}

leaveHttp.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    if (status === 401 && original && !original._retry && !isAuthPath(original.url)) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = leaveHttp.post("/auth/refresh").then(() => undefined);
        }
        await refreshPromise;
        refreshPromise = null;
        return leaveHttp(original);
      } catch {
        refreshPromise = null;
      }
    }
    const data = error.response?.data;
    throw new ApiError(data?.message || error.message || "Request failed", status ?? 0, data?.errors ?? []);
  }
);

function get<T>(path: string, params?: object) {
  return unwrap<T>(leaveHttp.get(path, { params }) as Promise<{ data: ApiSuccess<T> }>);
}
function post<T>(path: string, body?: unknown) {
  return unwrap<T>(leaveHttp.post(path, body) as Promise<{ data: ApiSuccess<T> }>);
}
function patch<T>(path: string, body?: unknown) {
  return unwrap<T>(leaveHttp.patch(path, body) as Promise<{ data: ApiSuccess<T> }>);
}
function del<T>(path: string) {
  return unwrap<T>(leaveHttp.delete(path) as Promise<{ data: ApiSuccess<T> }>);
}

export const leaveApi = {
  login: (userId: string, password: string, rememberMe: boolean) =>
    post<LeaveAuthPayload>("/auth/login", { userId, password, rememberMe }),
  logout: () => post<null>("/auth/logout"),
  me: () => get<LeaveAuthPayload>("/auth/me"),
  refresh: () => post<LeaveAuthPayload>("/auth/refresh"),
  dashboard: () => get<LeaveDashboard>("/dashboard"),
  monthRegister: (params?: { bsYear?: number; bsMonth?: number; search?: string }) =>
    get<MonthRegister>("/month-register", params),
  report: (params?: { bsYear?: number; bsMonth?: number; search?: string }) =>
    get<AttendanceReport>("/report", params),
  employees: {
    list: (params?: ListParams) => get<LeaveList<LeaveEmployee>>("/employees", params),
    create: (body: unknown) => post<LeaveEmployee>("/employees", body),
    update: (id: string, body: unknown) => patch<LeaveEmployee>(`/employees/${id}`, body),
    remove: (id: string) => del<LeaveEmployee>(`/employees/${id}`),
    uploadPhoto: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return post<{ url: string }>("/employees/photo", form);
    }
  },
  types: {
    list: (params?: ListParams) => get<LeaveList<LeaveType>>("/types", params),
    create: (body: unknown) => post<LeaveType>("/types", body),
    update: (id: string, body: unknown) => patch<LeaveType>(`/types/${id}`, body),
    remove: (id: string) => del<LeaveType>(`/types/${id}`)
  },
  leaves: {
    list: (params?: ListParams) => get<LeaveList<LeaveRecord>>("/leaves", params),
    mark: (body: unknown) => post<{ count: number; mark: string; items: LeaveRecord[] }>("/leaves/mark", body),
    create: (body: unknown) => post<LeaveRecord>("/leaves", body),
    update: (id: string, body: unknown) => patch<LeaveRecord>(`/leaves/${id}`, body),
    remove: (id: string) => del<LeaveRecord>(`/leaves/${id}`)
  }
};

