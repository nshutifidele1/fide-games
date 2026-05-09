"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GameCard } from "./game-card";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export function FeaturedCarousel() {
  const firestore = useFirestore();
  const gamesRef = firestore ? query(collection(firestore, "games"), orderBy("createdAt", "desc"), limit(10)) : null;
  const { data: games, loading } = useCollection(gamesRef);

  return (
    <section id="games" className="py-24 px-6 overflow-hidden bg-gradient-to-b from-transparent to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-headline text-4xl font-bold tracking-tight">
            FEATURED <span className="text-primary neon-text">TITLES</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : games && games.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: games.length > 4,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {games.map((game: any, i) => (
                <CarouselItem key={game.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <GameCard
                    title={game.title}
                    image={game.coverUrl}
                    rating={4.8} // Default rating for featured titles
                    genre={game.category}
                    imageHint="gaming wallpaper"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden lg:flex gap-2 justify-end mt-8 mr-4">
              <CarouselPrevious className="static translate-y-0 border-white/10 hover:border-primary/50 glass h-12 w-12" />
              <CarouselNext className="static translate-y-0 border-white/10 hover:border-primary/50 glass h-12 w-12" />
            </div>
          </Carousel>
        ) : (
          <div className="text-center py-20 glass rounded-3xl border border-white/5">
            <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest">
              The Nexus repository is currently empty.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
