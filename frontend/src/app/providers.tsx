import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { type ReactNode, useState } from "react";
import { ToastProvider } from "@/components/ui/Toast";

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30_000
          }
        }
      })
  );

  return (
    <QueryClientProvider client={client}>
      <ToastProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          {children}
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
