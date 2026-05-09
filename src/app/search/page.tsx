
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { GameCard } from "@/components/game-card";
import { Search as SearchIcon, Filter, LayoutGrid, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchPage() {
  const [queryTerm, setQueryTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const firestore = useFirestore();

  const gamesRef = firestore ? query(collection(firestore, "games"), orderBy("createdAt", "desc")) : null;
  const { data: games, loading } = useCollection(gamesRef);

  const categoriesRef = firestore ? query(collection(firestore, "categories"), orderBy("name", "asc")) : null;
  const { data: categories } = useCollection(categoriesRef);

  const filteredGames = games?.filter(game => {
    const matchesQuery = game.title.toLowerCase().includes(queryTerm.toLowerCase()) || 
                         game.category.toLowerCase().includes(queryTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || game.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter">
              Repository <span className="text-primary neon-text">Scan</span>
            </h1>
            <p className="text-muted-foreground text-lg font-body max-w-2xl">
              Access the complete Fide Games database. Filter by neural classification or search for specific mission assets.
            </p>
          </motion.div>
        </header>

        {/* Search Controls */}
        <section className="glass p-8 rounded-[2rem] border-white/5 mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input 
              placeholder="Search by title or genre..." 
              className="h-14 bg-white/5 border-primary/20 rounded-2xl px-12 focus-visible:ring-primary text-white font-bold"
              value={queryTerm}
              onChange={(e) => setQueryTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-14 w-full md:w-64 bg-white/5 border-primary/20 rounded-2xl px-6 focus:ring-primary font-bold">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="glass border-primary/20">
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shrink-0">
              <LayoutGrid className="w-6 h-6 text-primary" />
            </div>
          </div>
        </section>

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="font-headline font-bold uppercase tracking-widest text-primary animate-pulse">Syncing with Central Registry...</p>
          </div>
        ) : filteredGames && filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredGames.map((game: any, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
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
          <div className="text-center py-32 glass rounded-3xl border border-white/5">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-10 h-10 text-primary opacity-50" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-2 uppercase tracking-widest">No Assets Detected</h3>
            <p className="text-muted-foreground font-body">Your search parameters did not yield any results from the Nexus repository.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
