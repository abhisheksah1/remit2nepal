import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { SiteAtmosphere } from "@/components/public/SiteAtmosphere";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { SmoothScroll } from "@/components/public/SmoothScroll";
import { ChatWidget } from "@/components/public/ChatWidget";
import { SeoHead } from "@/components/public/SeoHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { MaintenancePage } from "./MaintenancePage";

export function PublicLayout() {
  const location = useLocation();
  const site = useQuery({
    queryKey: ["public", "site"],
    queryFn: publicApi.site,
    retry: 1
  });

  if (site.isLoading) {
    return (
      <div className="min-h-screen bg-cream p-8">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="mt-10 h-72 w-full" />
      </div>
    );
  }

  if (site.isError) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-6 text-center">
        <div>
          <p className="font-display text-3xl text-navy">Remit2Nepal</p>
          <p className="mt-3 text-ink-muted">The website could not be loaded. Please try again shortly.</p>
        </div>
      </div>
    );
  }

  const settings = site.data?.settings ?? null;
  if (settings?.maintenanceMode && !location.pathname.startsWith("/admin")) {
    return <MaintenancePage message={settings.maintenanceMessage} company={settings.companyName} />;
  }

  return (
    <div className="site-shell relative z-10 flex min-h-screen flex-col">
      <SeoHead seo={site.data?.seo} />
      <SiteAtmosphere />
      <ScrollReveal />
      <SmoothScroll />
      <Header settings={settings} items={site.data?.navigation ?? []} />
      <main className="page-enter relative z-0 min-w-0 flex-1 overflow-x-clip">
        <Suspense fallback={<div className="mx-auto max-w-site px-4 py-16 lg:px-8"><Skeleton className="h-72 w-full" /></div>}>
          <Outlet context={site.data} />
        </Suspense>
      </main>
      <Footer settings={settings} items={site.data?.navigation ?? []} social={site.data?.social ?? []} />
      <ChatWidget />
    </div>
  );
}
