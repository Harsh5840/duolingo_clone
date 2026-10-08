import { AppShell } from "@/components/app-shell";
import { ThemeRoot } from "@/components/theme-root";
import { FireIcon, OwlLogo } from "@/components/icons";
import { sget } from "@/lib/server";
import type { Profile } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await sget<Profile>("/api/v1/profile");
  const me = profile.me;
  return (
    <ThemeRoot theme={me.theme}>
      <AppShell me={me}>
        <div className="flex items-center gap-4">
          <OwlLogo className="h-20 w-20" />
          <div>
            <h1 className="text-3xl font-extrabold">{me.display_name}</h1>
            <p className="text-muted">@{me.username}</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Day streak" value={me.streak} extra={<FireIcon />} />
          <Stat label="Total XP" value={me.xp} />
          <Stat label="Crowns" value={profile.crowns} />
          <Stat label="Gems" value={me.gems} />
        </div>
        <h2 className="mt-10 text-xl font-extrabold">Achievements</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {profile.achievements.map((a) => (
            <div
              key={a.code}
              className={`rounded-2xl border-2 p-4 ${a.unlocked ? "border-gold bg-[#fff8dc]" : "border-border opacity-50"}`}
            >
              <p className="font-extrabold">{a.name}</p>
              <p className="text-sm text-muted">{a.description}</p>
            </div>
          ))}
        </div>
      </AppShell>
    </ThemeRoot>
  );
}

function Stat({ label, value, extra }: { label: string; value: number; extra?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-border p-4">
      <div className="flex items-center gap-2 text-2xl font-extrabold tabular">
        {extra}
        {value}
      </div>
      <p className="text-sm font-bold text-muted">{label}</p>
    </div>
  );
}
