import { AppShell, RightRail } from "@/components/app-shell";
import { ThemeRoot } from "@/components/theme-root";
import { OwlLogo } from "@/components/icons";
import { sget } from "@/lib/server";
import type { LeaderboardRow, Me } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const [me, rows] = await Promise.all([
    sget<Me>("/api/v1/me"),
    sget<LeaderboardRow[]>("/api/v1/leaderboard"),
  ]);
  return (
    <ThemeRoot theme={me.theme}>
      <AppShell me={me} right={<RightRail me={me} />}>
        <h1 className="mb-6 text-3xl font-extrabold">Leaderboards</h1>
        <div className="overflow-hidden rounded-2xl border-2 border-border">
          {rows.map((row) => (
            <div
              key={row.user_id}
              className={`flex items-center gap-4 border-b-2 border-border px-4 py-3 last:border-b-0 ${
                row.is_you ? "bg-[#ddf4ff]" : "bg-surface"
              }`}
            >
              <span className="w-8 font-extrabold tabular text-muted">{row.rank}</span>
              <OwlLogo className="h-10 w-10" />
              <div className="flex-1">
                <p className="font-extrabold">
                  {row.display_name}
                  {row.is_you ? <span className="ml-2 text-sm text-blue">YOU</span> : null}
                </p>
                <p className="text-sm text-muted">@{row.username}</p>
              </div>
              <span className="font-extrabold tabular text-orange">{row.xp} XP</span>
            </div>
          ))}
        </div>
      </AppShell>
    </ThemeRoot>
  );
}
