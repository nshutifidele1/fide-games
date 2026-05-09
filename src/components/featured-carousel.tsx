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
import { PlaceHolderImages } from "@/lib/placeholder-images";

const FEATURED_GAMES = [
  { title: "NEON PROTOCOL", rating: 4.9, genre: "RPG", image: "https://picsum.photos/seed/neon-1/600/800", hint: "cyberpunk city" },
  { title: "AETHER STRIKE", rating: 4.8, genre: "ACTION", image: "https://picsum.photos/seed/aether/600/800", hint: "sci-fi combat" },
  { title: "VOID CHASE", rating: 4.7, genre: "RACING", image: "https://picsum.photos/seed/void/600/800", hint: "futuristic car" },
  { title: "TITAN ECHO", rating: 4.6, genre: "STRATEGY", image: "https://picsum.photos/seed/titan/600/800", hint: "giant mech" },
  { title: "QUANTUM SOUL", rating: 4.9, genre: "ADVENTURE", image: "https://picsum.photos/seed/quantum/600/800", hint: "neon forest" },
];

export function FeaturedCarousel() {
  return (
    <section id="games" className="py-24 px-6 overflow-hidden bg-gradient-to-b from-transparent to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-headline text-4xl font-bold tracking-tight">
            FEATURED <span className="text-primary neon-text">TITLES</span>
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {FEATURED_GAMES.map((game, i) => (
              <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <GameCard
                  title={game.title}
                  image={game.image}
                  rating={game.rating}
                  genre={game.genre}
                  imageHint={game.hint}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden lg:flex gap-2 justify-end mt-8 mr-4">
            <CarouselPrevious className="static translate-y-0 border-white/10 hover:border-primary/50 glass h-12 w-12" />
            <CarouselNext className="static translate-y-0 border-white/10 hover:border-primary/50 glass h-12 w-12" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
