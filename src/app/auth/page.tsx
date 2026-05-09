"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Lock, Gamepad2, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const illust = PlaceHolderImages.find((img) => img.id === "auth-illust");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back!", description: "Successfully entered the nexus." });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        toast({ title: "Welcome agent!", description: "Your digital sanctuary is ready." });
      }
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message || "Could not authenticate. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
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
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center relative bg-background/40 backdrop-blur-md">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-5xl font-headline font-bold mb-2 tracking-tight text-primary">
                {isLogin ? "Sign In" : "Sign Up"}
              </h1>
              <p className="text-white/40 text-sm font-body tracking-wide">
                Join the FIDE digital sanctuary
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2 relative group">
                  <Label className="text-xs uppercase tracking-widest text-white/60 font-headline font-bold">User name</Label>
                  <div className="relative">
                    <Input 
                      placeholder="Cipher-01" 
                      className="input-auth pr-10" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={!isLogin}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-headline font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? "Enter Nexus" : "Initialize Account")}
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

        <div className="hidden md:flex flex-1 p-0">
          <div className="relative w-full h-full overflow-hidden bg-[#0a0a1a] flex items-center justify-center">
            <Image
              src={illust?.imageUrl || "https://picsum.photos/seed/vr-boy/800/800"}
              alt="Artistic Illustration"
              fill
              className="object-cover opacity-90"
              data-ai-hint="vr headset child"
            />
            
            <div className="absolute bottom-8 left-8 flex items-center gap-3 glass p-3 px-5 rounded-2xl">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="font-headline font-bold text-lg tracking-tight">FIDE GAMES</span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </motion.div>

      <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}
