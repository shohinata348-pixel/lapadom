"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type SiteHeaderProps = {
  compact?: boolean;
};

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (compact) return;
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [compact]);

  const homeHeaderClass = isScrolled
    ? "bg-background/90 border-b border-border/50 backdrop-blur-md"
    : "bg-transparent border-b border-transparent";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={
        compact
          ? "sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur"
          : `fixed top-0 z-50 w-full transition-colors duration-500 ${homeHeaderClass}`
      }
    >
      <div className={`container mx-auto flex items-center justify-between px-6 ${compact ? "h-20" : "h-24"}`}>
        <Link href="/" className={compact || isScrolled ? "font-serif text-2xl tracking-wide text-foreground" : "font-serif text-2xl tracking-wide text-background"}>
          ЛапаДом
        </Link>
        <nav className="hidden items-center gap-8 text-sm uppercase tracking-wide md:flex">
          {!compact ? (
            <>
              <a href="#philosophy" className={isScrolled ? "text-muted-foreground hover:text-foreground" : "text-background/85 hover:text-background"}>Философия</a>
              <a href="#spaces" className={isScrolled ? "text-muted-foreground hover:text-foreground" : "text-background/85 hover:text-background"}>Пространства</a>
              <a href="#services" className={isScrolled ? "text-muted-foreground hover:text-foreground" : "text-background/85 hover:text-background"}>Забота</a>
              <Link href="/cabinet" className={isScrolled ? "text-muted-foreground hover:text-foreground" : "text-background/85 hover:text-background"}>Личный кабинет</Link>
              <Link href="/rooms" className={isScrolled ? "text-primary hover:text-foreground" : "text-primary-foreground/95 hover:text-background"}>Забронировать</Link>
            </>
          ) : (
            <>
              <Link href="/" className={pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>
                Главная
              </Link>
              <Link href="/rooms" className={pathname === "/rooms" || pathname.startsWith("/book/") ? "text-primary" : "text-muted-foreground hover:text-foreground"}>
                Номера
              </Link>
              <Link href="/cabinet" className={pathname === "/cabinet" ? "text-primary" : "text-muted-foreground hover:text-foreground"}>
                Личный кабинет
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}