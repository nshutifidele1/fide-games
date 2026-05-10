"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, Twitter, Github, Youtube, Send, MessageSquare, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 px-6 border-t border-white/5 bg-background overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Gamepad2 className="w-8 h-8 text-primary group-hover:neon-text transition-all" />
              <span className="font-headline text-2xl font-bold tracking-tighter neon-text">FIDE GAMES</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs font-body">
              The nexus of futuristic gaming. Discover, play, and connect in the ultimate AAA digital sanctuary.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 glass rounded-full hover:border-primary/50 transition-all">
                <Twitter className="w-5 h-5 text-foreground/80 hover:text-primary" />
              </Link>
              <Link href="#" className="p-2 glass rounded-full hover:border-primary/50 transition-all">
                <Github className="w-5 h-5 text-foreground/80 hover:text-primary" />
              </Link>
              <Link href="#" className="p-2 glass rounded-full hover:border-primary/50 transition-all">
                <Youtube className="w-5 h-5 text-foreground/80 hover:text-primary" />
              </Link>
              <Link href="#" className="p-2 glass rounded-full hover:border-primary/50 transition-all">
                <MessageSquare className="w-5 h-5 text-foreground/80 hover:text-primary" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline text-lg font-bold mb-6 text-white uppercase tracking-widest">Platform</h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground font-body">
              <li><Link href="#" className="hover:text-primary transition-colors">Featured Games</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Live Esports</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Tournament Hub</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Top Streamers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Platform API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-lg font-bold mb-6 text-white uppercase tracking-widest">Support</h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground font-body">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Patch Notes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-lg font-bold mb-6 text-white uppercase tracking-widest">Neural Feed</h4>
            <p className="text-muted-foreground text-sm mb-6 font-body">Subscribe for real-time intel drops and game launches.</p>
            <div className="flex gap-2">
              <Input 
                className="bg-white/5 border-white/10 glass rounded-lg font-body focus-visible:ring-primary" 
                placeholder="Cyber mail address" 
              />
              <Button size="icon" className="bg-primary hover:bg-primary/90 rounded-lg shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-8">
               <Button className="w-full bg-[#5865F2] hover:bg-[#4752c4] font-headline font-bold gap-2">
                 <MessageSquare className="w-5 h-5" />
                 JOIN OUR DISCORD
               </Button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs font-headline uppercase tracking-widest">© 2025 FIDE GAMES PROTOCOL. ALL RIGHTS RESERVED.</span>
            <div className="flex items-center gap-2 text-xs font-headline font-bold text-primary">
              <span>DEVELOPED BY FIDE</span>
              <span className="text-muted-foreground/30">|</span>
              <Link href="mailto:nshutifidele1@gmail.com" className="hover:underline flex items-center gap-1">
                <Mail className="w-3 h-3" />
                nshutifidele1@gmail.com
              </Link>
            </div>
          </div>
          <div className="flex gap-6 text-[10px] font-headline font-bold text-muted-foreground tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">SYSTEM STATUS: OPTIMAL</Link>
            <Link href="#" className="hover:text-white transition-colors">Uptime: 99.99%</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
