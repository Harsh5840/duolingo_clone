export function OwlLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <ellipse cx="32" cy="38" rx="22" ry="20" fill="#58CC02" />
      <ellipse cx="22" cy="30" rx="10" ry="11" fill="#fff" />
      <ellipse cx="42" cy="30" rx="10" ry="11" fill="#fff" />
      <circle cx="24" cy="31" r="4" fill="#4B4B4B" />
      <circle cx="40" cy="31" r="4" fill="#4B4B4B" />
      <path d="M28 42 L32 47 L36 42 Z" fill="#FF9600" />
      <ellipse cx="18" cy="16" rx="7" ry="8" fill="#58A700" />
      <ellipse cx="46" cy="16" rx="7" ry="8" fill="#58A700" />
    </svg>
  );
}

export function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
      <path d="M12 3 3 11h3v9h5v-6h2v6h5v-9h3L12 3z" />
    </svg>
  );
}

export function DumbbellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
      <path d="M4 9h2v6H4V9zm14 0h2v6h-2V9zM7 10h10v4H7v-4zM2 10h1v4H2v-4zm19 0h1v4h-1v-4z" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
      <path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4z" />
    </svg>
  );
}

export function ChestIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
      <path d="M3 8h18v11H3V8zm2-4h14l2 4H3l2-4zm7 6h2v3h3v2h-3v3h-2v-3H9v-2h3v-3z" />
    </svg>
  );
}

export function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
      <path d="M4 7h16l-1.2 12H5.2L4 7zm4-3h8l1 3H7l1-3z" />
    </svg>
  );
}

export function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
      <path d="M10 2h4l.5 3.2a7 7 0 0 1 2.1 1.2L19.5 5l2 3.5-2.6 1.7a7 7 0 0 1 0 2.6L21.5 14l-2 3.5-2.9-1.4a7 7 0 0 1-2.1 1.2L14 22h-4l-.5-3.2a7 7 0 0 1-2.1-1.2L4.5 19 2.5 15.5l2.6-1.7a7 7 0 0 1 0-2.6L2.5 9.5 4.5 6l2.9 1.4A7 7 0 0 1 9.5 6.2L10 2zm2 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}

export function FireIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
      <path fill="#FF9600" d="M12 2s3 4 3 7c0 1.5-.7 2.8-1.7 3.6C14.5 11 16 9 16 6c2 2.4 4 5.2 4 9a8 8 0 1 1-16 0c0-4 4-8 8-13z" />
    </svg>
  );
}

export function GemIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
      <path fill="#1CB0F6" d="M12 3 4 9l8 12 8-12-8-6z" />
      <path fill="#1899D6" d="M12 3v18L4 9l8-6z" />
    </svg>
  );
}

export function HeartIcon({ empty = false }: { empty?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
      <path
        fill={empty ? "#E5E5E5" : "#EA2B2B"}
        d="M12 21s-7-4.4-9.3-8.2C.7 9.6 2.2 6 5.5 6 7.4 6 9 7.2 12 10c3-2.8 4.6-4 6.5-4 3.3 0 4.8 3.6 2.8 6.8C19 16.6 12 21 12 21z"
      />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#afafaf" aria-hidden>
      <path d="M8 10V8a4 4 0 1 1 8 0v2h2v10H6V10h2zm2 0h4V8a2 2 0 1 0-4 0v2z" />
    </svg>
  );
}

export function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#FFC800" aria-hidden>
      <path d="M3 16 6 8l6 5 6-5 3 8H3z" />
    </svg>
  );
}

export function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden>
      <path d="M4 9h5l6-5v16l-6-5H4V9zm13 1.5a4 4 0 0 1 0 3" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function SkillGlyph({ name, className = "w-8 h-8" }: { name: string; className?: string }) {
  const common = { className, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
  if (name === "chat")
    return (
      <svg {...common}>
        <path d="M4 4h16v12H7l-3 3V4z" />
      </svg>
    );
  if (name === "speech")
    return (
      <svg {...common}>
        <path d="M5 6h14v8H8l-3 3V6z" />
      </svg>
    );
  if (name === "apple")
    return (
      <svg {...common}>
        <path d="M12 4c1 0 2 1 2 2 2-1 5 1 5 5 0 5-5 10-7 10S5 16 5 11c0-4 3-6 5-5 0-1 1-2 2-2z" />
      </svg>
    );
  if (name === "map")
    return (
      <svg {...common}>
        <path d="M4 6l6-2 4 2 6-2v14l-6 2-4-2-6 2V6z" />
      </svg>
    );
  if (name === "mug")
    return (
      <svg {...common}>
        <path d="M5 7h11v7a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V7zm11 2h2a3 3 0 0 1 0 6h-2" />
      </svg>
    );
  if (name === "home")
    return (
      <svg {...common}>
        <path d="M12 3 4 10h2v9h5v-6h2v6h5v-9h2L12 3z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 3 9 9H3l5 4-2 8 6-4 6 4-2-8 5-4h-6z" />
    </svg>
  );
}
