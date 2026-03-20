"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TenantConfig } from "@/types/tenant";
import { TenantProvider } from "@/lib/tenant-context";
import { getTenantConfig, saveTenantConfig } from "@/lib/tenant-firestore";
import { demoTenant, sampleTenants } from "@/lib/demo-tenant";
import TenantAdminDashboard from "@/components/TenantAdminDashboard";

const localConfigs: Record<string, TenantConfig> = {
  demo: demoTenant,
  ...Object.fromEntries(sampleTenants.map((t) => [t.slug, t])),
};

export default function TenantDashboardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const localConfig = localConfigs[slug] || null;
  const [config, setConfig] = useState<TenantConfig | null>(localConfig);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (localConfig) {
      saveTenantConfig(localConfig).catch(() => {});
      return;
    }

    async function load() {
      try {
        const tenantConfig = await getTenantConfig(slug);
        if (tenantConfig) {
          setConfig(tenantConfig);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      }
    }
    load();
  }, [slug, localConfig]);

  if (notFound) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Not Found</h1>
          <p className="text-muted-foreground">
            No dashboard found for &quot;{slug}&quot;.
          </p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <TenantProvider config={config}>
      <TenantAdminDashboard config={config} />
    </TenantProvider>
  );
}
