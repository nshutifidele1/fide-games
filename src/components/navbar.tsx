
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gamepad2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Games", href: "/#games" },
  { name: "Reviews", href: "/#reviews" },
  { name: "News", href: "/#news" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12",
        scrolled
          ? "py-3 glass border-b border-primary/20 bg-background/80"
          : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-primary/20 border border-primary/40 group-hover:neon-border transition-all">
            <Gamepad2 className="w-6 h-6 text-primary" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight neon-text bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FIDE GAMES
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-headline text-sm font-medium tracking-wide text-foreground/70 hover:text-primary hover:neon-text transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/auth">
            <Button variant="ghost" className="text-foreground/80 hover:text-primary transition-all font-headline font-semibold">
              Login
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-primary hover:bg-primary/90 neon-border font-headline font-bold rounded-full px-6 transition-all duration-300">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/20 animate-in slide-in-from-top duration-300">
          <div className="p-8 flex flex-col gap-6 items-center text-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-headline text-xl font-bold text-foreground/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-full h-px bg-primary/20" />
            <Link href="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-xl font-headline font-bold">
                Login
              </Button>
            </Link>
            <Link href="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-primary neon-border text-xl font-headline font-bold py-6">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
