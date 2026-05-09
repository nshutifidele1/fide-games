"use client";

import React, { useState, useEffect } from "react";
import { aiGameDiscovererTool, type AIGameDiscovererToolOutput } from "@/ai/flows/ai-game-discoverer-tool";
import { GameCard } from "./game-card";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIGameDiscovererToolOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRecs() {
    setLoading(true);
    setError(null);
    try {
      const res = await aiGameDiscovererTool({
        browsingHistory: ["Cyberpunk 2077", "Elden Ring"],
        playedGames: [
          { title: "The Witcher 3", rating: 5, playtimeHours: 120 },
          { title: "DOOM Eternal", rating: 4, playtimeHours: 40 }
        ],
        preferredGenres: ["RPG", "Action", "Cyberpunk"],
        dislikedGenres: ["Sport"]
      });
      setRecommendations(res);
    } catch (e: any) {
      console.error("AI recommendation failed", e);
      setError(e.message || "Failed to fetch neural recommendations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-headline text-primary animate-pulse">Consulting the Oracle...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <div className="glass p-12 rounded-3xl border border-destructive/20 max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-6" />
          <h2 className="font-headline text-2xl font-bold mb-4">Neural Link Interrupted</h2>
          <p className="text-muted-foreground mb-8">
            We encountered a protocol error while reaching the AI Oracle. Please ensure your environment credentials (GEMINI_API_KEY) are valid.
          </p>
          <Button onClick={fetchRecs} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            RETRY CONNECTION
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <Sparkles className="text-secondary w-5 h-5" />
            <span className="text-secondary font-headline text-sm font-bold tracking-widest uppercase">
              Neuro-Engine Analysis
            </span>
          </motion.div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold neon-text">
            AI DISCOVERIES
          </h2>
        </div>
        <p className="max-w-md text-muted-foreground text-sm font-body">
          Our advanced neural patterns have analyzed your gameplay signature to find these perfect neural matches.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations?.recommendedGames.map((game, i) => (
          <motion.div
            key={game.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <GameCard
              title={game.title}
              genre={game.genre || "Adventure"}
              rating={4.5 + Math.random() * 0.5}
              image={`https://picsum.photos/seed/${game.title.replace(/\s/g, '')}/600/800`}
              imageHint="gaming wallpaper"
            />
            <p className="mt-4 text-xs font-body text-primary italic px-2">
              " {game.reason} "
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
