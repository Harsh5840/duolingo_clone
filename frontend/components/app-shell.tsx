"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Me } from "@/lib/api";
import {
  ChestIcon,
  DumbbellIcon,
  FireIcon,
  GemIcon,
  HeartIcon,
  HomeIcon,
  OwlLogo,
  PersonIcon,
  ShieldIcon,
  ShopIcon,
} from "./icons";

const NAV = [
  { href: "/", label: "Learn", icon: HomeIcon },
  { href: "/practice", label: "Practice", icon: DumbbellIcon },
  { href: "/leaderboard", label: "Leaderboards", icon: ShieldIcon },
  { href: "/quests", label: "Quests", icon: ChestIcon },
  { href: "/shop", label: "Shop", icon: ShopIcon },
  { href: "/profile", label: "Profile", icon: PersonIcon },
];

export function AppShell({
  me,
  children,
  right,
}: {
  me: Me;
  children: ReactNode;
  right?: ReactNode;
}) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-snow text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[256px] border-r-2 border-border bg-surface px-4 py-6 lg:flex lg:flex-col">
        <Link href="/" className="mb-6 flex items-center gap-2 px-3">
          <OwlLogo />
          <span className="text-2xl font-extrabold tracking-tight text-green">duolingo</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-2">
          {NAV.map((item) => {
            const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-3 font-extrabold uppercase tracking-[0.8px] ${
                  active
                    ? "border-[#84d8ff] bg-[#ddf4ff] text-blue"
                    : "border-transparent text-ink hover:bg-snow"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/settings" className="px-3 text-sm font-extrabold uppercase tracking-wider text-muted">
          Settings
        </Link>
      </aside>

      <header className="sticky top-0 z-10 flex items-center justify-end gap-6 border-b-2 border-border bg-surface px-4 py-3 lg:ml-[256px] lg:px-10">
        <HudStat icon={<FireIcon />} value={me.streak} color="text-orange" />
        <HudStat icon={<GemIcon />} value={me.gems} color="text-blue" />
        <HudStat icon={<HeartIcon />} value={me.hearts} color="text-red" />
      </header>

      <div className="lg:ml-[256px]">
        <div className="mx-auto flex max-w-[1100px] gap-8 px-4 py-6 lg:px-8">
          <main className="min-w-0 flex-1 pb-24">{children}</main>
          {right ? <aside className="hidden w-[300px] shrink-0 xl:block">{right}</aside> : null}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t-2 border-border bg-surface lg:hidden">
        {NAV.map((item) => {
          const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-extrabold uppercase ${
                active ? "text-blue" : "text-muted"
              }`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function HudStat({ icon, value, color }: { icon: ReactNode; value: number; color: string }) {
  return (
    <div className={`flex items-center gap-1.5 font-extrabold tabular ${color}`}>
      {icon}
      <span>{value}</span>
    </div>
  );
}

export function RightRail({ me, goalHref = "/practice" }: { me: Me; goalHref?: string }) {
  const pct = Math.min(100, Math.round((me.today_xp / me.daily_goal_xp) * 100));
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-border p-4">
        <p className="font-extrabold text-ink">Unlock Super Duolingo</p>
        <p className="mt-1 text-sm text-muted">No ads, unlimited hearts, and legendary challenges on tap.</p>
        <p className="mt-3 text-sm font-extrabold uppercase tracking-wide text-blue">Coming soon</p>
      </div>
      <div className="rounded-2xl border-2 border-border p-4">
        <div className="flex items-center justify-between">
          <p className="font-extrabold">Daily Quests</p>
          <a href={goalHref} className="text-sm font-extrabold uppercase text-blue">
            View all
          </a>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div
            className="relative grid h-14 w-14 place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--gold) ${pct * 3.6}deg, var(--border) 0deg)`,
            }}
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-surface text-xs font-extrabold tabular">
              {pct}%
            </div>
          </div>
          <div>
            <p className="font-extrabold">Earn {me.daily_goal_xp} XP</p>
            <p className="text-sm text-muted tabular">
              {me.today_xp} / {me.daily_goal_xp} XP
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border-2 border-border p-4">
        <p className="font-extrabold">League</p>
        <p className="mt-1 text-sm text-muted">Climb the XP board. You have {me.xp} XP.</p>
        <a href="/leaderboard" className="mt-3 inline-block text-sm font-extrabold uppercase text-blue">
          View league
        </a>
      </div>
    </div>
  );
}
