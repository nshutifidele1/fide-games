
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Lock, Gamepad2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const illust = PlaceHolderImages.find((img) => img.id === "auth-illust");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Back to Home */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors group z-20"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-headline text-sm font-bold uppercase tracking-widest">Return Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card w-full max-w-5xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Left Section: Form */}
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center relative">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-5xl font-headline font-bold mb-2 tracking-tight text-[#d499ff]">
                {isLogin ? "Sign In" : "Sign Up"}
              </h1>
              <p className="text-white/40 text-sm font-body tracking-wide">
                Join the FIDE digital sanctuary
              </p>
            </div>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="space-y-2 relative group">
                  <Label className="text-xs uppercase tracking-widest text-white/60 font-headline font-bold">User name</Label>
                  <div className="relative">
                    <Input 
                      placeholder="Cipher-01" 
                      className="input-auth pr-10" 
                    />
                    <User className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
              )}

              <div className="space-y-2 relative group">
                <Label className="text-xs uppercase tracking-widest text-white/60 font-headline font-bold">Email</Label>
                <div className="relative">
                  <Input 
                    type="email"
                    placeholder="nexus@fide.com" 
                    className="input-auth pr-10" 
                  />
                  <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2 relative group">
                <Label className="text-xs uppercase tracking-widest text-white/60 font-headline font-bold">Password</Label>
                <div className="relative">
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    className="input-auth pr-10" 
                  />
                  <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="pt-6">
                <Button className="w-full h-14 rounded-full bg-gradient-to-r from-[#6e45e2] to-[#88d3ce] text-white font-headline font-bold text-lg hover:shadow-[0_0_30px_rgba(110,69,226,0.4)] transition-all duration-300">
                  {isLogin ? "Enter Nexus" : "Sign Up"}
                </Button>
              </div>
            </form>

            <div className="mt-10 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/40 hover:text-white text-sm font-headline tracking-widest transition-colors uppercase font-bold"
              >
                {isLogin ? "Need an Account?" : "Already Have Account?"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Illustration */}
        <div className="hidden md:flex flex-1 p-6 lg:p-8">
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#0a0a1a] flex items-center justify-center">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/20 blur-3xl rounded-full" />
            
            <Image
              src={illust?.imageUrl || "https://picsum.photos/seed/purple-plant/800/800"}
              alt="Artistic Illustration"
              fill
              className="object-cover opacity-80"
              data-ai-hint="glowing plant"
            />
            
            {/* Subtle Overlay Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            
            {/* Logo Overlay */}
            <div className="absolute bottom-8 left-8 flex items-center gap-3 glass p-3 px-5 rounded-2xl">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="font-headline font-bold text-lg tracking-tight">FIDE GAMES</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Decorative Circles */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}
