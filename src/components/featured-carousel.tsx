
"use client";

import React from "react";
import { GameCard } from "./game-card";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturedCarousel() {
  const firestore = useFirestore();
  // Increased limit for a better grid view
  const gamesRef = firestore ? query(collection(firestore, "games"), orderBy("createdAt", "desc"), limit(24)) : null;
  const { data: games, loading } = useCollection(gamesRef);

  return (
    <section id="games" className="py-24 px-6 overflow-hidden bg-gradient-to-b from-transparent to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight uppercase">
              GAMES <span className="text-primary neon-text">REPOSITORY</span>
            </h2>
            <p className="text-muted-foreground mt-2 font-body">Direct access to the latest mission assets and digital experiences.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-px w-24 bg-primary/20 hidden lg:block" />
             <span className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-primary">Status: Optimal</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="font-headline font-bold text-primary animate-pulse tracking-widest uppercase">Syncing Repository...</p>
          </div>
        ) : games && games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {games.map((game: any, i: number) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: (i % 4) * 0.1 
                }}
              >
                <GameCard
                  id={game.id}
                  title={game.title}
                  image={game.coverUrl}
                  rating={4.8}
                  genre={game.category}
                  imageHint="gaming wallpaper"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 glass rounded-3xl border border-white/5 flex flex-col items-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-primary opacity-20" />
            </div>
            <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest">
              The Nexus repository is currently empty.
            </p>
            <p className="text-xs text-muted-foreground/50 mt-2">Awaiting deployment of new title metadata.</p>
          </div>
        )}
      </div>
    </section>
  );
}
