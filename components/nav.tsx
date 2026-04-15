"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Portfolio",   href: "/portfolio" },
  { label: "Presets",     href: "/presets" },
  { label: "Expedições",  href: "/expedicoes" },
  { label: "Sobre",       href: "/#sobre" },
];

interface TabPosition { left: number; width: number; opacity: number }

function NavTab({
  children,
  href,
  active,
  setPosition,
}: {
  children: React.ReactNode;
  href: string;
  active?: boolean;
  setPosition: React.Dispatch<React.SetStateAction<TabPosition>>;
}) {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
      }}
      className="relative z-10 list-none"
    >
      <Link
        href={href}
        className="block px-4 py-2 text-[10px] uppercase tracking-widest transition-colors"
        style={{
          color: active ? "#E6DDD4" : "#746A62",
          mixBlendMode: "difference",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </Link>
    </li>
  );
}

function NavCursor({ position }: { position: TabPosition }) {
  return (
    <motion.li
      animate={{ left: position.left, width: position.width, opacity: position.opacity }}
      className="absolute top-1 bottom-1 z-0 rounded-full list-none pointer-events-none"
      style={{ background: "rgba(200,144,90,.18)", border: "1px solid rgba(200,144,90,.3)" }}
    />
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const [position, setPosition] = useState<TabPosition>({ left: 0, width: 0, opacity: 0 });

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className="flex items-center justify-between w-full px-5 py-2.5"
        style={{
          maxWidth: 680,
          background: "rgba(14,12,10,.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 43,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-semibold text-sm tracking-wide flex-shrink-0"
          style={{ color: "#E6DDD4", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}
        >
          henriq.eu
        </Link>

        {/* Sliding tabs */}
        <ul
          className="relative flex items-center p-1 rounded-full"
          onMouseLeave={() => setPosition((p) => ({ ...p, opacity: 0 }))}
          style={{ gap: 0 }}
        >
          {NAV_ITEMS.map((item) => (
            <NavTab
              key={item.label}
              href={item.href}
              active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
              setPosition={setPosition}
            >
              {item.label}
            </NavTab>
          ))}
          <NavCursor position={position} />
        </ul>

        {/* CTA */}
        {pathname === "/presets" ? (
          <a
            href="https://pay.cakto.com.br/C4dmPFR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full flex-shrink-0 transition-all"
            style={{ background: "#E6DDD4", color: "#0E0C0A" }}
          >
            Obter Agora
          </a>
        ) : (
          <Link
            href="/presets"
            className="text-[10px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full flex-shrink-0 transition-all"
            style={{ background: "#E6DDD4", color: "#0E0C0A" }}
          >
            Ver Presets
          </Link>
        )}
      </nav>
    </header>
  );
}
