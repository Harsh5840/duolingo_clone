"use client";

import { useState, useTransition } from "react";
import { startLegendaryAction, startLessonAction } from "@/app/actions";
import { type PathSkill, type PathUnit } from "@/lib/api";
import { DuoButton } from "./duo-button";
import { CrownIcon, LockIcon, SkillGlyph } from "./icons";

const OFFSETS = [0, 56, 88, 56, 0, -56, -88, -56];

export function PathView({ units }: { units: PathUnit[] }) {
  const [picked, setPicked] = useState<PathSkill | null>(null);
  const [busy, start] = useTransition();
  const [err, setErr] = useState("");

  function startLesson(skill: PathSkill, legendary = false) {
    setErr("");
    start(async () => {
      try {
        if (legendary) {
          await startLegendaryAction(skill.id);
          return;
        }
        if (!skill.next_lesson_id) return;
        await startLessonAction(skill.next_lesson_id);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Could not start");
      }
    });
  }

  let node = 0;
  return (
    <div className="mx-auto max-w-[420px]">
      {units.map((unit) => (
        <section key={unit.id} className="mb-10">
          <div
            className="mb-8 flex items-center justify-between rounded-2xl px-5 py-4 text-white"
            style={{ background: unit.color }}
          >
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wider opacity-80">Unit {unit.index}</p>
              <h2 className="text-xl font-extrabold">{unit.title}</h2>
              <p className="text-sm opacity-90">{unit.description}</p>
            </div>
            <button
              type="button"
              className="rounded-2xl border-2 border-white/40 px-3 py-2 text-xs font-extrabold uppercase tracking-wide"
            >
              Guidebook
            </button>
          </div>
          <ol className="relative flex flex-col items-center gap-7">
            {unit.skills.map((skill) => {
              const x = OFFSETS[node % OFFSETS.length];
              node += 1;
              const current = skill.state === "current";
              const locked = skill.state === "locked";
              return (
                <li key={skill.id} className="relative" style={{ transform: `translateX(${x}px)` }}>
                  {current ? (
                    <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-xl border-2 border-border bg-surface px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-blue shadow-[0_4px_0_var(--border)]">
                      Start
                    </div>
                  ) : null}
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => setPicked(skill)}
                    className={`relative grid h-[70px] w-[70px] place-items-center rounded-full border-0 text-white ${
                      current ? "duo-bounce" : ""
                    }`}
                    style={{
                      background: locked ? "var(--locked)" : skill.state === "complete" ? unit.color : unit.color,
                      boxShadow: locked
                        ? "0 8px 0 #cfcfcf"
                        : `0 8px 0 color-mix(in srgb, ${unit.color} 70%, black)`,
                    }}
                    aria-label={skill.name}
                  >
                    {locked ? <LockIcon /> : <SkillGlyph name={skill.icon} />}
                    {skill.crowns > 0 ? (
                      <span className="absolute -bottom-2 flex items-center gap-0.5 rounded-full bg-surface px-1.5 text-[10px] font-extrabold text-ink shadow">
                        <CrownIcon />
                        {skill.crowns}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      {picked ? (
        <div className="fixed inset-0 z-40 grid place-items-end bg-black/40 p-4" onClick={() => setPicked(null)}>
          <div
            className="w-full max-w-md rounded-3xl border-2 border-border bg-surface p-6 drawer-in"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-extrabold uppercase tracking-wide text-muted">
              {picked.crowns} / 5 crowns
            </p>
            <h3 className="text-2xl font-extrabold">{picked.name}</h3>
            <p className="mt-1 text-muted">{picked.description}</p>
            {err ? <p className="mt-3 font-bold text-red">{err}</p> : null}
            {picked.state === "locked" ? (
              <p className="mt-4 font-bold text-muted">Complete the previous skill to unlock this.</p>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                <DuoButton disabled={busy} onClick={() => startLesson(picked)}>
                  Start +10 XP
                </DuoButton>
                {picked.legendary_lesson_id ? (
                  <DuoButton variant="gold" disabled={busy} onClick={() => startLesson(picked, true)}>
                    Legendary challenge
                  </DuoButton>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
