
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gamepad2, Menu, X, LogOut, User, LayoutDashboard, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useAuth, useFirestore, useCollection } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Games", href: "/#games" },
  { name: "Reviews", href: "/#reviews" },
  { name: "News", href: "/#news" },
];

const ADMIN_EMAIL = "nshutifidele1@gmail.com";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const isAdmin = useMemo(() => user?.email === ADMIN_EMAIL, [user]);

  const gamesQuery = useMemo(() => firestore ? query(collection(firestore, "games"), orderBy("title", "asc")) : null, [firestore]);
  const { data: games } = useCollection(gamesQuery);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    if (auth) await signOut(auth);
  };

  const filteredGames = useMemo(() => 
    searchQuery.trim() === "" 
    ? [] 
    : games?.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5), [games, searchQuery]);

  const handleGameClick = (gameId: string) => {
    setSearchQuery("");
    setIsSearchVisible(false);
    router.push(`/games/${gameId}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      <nav
        className={cn(
          "w-full transition-all duration-300 px-6 lg:px-12",
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

          {/* Search & Auth */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className={cn(
                "p-2.5 rounded-xl border border-white/5 transition-all",
                isSearchVisible ? "bg-primary/20 text-primary border-primary/30" : "glass text-foreground/70 hover:text-primary"
              )}
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/30 p-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary uppercase">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass border-primary/20" align="end" forceMount>
                  <DropdownMenuLabel className="font-headline">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user.displayName || "Agent"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-primary/10" />
                    </>
                  )}
                  
                  <DropdownMenuItem className="focus:bg-destructive/20 cursor-pointer text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-3">
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
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Cinematic Sub-Nav Search Bar */}
      <div className={cn(
        "w-full bg-background/40 backdrop-blur-md border-b border-white/5 transition-all duration-500 ease-in-out overflow-hidden z-40",
        isSearchVisible ? "max-h-24 opacity-100 py-4" : "max-h-0 opacity-0 py-0 border-none"
      )}>
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Scan for mission-critical titles, genres, or IDs..."
              className="relative w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-headline font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isSearchVisible}
            />
          </div>

          {/* Instant Scan Dropdown */}
          {searchQuery.trim() !== "" && (
            <div className="absolute top-[calc(100%+12px)] left-6 right-6 glass border border-primary/20 rounded-[2rem] overflow-hidden z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-4 space-y-2">
                {filteredGames && filteredGames.length > 0 ? (
                  filteredGames.map((game: any) => (
                    <button
                      key={game.id}
                      onClick={() => handleGameClick(game.id)}
                      className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-primary/10 transition-all text-left group border border-transparent hover:border-primary/20"
                    >
                      <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={game.coverUrl} className="w-full h-full object-cover" alt={game.title} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base truncate group-hover:text-primary transition-colors">{game.title}</p>
                        <Badge variant="outline" className="mt-1 border-primary/20 text-[10px] text-primary/70">{game.category}</Badge>
                      </div>
                      <Gamepad2 className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center opacity-50">
                    <SearchIcon className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                    <p className="font-headline text-xs uppercase tracking-[0.3em]">No Neural Matches Found</p>
                  </div>
                )}
                
                <Link 
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setIsSearchVisible(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 text-[11px] font-bold text-primary hover:text-white transition-all uppercase tracking-[0.25em] border-t border-white/5 mt-2 bg-primary/5 hover:bg-primary/20"
                >
                  FULL REPOSITORY SCAN
                  <SearchIcon className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
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
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-xl font-headline font-bold">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" className="w-full text-xl font-headline font-bold text-destructive" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  Disconnect
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
