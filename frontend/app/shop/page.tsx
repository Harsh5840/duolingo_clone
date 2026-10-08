import { AppShell } from "@/components/app-shell";
import { ThemeRoot } from "@/components/theme-root";
import { sget } from "@/lib/server";
import type { Me } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const me = await sget<Me>("/api/v1/me");
  return (
    <ThemeRoot theme={me.theme}>
      <AppShell me={me}>
        <h1 className="text-3xl font-extrabold">Shop</h1>
        <p className="mt-2 text-muted">You have {me.gems} gems. Super Duolingo and streak freezes are coming soon.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {["Streak Freeze", "Heart refill", "Outfit", "Super Duolingo"].map((item) => (
            <div key={item} className="rounded-2xl border-2 border-border p-5">
              <p className="font-extrabold">{item}</p>
              <p className="mt-1 text-sm font-extrabold uppercase tracking-wide text-blue">Coming soon</p>
            </div>
          ))}
        </div>
      </AppShell>
    </ThemeRoot>
  );
}
