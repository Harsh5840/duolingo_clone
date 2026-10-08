import { AppShell } from "@/components/app-shell";
import { ThemeRoot } from "@/components/theme-root";
import { HeartIcon } from "@/components/icons";
import { sget } from "@/lib/server";
import type { Me } from "@/lib/api";
import { RefillButton } from "@/components/refill-button";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const me = await sget<Me>("/api/v1/me");
  return (
    <ThemeRoot theme={me.theme}>
      <AppShell me={me}>
        <h1 className="text-3xl font-extrabold">Practice</h1>
        <p className="mt-2 max-w-xl text-muted">
          Hearts refill over time (one every 4 hours). Need them now? A short practice session restores all five.
        </p>
        <div className="mt-6 flex items-center gap-2 text-2xl font-extrabold tabular text-red">
          <HeartIcon /> {me.hearts} / 5
        </div>
        <RefillButton />
        <div className="mt-10 rounded-2xl border-2 border-border p-5">
          <h2 className="font-extrabold">Pronunciation</h2>
          <p className="mt-1 text-muted">Real speech recognition is coming soon. Tap the blue speaker in lessons for audio.</p>
        </div>
      </AppShell>
    </ThemeRoot>
  );
}
