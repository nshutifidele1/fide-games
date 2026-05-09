"use client";

import React from "react";
import Image from "next/image";
import { Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface GameCardProps {
  title: string;
  image: string;
  rating: number;
  genre: string;
  imageHint: string;
  downloadUrl?: string;
}

export function GameCard({ title, image, rating, genre, imageHint, downloadUrl }: GameCardProps) {
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-[450px] w-full max-w-[320px] rounded-2xl overflow-hidden glass border border-white/5 shadow-2xl"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80"
          data-ai-hint={imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-primary/20 backdrop-blur-md border-primary/50 text-primary-foreground font-headline">
          {genre}
        </Badge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(rating) ? "text-primary fill-primary" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs font-headline ml-1 text-foreground/80">{rating.toFixed(1)}</span>
        </div>
        
        <h3 className="font-headline text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-3 mt-2">
          <Button 
            size="sm" 
            onClick={handleDownload}
            className="bg-primary neon-border hover:neon-blue-glow font-headline font-bold flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            DOWNLOAD
          </Button>
          <Button size="icon" variant="outline" className="border-white/10 glass hover:border-primary/50">
            <Star className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Glow highlight */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />
    </motion.div>
  );
}
