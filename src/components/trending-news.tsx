"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NEWS_ITEMS = [
  {
    title: "Project Zero: New Gameplay Leak Revealed",
    category: "EXCLUSIVE",
    date: "2H AGO",
    image: "https://picsum.photos/seed/leak/800/450",
    imageHint: "gaming setup neon"
  },
  {
    title: "Global Esports Masters Prize Pool Hits $50M",
    category: "ESPORTS",
    date: "5H AGO",
    image: "https://picsum.photos/seed/esports/800/450",
    imageHint: "esports crowd"
  },
  {
    title: "Neural Link VR: The Future of Immersion",
    category: "HARDWARE",
    date: "1D AGO",
    image: "https://picsum.photos/seed/vr-news/800/450",
    imageHint: "cyberpunk goggles"
  }
];

export function TrendingNews() {
  return (
    <section id="news" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h2 className="font-headline text-5xl font-bold leading-none mb-4 tracking-tighter">
            THE <span className="text-secondary neon-text">LATEST</span> FEED
          </h2>
          <p className="text-muted-foreground font-body">Real-time updates from the digital frontlines.</p>
        </div>
        <Button variant="link" className="text-primary font-headline font-bold text-lg group">
          VIEW ALL NEWS
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {NEWS_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 neon-blue-glow group-hover:neon-border transition-all duration-500">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                data-ai-hint={item.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                <span className="text-[10px] font-headline font-bold px-2 py-0.5 rounded bg-secondary text-white">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3 font-headline">
              <Clock className="w-3 h-3" />
              {item.date}
            </div>
            
            <h3 className="font-headline text-2xl font-bold leading-tight group-hover:text-secondary transition-colors duration-300 mb-6">
              {item.title}
            </h3>

            <Button variant="outline" className="border-white/10 glass text-xs font-headline font-bold h-9 hover:border-secondary hover:text-secondary px-6">
              READ REPORT
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
