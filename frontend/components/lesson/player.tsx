"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, type AnswerOut, type CompleteOut, type Exercise, type SessionStart } from "@/lib/api";
import { DuoButton } from "../duo-button";
import { ExerciseBody } from "../exercises";
import { HeartIcon, SpeakerIcon } from "../icons";

export function LessonPlayer({
  session,
  legendary = false,
}: {
  session: SessionStart & { exercise: Exercise };
  legendary?: boolean;
}) {
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise>(session.exercise);
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(session.hearts);
  const [canCheck, setCanCheck] = useState(false);
  const [feedback, setFeedback] = useState<AnswerOut | null>(null);
  const [complete, setComplete] = useState<CompleteOut | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(session.time_limit_sec);
  const answerRef = useRef<unknown>(null);

  useEffect(() => {
    if (!legendary || seconds == null) return;
    if (seconds <= 0) {
      setFailed(true);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => (s == null ? s : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [legendary, seconds]);

  function speak() {
    const text =
      exercise.type === "type_answer" || exercise.type === "word_bank"
        ? exercise.prompt
        : String((exercise.payload.options as string[] | undefined)?.[0] || exercise.prompt);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  async function check() {
    if (busy || !canCheck) return;
    setBusy(true);
    try {
      const out = await api<AnswerOut>(`/api/v1/sessions/${session.session_id}/answer`, {
        method: "POST",
        body: JSON.stringify({ exercise_id: exercise.id, answer: answerRef.current }),
      });
      setFeedback(out);
      setHearts(out.hearts);
      if (out.failed) setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  async function cont() {
    if (!feedback) return;
    if (feedback.failed) {
      setFailed(true);
      return;
    }
    if (feedback.done) {
      const out = await api<CompleteOut>(`/api/v1/sessions/${session.session_id}/complete`, {
        method: "POST",
      });
      setComplete(out);
      return;
    }
    if (feedback.next_exercise) {
      setExercise(feedback.next_exercise);
      setIndex((i) => i + 1);
      setFeedback(null);
      setCanCheck(false);
      answerRef.current = null;
    }
  }

  const progress = ((index + (feedback?.correct ? 1 : 0)) / session.total) * 100;

  if (complete) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-6 text-center">
        <div>
          <p className="text-6xl">{complete.legendary ? "🏆" : complete.perfect ? "🎉" : "⭐"}</p>
          <h1 className="mt-4 text-4xl font-extrabold text-green">
            {complete.legendary ? "Legendary!" : complete.perfect ? "Perfect!" : "Lesson complete!"}
          </h1>
          <p className="mt-2 text-lg font-bold text-muted">
            +{complete.xp_earned} XP · streak {complete.streak} · {complete.crowns} crowns
          </p>
          {complete.achievements.length ? (
            <p className="mt-2 font-bold text-gold">Badge: {complete.achievements.join(", ")}</p>
          ) : null}
          <DuoButton className="mt-8 w-full max-w-sm" onClick={() => router.push("/")}>
            Continue
          </DuoButton>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-6 text-center">
        <div>
          <p className="text-6xl">💔</p>
          <h1 className="mt-4 text-3xl font-extrabold">You ran out of hearts!</h1>
          <p className="mt-2 text-muted">Practice to refill, or wait for hearts to regenerate.</p>
          <div className="mt-8 flex flex-col gap-3">
            <DuoButton onClick={() => router.push("/practice")}>Practice to refill</DuoButton>
            <DuoButton variant="secondary" onClick={() => router.push("/")}>
              End lesson
            </DuoButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-surface"
      style={{
        background: feedback ? (feedback.correct ? "var(--green-tint)" : "var(--red-tint)") : "var(--surface)",
      }}
    >
      <div className="flex items-center gap-4 px-4 py-4 md:px-10">
        <Link href="/" className="text-2xl font-bold text-muted" aria-label="Close">
          ×
        </Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-green transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        {legendary && seconds != null ? (
          <span className="font-extrabold tabular text-orange">{seconds}s</span>
        ) : (
          <div className="flex items-center gap-1 font-extrabold tabular text-red">
            <HeartIcon />
            {hearts}
          </div>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pb-40 pt-6">
        <div className="mb-6 flex items-start gap-3">
          <button
            type="button"
            onClick={speak}
            className="grid h-14 w-14 place-items-center rounded-2xl bg-blue text-white shadow-[0_4px_0_var(--blue-lip)] active:translate-y-1 active:shadow-none"
            aria-label="Play audio"
          >
            <SpeakerIcon />
          </button>
          <h1 className="pt-2 text-2xl font-extrabold">{exercise.prompt}</h1>
        </div>
        <ExerciseBody
          key={exercise.id}
          exercise={exercise}
          onCanCheck={(ok, v) => {
            setCanCheck(ok);
            answerRef.current = v;
          }}
        />
      </div>

      <div className={`fixed inset-x-0 bottom-0 border-t-2 ${feedback ? (feedback.correct ? "border-green bg-green-tint" : "border-red bg-red-tint") : "border-border bg-surface"}`}>
        {feedback ? (
          <div className="mx-auto flex max-w-2xl flex-col gap-3 px-6 py-5 drawer-in md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-2xl font-extrabold ${feedback.correct ? "text-green-lip" : "text-red"}`}>
                {feedback.correct ? "Nice!" : "Correct solution:"}
              </p>
              {!feedback.correct ? (
                <p className="font-bold text-ink">
                  {Array.isArray(feedback.solution)
                    ? (feedback.solution as string[][]).map((p) => p.join(" — ")).join(" · ")
                    : String(feedback.solution)}
                </p>
              ) : (
                <p className="font-bold text-green-lip">Keep it up.</p>
              )}
            </div>
            <DuoButton variant={feedback.correct ? "primary" : "danger"} onClick={cont}>
              Continue
            </DuoButton>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl justify-end px-6 py-5">
            <DuoButton disabled={!canCheck || busy} onClick={check}>
              Check
            </DuoButton>
          </div>
        )}
      </div>
    </div>
  );
}
