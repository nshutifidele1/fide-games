
"use client";

import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Games", href: "/#games" },
  { name: "Reviews", href: "/#reviews" },
  { name: "News", href: "/#news" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const gamesRef = firestore ? query(collection(firestore, "games"), orderBy("title", "asc")) : null;
  const { data: games } = useCollection(gamesRef);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    if (auth) await signOut(auth);
  };

  const filteredGames = searchQuery.trim() === "" 
    ? [] 
    : games?.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleGameClick = (gameId: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/games/${gameId}`);
  };

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

        {/* Search & Auth */}
        <div className="hidden lg:flex items-center gap-4">
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary transition-all">
                <SearchIcon className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] glass border-primary/20 p-0 overflow-hidden">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="font-headline text-2xl font-bold uppercase tracking-widest text-primary mb-4">Neural Search Nexus</DialogTitle>
                <div className="relative">
                  <Input 
                    placeholder="Scan repository for titles or genres..." 
                    className="h-14 bg-white/5 border-primary/20 rounded-2xl px-12 focus-visible:ring-primary text-white font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                </div>
              </DialogHeader>
              <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
                {searchQuery.trim() === "" ? (
                  <div className="text-center py-10 opacity-50">
                    <p className="font-headline text-xs uppercase tracking-[0.3em]">Awaiting input parameters...</p>
                  </div>
                ) : filteredGames && filteredGames.length > 0 ? (
                  filteredGames.map((game: any) => (
                    <button 
                      key={game.id}
                      onClick={() => handleGameClick(game.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-primary/10 transition-all border border-white/5 hover:border-primary/30 text-left group"
                    >
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{game.title}</h4>
                        <Badge variant="outline" className="mt-1 border-primary/30 text-primary/80 text-[10px]">{game.category}</Badge>
                      </div>
                      <Gamepad2 className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground italic">No matching titles found in the Nexus registry.</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-primary/5 border-t border-primary/10 flex justify-between items-center px-6">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Repository Status: Optimal</span>
                <Link href="/search" onClick={() => setIsSearchOpen(false)} className="text-[10px] font-bold text-white hover:text-primary transition-colors underline uppercase tracking-widest">Advanced Scan</Link>
              </div>
            </DialogContent>
          </Dialog>

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
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem className="focus:bg-destructive/20 cursor-pointer text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
            </>
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
                <Link href="/admin" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-xl font-headline font-bold">
                    Admin Panel
                  </Button>
                </Link>
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
    </nav>
  );
}
