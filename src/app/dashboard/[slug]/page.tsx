"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TenantConfig } from "@/types/tenant";
import { TenantProvider } from "@/lib/tenant-context";
import { getTenantConfig, saveTenantConfig } from "@/lib/tenant-firestore";
import { demoTenant, sampleTenants } from "@/lib/demo-tenant";
import TenantAdminDashboard from "@/components/TenantAdminDashboard";
import { Loader2 } from "lucide-react";

const localConfigs: Record<string, TenantConfig> = {
  demo: demoTenant,
  ...Object.fromEntries(sampleTenants.map((t) => [t.slug, t])),
};

export default function TenantDashboardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        let tenantConfig = await getTenantConfig(slug);
        if (!tenantConfig) {
          const local = localConfigs[slug];
          if (local) {
            tenantConfig = local;
            saveTenantConfig(local).catch(() => {});
          }
        }
        if (tenantConfig) {
          setConfig(tenantConfig);
        } else {
          setNotFound(true);
        }
      } catch {
        const local = localConfigs[slug];
        if (local) {
          setConfig(local);
        } else {
          setNotFound(true);
        }
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !config) {
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

  return (
    <TenantProvider config={config}>
      <TenantAdminDashboard config={config} />
    </TenantProvider>
  );
}
