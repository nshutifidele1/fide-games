
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
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const illust = PlaceHolderImages.find((img) => img.id === "auth-illust");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth || !firestore) return;
    
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Authentication Successful", description: "Identity verified. Entering the Nexus." });
        
        // Admin redirect logic
        if (email === "nshutifidele1@gmail.com") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: username });
        
        // Create user profile in Firestore
        setDoc(doc(firestore, "users", user.uid), {
          displayName: username || "New Agent",
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
          status: "online",
        }, { merge: true });

        toast({ title: "Registration Complete", description: "Your digital signature has been recorded." });
        router.push("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message || "Protocol failure. Please verify your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0C10]">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors group z-20"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-headline text-sm font-bold uppercase tracking-widest text-primary">Nexus Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row min-h-[700px] shadow-[0_0_100px_rgba(77,134,255,0.1)] border border-white/5 bg-[#14161B]"
      >
        <div className="flex-1 p-12 lg:p-20 flex flex-col justify-center relative bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12 text-center md:text-left">
              <h1 className="text-6xl font-headline font-bold mb-4 tracking-tighter text-white">
                {isLogin ? "Authenticate" : "Register"}
              </h1>
              <p className="text-[#808191] text-lg font-body font-medium">
                Enter your neural credentials to access the FIDE sanctuary.
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-3 relative group">
                  <Label className="text-xs uppercase tracking-[0.2em] text-[#808191] font-headline font-bold">Agent Handle</Label>
                  <div className="relative">
                    <Input 
                      placeholder="Cipher-01" 
                      className="h-14 bg-white/5 border-none rounded-2xl px-6 focus-visible:ring-1 focus-visible:ring-[#4D86FF] transition-all" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={!isLogin}
                    />
                    <User className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808191]" />
                  </div>
                </div>
              )}

              <div className="space-y-3 relative group">
                <Label className="text-xs uppercase tracking-[0.2em] text-[#808191] font-headline font-bold">Protocol Email</Label>
                <div className="relative">
                  <Input 
                    type="email"
                    placeholder="nexus@fide.com" 
                    className="h-14 bg-white/5 border-none rounded-2xl px-6 focus-visible:ring-1 focus-visible:ring-[#4D86FF] transition-all" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808191]" />
                </div>
              </div>

              <div className="space-y-3 relative group">
                <Label className="text-xs uppercase tracking-[0.2em] text-[#808191] font-headline font-bold">Neural Key</Label>
                <div className="relative">
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    className="h-14 bg-white/5 border-none rounded-2xl px-6 focus-visible:ring-1 focus-visible:ring-[#4D86FF] transition-all" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808191]" />
                </div>
              </div>

              <div className="pt-8">
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl bg-[#4D86FF] hover:bg-[#3B71E0] text-white font-headline font-bold text-xl transition-all duration-300 shadow-[0_20px_40px_rgba(77,134,255,0.2)]"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? "Confirm Identity" : "Establish Link")}
                </Button>
              </div>
            </form>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#808191] hover:text-white text-sm font-headline tracking-widest transition-colors uppercase font-bold"
              >
                {isLogin ? "Request new credentials?" : "Existing agent?"}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-1 p-0 relative overflow-hidden">
          <Image
            src={illust?.imageUrl || "https://picsum.photos/seed/neon-vr-child/800/800"}
            alt="Artistic Illustration"
            fill
            className="object-cover"
            priority
            data-ai-hint="neon child vr"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#14161B]" />
          <div className="absolute bottom-12 left-12 flex items-center gap-4 bg-white/5 backdrop-blur-xl p-5 px-8 rounded-[2rem] border border-white/10">
            <div className="w-12 h-12 bg-[#4D86FF] rounded-2xl flex items-center justify-center">
               <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-headline font-bold text-2xl tracking-tighter text-white">FIDE GAMES</p>
              <p className="text-[10px] uppercase tracking-widest text-[#4D86FF] font-bold">Platform Admin Gateway</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
