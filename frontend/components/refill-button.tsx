"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { refillHearts } from "@/app/actions";
import { DuoButton } from "./duo-button";

export function RefillButton() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  return (
    <>
      <DuoButton
        className="mt-6"
        onClick={async () => {
          await refillHearts();
          setMsg("Hearts refilled. Ready for another lesson!");
          router.refresh();
        }}
      >
        Practice to refill
      </DuoButton>
      {msg ? <p className="mt-4 font-bold text-green">{msg}</p> : null}
    </>
  );
}
