import { AppShell, RightRail } from "@/components/app-shell";
import { ThemeRoot } from "@/components/theme-root";
import { sget } from "@/lib/server";
import type { Me } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function QuestsPage() {
  const me = await sget<Me>("/api/v1/me");
  return (
    <ThemeRoot theme={me.theme}>
      <AppShell me={me} right={<RightRail me={me} />}>
        <h1 className="text-3xl font-extrabold">Quests</h1>
        <p className="mt-2 text-muted">Friends quests and weekly chests are coming soon.</p>
        <div className="mt-6 rounded-2xl border-2 border-border p-5">
          <p className="font-extrabold">Earn {me.daily_goal_xp} XP today</p>
          <p className="mt-1 tabular text-muted">
            {me.today_xp} / {me.daily_goal_xp} XP
          </p>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-[#e5e5e5]">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${Math.min(100, (me.today_xp / me.daily_goal_xp) * 100)}%` }}
            />
          </div>
        </div>
      </AppShell>
    </ThemeRoot>
  );
}
