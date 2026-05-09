"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { HeroScene } from "@/components/hero-scene";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { TrendingNews } from "@/components/trending-news";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Trophy, Users, Zap, PlayCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <HeroScene />
        
        {/* Cinematic Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary font-headline text-xs font-bold tracking-[0.2em] uppercase mb-6 animate-pulse">
              Nexus Phase 4.0 Online
            </span>
            <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tighter mb-8">
              UNLEASH THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x neon-text">
                FUTURE
              </span>
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Step into FIDE GAMES. A high-fidelity gaming sanctuary designed for the next generation of digital pioneers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90 neon-border h-14 px-10 rounded-full font-headline font-bold text-lg group">
                ENTER THE NEXUS
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-white/10 glass font-headline font-bold text-lg hover:border-primary/50">
                <PlayCircle className="w-6 h-6 mr-3 text-secondary" />
                WATCH TRAILER
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Hero Decorative Elements */}
        <div className="absolute bottom-10 left-10 hidden xl:flex flex-col gap-4 animate-float">
          <div className="glass p-4 rounded-xl border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-headline font-bold text-sm">ONLINE AGENTS</span>
            </div>
            <div className="text-2xl font-headline font-bold tracking-widest">14,293</div>
          </div>
        </div>
        
        <div className="absolute bottom-10 right-10 hidden xl:flex flex-col gap-4 animate-float" style={{ animationDelay: '1s' }}>
          <div className="glass p-4 rounded-xl border-r-4 border-secondary">
            <div className="flex items-center gap-3 mb-2 justify-end text-right">
              <span className="font-headline font-bold text-sm">ACTIVE MISSIONS</span>
              <Trophy className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-2xl font-headline font-bold tracking-widest text-right">842</div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="relative z-10 bg-background/50 backdrop-blur-3xl">
        <FeaturedCarousel />
        
        {/* Interactive Stats Banner */}
        <section className="py-20 glass border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center gap-4 group">
              <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-3xl font-headline font-bold mb-1">0.1 MS</h4>
                <p className="text-xs text-muted-foreground font-headline tracking-widest uppercase">Response Latency</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="p-4 rounded-2xl bg-secondary/10 group-hover:bg-secondary/20 transition-all">
                <ShieldCheck className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h4 className="text-3xl font-headline font-bold mb-1">AES-256</h4>
                <p className="text-xs text-muted-foreground font-headline tracking-widest uppercase">Encryption Layer</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-3xl font-headline font-bold mb-1">2.5 M+</h4>
                <p className="text-xs text-muted-foreground font-headline tracking-widest uppercase">Global Users</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="p-4 rounded-2xl bg-secondary/10 group-hover:bg-secondary/20 transition-all">
                <Trophy className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h4 className="text-3xl font-headline font-bold mb-1">$200 M</h4>
                <p className="text-xs text-muted-foreground font-headline tracking-widest uppercase">Monthly Rewards</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Reviews Section Placeholder */}
        <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-headline text-sm font-bold tracking-widest uppercase mb-4 block">Community Echoes</span>
              <h2 className="font-headline text-5xl font-bold mb-8 leading-tight">
                TRUSTED BY <br />
                <span className="text-secondary neon-text">LEGENDS.</span>
              </h2>
              <p className="text-muted-foreground font-body text-lg mb-10 leading-relaxed">
                Join thousands of players who have found their new digital home. Our community reviews are verified via neural signatures to ensure absolute authenticity.
              </p>
              <div className="flex flex-col gap-8">
                <div className="glass p-6 rounded-2xl border-l-4 border-primary">
                  <p className="font-body text-foreground/90 italic mb-4">
                    "The integration is seamless. I've never experienced a gaming portal that feels this intuitive and futuristic."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20" />
                    <div>
                      <h5 className="font-headline font-bold text-sm">X-GHOST-2077</h5>
                      <p className="text-xs text-muted-foreground">Pro Player</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square">
               {/* Decorative Rating Meter */}
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-64 h-64 rounded-full border-[20px] border-white/5 relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[20px] border-primary border-t-transparent border-r-transparent animate-spin duration-3000" />
                    <div className="text-center">
                      <span className="text-7xl font-headline font-bold">9.8</span>
                      <p className="text-xs text-muted-foreground font-headline font-bold tracking-widest">AVG SCORE</p>
                    </div>
                 </div>
               </div>
               {/* Small floating circles */}
               <div className="absolute top-10 right-10 w-20 h-20 glass rounded-full flex items-center justify-center animate-bounce">
                 <span className="font-headline font-bold text-secondary">A+</span>
               </div>
               <div className="absolute bottom-20 left-10 w-16 h-16 glass rounded-full flex items-center justify-center animate-pulse">
                 <span className="font-headline font-bold text-primary">S</span>
               </div>
            </div>
          </div>
        </section>

        <TrendingNews />
      </main>

      <Footer />
    </div>
  );
}
