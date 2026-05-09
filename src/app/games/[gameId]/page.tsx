
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Key, ArrowLeft, Play, ShieldCheck, Trophy, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export default function GameDetailsPage() {
  const { gameId } = useParams();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const gameRef = firestore && gameId ? doc(firestore, "games", gameId as string) : null;
  const { data: game, loading, error } = useDoc(gameRef);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-headline text-primary font-bold tracking-widest uppercase">Initializing Nexus Protocol...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-6 p-6 text-center">
        <h1 className="text-4xl font-headline font-bold text-white uppercase">Protocol Error</h1>
        <p className="text-muted-foreground max-w-md">The requested game file could not be retrieved from the central repository.</p>
        <Button onClick={() => router.push("/")} className="bg-primary px-8 rounded-xl font-bold">Return to Nexus</Button>
      </div>
    );
  }

  const handleDownload = () => {
    if (game.downloadUrl) {
      window.open(game.downloadUrl, "_blank", "noopener,noreferrer");
      toast({ title: "Asset Retrieval", description: "Downloading payload from secure servers." });
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(game.trailerUrl);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-headline font-bold text-sm uppercase tracking-widest">Back to Nexus</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Trailer + Title) */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl bg-black"
            >
              {embedUrl ? (
                <iframe
                  src={`${embedUrl}?autoplay=0&mute=0`}
                  title={`${game.title} Trailer`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : game.trailerUrl ? (
                <video 
                  src={game.trailerUrl} 
                  controls 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-12 text-center bg-gradient-to-b from-white/5 to-transparent">
                  <Play className="w-16 h-16 mb-6 opacity-20" />
                  <p className="font-headline font-bold uppercase tracking-widest">No Visual Intel Available</p>
                </div>
              )}
            </motion.div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <Badge className="bg-primary/20 text-primary border-primary/30 font-headline mb-4 uppercase tracking-widest px-4 py-1">
                  {game.category}
                </Badge>
                <h1 className="text-5xl md:text-6xl font-headline font-bold text-white tracking-tighter uppercase">{game.title}</h1>
              </div>
              
              <div className="flex items-center gap-3 glass p-4 rounded-2xl border-white/5">
                <ShieldCheck className="w-6 h-6 text-green-500" />
                <div className="text-xs">
                  <p className="font-bold text-white">VERIFIED ASSET</p>
                  <p className="text-muted-foreground">Neutral Signature Secure</p>
                </div>
              </div>
            </div>

            <div className="glass p-10 rounded-3xl border-white/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Info className="w-5 h-5 text-primary" />
                Mission Intel
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Experience the high-fidelity world of {game.title}. This verified asset has been deployed to the Fide platform for authorized agents. Ensure your system meets the minimum neural requirements before initiation.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Release</p>
                  <p className="font-bold text-white">2025-02</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Rating</p>
                  <p className="font-bold text-white">S-Class</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Size</p>
                  <p className="font-bold text-white">~42.4 GB</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Developer</p>
                  <p className="font-bold text-primary">Nexus Studio</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Actions) */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-3xl border-white/5 space-y-6 sticky top-32"
            >
              <div className="w-full aspect-square relative rounded-2xl overflow-hidden mb-4 border border-white/10">
                <Image src={game.coverUrl} alt={game.title} fill className="object-cover" />
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleDownload}
                  className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-headline font-bold text-xl shadow-[0_20px_40px_rgba(var(--primary),0.2)] flex gap-4"
                >
                  <Download className="w-6 h-6" />
                  INITIATE DOWNLOAD
                </Button>

                <div className="relative">
                  <Button 
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-full h-16 rounded-2xl border-white/10 glass hover:border-primary/50 text-foreground font-headline font-bold flex gap-4"
                  >
                    <Key className="w-6 h-6 text-primary" />
                    {showPassword ? "HIDE DECRYPTION KEY" : "SHOW ZIP PASSWORD"}
                  </Button>

                  <AnimatePresence>
                    {showPassword && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-6 bg-primary/10 border border-primary/30 rounded-2xl text-center relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                        <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2 relative z-10">Neural Decryption Key</p>
                        <p className="text-2xl font-headline font-bold text-white tracking-[0.3em] relative z-10">
                          {game.zipPassword || "NO KEY REQUIRED"}
                        </p>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(game.zipPassword || "");
                            toast({ title: "Copied", description: "Decryption key stored in memory." });
                          }}
                          className="mt-4 text-[10px] font-bold text-primary hover:underline relative z-10"
                        >
                          COPY TO MEMORY
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Nexus Achievements
                  </span>
                  <span className="font-bold text-white">42 Active</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    className="bg-primary h-full shadow-[0_0_10px_var(--primary)]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
