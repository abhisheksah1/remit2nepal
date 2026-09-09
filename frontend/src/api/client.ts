import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { getCsrfToken, needsCsrf } from "./csrf";
import type { ApiErrorBody, ApiFieldError, ApiSuccess } from "@/types/api";

export class ApiError extends Error {
  status: number;
  errors: ApiFieldError[];

  constructor(message: string, status: number, errors: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  timeout: 30000,
  headers: {
    Accept: "application/json"
  }
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method ?? "get";
  if (needsCsrf(method)) {
    const token = getCsrfToken();
    if (token) {
      config.headers.set("X-CSRF-Token", token);
    }
  }
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

function isAuthPath(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/refresh") || url.includes("/auth/logout");
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry && !isAuthPath(original.url)) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/auth/refresh").then(() => undefined);
        }
        await refreshPromise;
        refreshPromise = null;
        return api(original);
      } catch {
        refreshPromise = null;
      }
    }

    const body = error.response?.data;
    throw new ApiError(
      body?.message || error.message || "Request failed",
      status ?? 0,
      body?.errors ?? []
    );
  }
);

export async function unwrap<T>(promise: Promise<{ data: ApiSuccess<T> }>): Promise<T> {
  const { data } = await promise;
  return data.data;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export type RequestConfig = AxiosRequestConfig;
