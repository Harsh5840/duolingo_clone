"use client";

import { useEffect } from "react";

export function ThemeRoot({ theme, children }: { theme: string; children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  }, [theme]);
  return <div data-theme={theme === "dark" ? "dark" : "light"}>{children}</div>;
}
