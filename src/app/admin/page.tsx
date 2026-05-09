
"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Plus, 
  Gamepad, 
  Settings, 
  Users, 
  LayoutDashboard,
  Upload,
  Trash2,
  LogOut,
  Layers,
  ShieldAlert,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useFirestore, useCollection, useAuth, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  // New Game Form State
  const [newGame, setNewGame] = useState({
    title: "",
    coverUrl: "",
    downloadUrl: "",
    category: ""
  });

  // New Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");

  const gamesRef = firestore ? query(collection(firestore, "games"), orderBy("createdAt", "desc")) : null;
  const { data: games, loading: gamesLoading } = useCollection(gamesRef);

  const categoriesRef = firestore ? query(collection(firestore, "categories"), orderBy("name", "asc")) : null;
  const { data: categories, loading: categoriesLoading } = useCollection(categoriesRef);

  const usersRef = firestore ? query(collection(firestore, "users"), orderBy("createdAt", "desc")) : null;
  const { data: registeredUsers, loading: usersLoading } = useCollection(usersRef);

  // Authorization check
  useEffect(() => {
    if (!userLoading && (!user || user.email !== "nshutifidele1@gmail.com")) {
      toast({ 
        title: "Restricted Area", 
        description: "Your credentials do not have administrative clearance for this terminal.",
        variant: "destructive"
      });
      router.push("/auth");
    }
  }, [user, userLoading, router, toast]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#111315] flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-12 h-12 text-[#4D86FF] animate-spin" />
        <p className="font-headline text-white font-bold tracking-widest uppercase">Verifying Clearances...</p>
      </div>
    );
  }

  if (!user || user.email !== "nshutifidele1@gmail.com") {
    return (
      <div className="min-h-screen bg-[#111315] flex items-center justify-center flex-col gap-8 p-6 text-center">
        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-12 h-12 text-destructive" />
        </div>
        <div className="max-w-md">
          <h1 className="text-4xl font-headline font-bold text-white mb-4">ACCESS REJECTED</h1>
          <p className="text-[#808191] font-body mb-8">This terminal is reserved for Super Administrator personnel. Unauthorized access attempts are logged.</p>
          <Button onClick={() => router.push("/auth")} className="bg-[#4D86FF] h-14 px-10 rounded-xl font-bold">Return to Identity Gateway</Button>
        </div>
      </div>
    );
  }

  const handleAddGame = () => {
    if (!firestore) return;
    if (!newGame.title || !newGame.coverUrl || !newGame.downloadUrl || !newGame.category) {
      toast({ title: "Validation Error", description: "All payload parameters must be defined.", variant: "destructive" });
      return;
    }

    addDoc(collection(firestore, "games"), {
      ...newGame,
      createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Success", description: "New title deployed to the Nexus repository." });
      setNewGame({ title: "", coverUrl: "", downloadUrl: "", category: "" });
      setIsAddingGame(false);
    });
  };

  const handleDeleteGame = (gameId: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, "games", gameId)).then(() => {
      toast({ title: "Deleted", description: "Title purged from the repository." });
    });
  };

  const handleAddCategory = () => {
    if (!firestore || !newCategoryName.trim()) return;
    
    addDoc(collection(firestore, "categories"), {
      name: newCategoryName.trim(),
      createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Success", description: "New classification category established." });
      setNewCategoryName("");
      setIsAddingCategory(false);
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, "categories", categoryId)).then(() => {
      toast({ title: "Deleted", description: "Category decommissioned." });
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, "users", userId)).then(() => {
      toast({ title: "Registry Purged", description: "Agent credentials removed from database." });
    });
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/auth");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] font-body text-[#1A1D1F]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#111315] text-[#808191] flex flex-col shrink-0 border-r border-[#272B30]">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-[#4D86FF] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(77,134,255,0.4)]">
              <Gamepad className="w-6 h-6 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-white uppercase italic">Fide Games</span>
          </div>

          <nav className="space-y-2">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "users", icon: Users, label: "User Registry" },
              { id: "games", icon: Gamepad, label: "Games Repository" },
              { id: "categories", icon: Layers, label: "Categories" },
              { id: "settings", icon: Settings, label: "Fide Games Settings" },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-[#4D86FF] text-white shadow-[0_10px_20px_rgba(77,134,255,0.2)]' : 'hover:text-white hover:bg-[#272B30]'}`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : ''}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-[#272B30]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-[#FF6A55] hover:bg-[#FF6A55]/10 transition-colors font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-[96px] bg-white border-b border-[#EFEFEF] flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
             <h2 className="text-2xl font-bold font-headline uppercase tracking-tight">Platform Control Center</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808191]" />
              <Input placeholder="Registry Scan..." className="pl-11 w-80 h-12 bg-[#F4F4F4] border-none rounded-xl focus-visible:ring-1 focus-visible:ring-[#4D86FF]" />
            </div>
            <button className="relative p-3 rounded-xl bg-[#F4F4F4] text-[#1A1D1F] hover:bg-[#EFEFEF] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6A55] rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-[#EFEFEF]">
              <div className="text-right">
                <p className="text-sm font-bold">Admin Fide</p>
                <p className="text-[11px] text-[#4D86FF] font-bold uppercase tracking-widest">Super Administrator</p>
              </div>
              <Avatar className="w-12 h-12 rounded-xl border-2 border-[#4D86FF]/20">
                <AvatarImage src="https://picsum.photos/seed/admin-x/100/100" />
                <AvatarFallback>AF</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              
              <TabsContent value="dashboard" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#EFEFEF]">
                    <div className="w-12 h-12 bg-[#EAF2FF] rounded-2xl flex items-center justify-center mb-6">
                      <Users className="w-6 h-6 text-[#4D86FF]" />
                    </div>
                    <p className="text-sm font-bold text-[#808191] mb-2">Total Verified Agents</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-4xl font-headline font-bold">{registeredUsers?.length || 0}</h3>
                      <span className="text-green-500 font-bold text-sm mb-1">Registered</span>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#EFEFEF]">
                    <div className="w-12 h-12 bg-[#FFF4E5] rounded-2xl flex items-center justify-center mb-6">
                      <Gamepad className="w-6 h-6 text-[#FF9F1C]" />
                    </div>
                    <p className="text-sm font-bold text-[#808191] mb-2">Live Nexus Titles</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-4xl font-headline font-bold">{games?.length || 0}</h3>
                      <span className="text-[#4D86FF] font-bold text-sm mb-1">Active</span>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#EFEFEF]">
                    <div className="w-12 h-12 bg-[#E5F9F1] rounded-2xl flex items-center justify-center mb-6">
                      <Layers className="w-6 h-6 text-[#38CB89]" />
                    </div>
                    <p className="text-sm font-bold text-[#808191] mb-2">Operational Categories</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-4xl font-headline font-bold">{categories?.length || 0}</h3>
                      <span className="text-green-500 font-bold text-sm mb-1">Online</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] p-8">
                  <h3 className="text-xl font-bold mb-6">Platform Activity Matrix</h3>
                  <div className="h-64 flex items-center justify-center text-[#808191] italic bg-[#F4F4F4] rounded-2xl">
                    [ Activity Analytics Layer - Initializing... ]
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-headline font-bold">User Registry</h1>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] overflow-hidden">
                  <Table>
                      <TableHeader className="bg-white">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Agent Identity</TableHead>
                          <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Role</TableHead>
                          <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Joined</TableHead>
                          <TableHead className="font-bold py-6 px-8 text-center text-[#808191] uppercase text-[11px] tracking-widest">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersLoading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="py-20 text-center text-[#808191] italic animate-pulse">Accessing Secure Registry...</TableCell>
                          </TableRow>
                        ) : registeredUsers?.map((regUser: any) => (
                          <TableRow key={regUser.id} className="hover:bg-[#F4F4F4]/50 border-b border-[#F4F4F4]">
                            <TableCell className="py-6 px-8">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-10 h-10 rounded-xl">
                                  <AvatarImage src={`https://picsum.photos/seed/${regUser.id}/100/100`} />
                                  <AvatarFallback>{regUser.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-sm">{regUser.displayName}</p>
                                  <p className="text-xs text-[#808191]">{regUser.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-6 px-8">
                              <Badge className={regUser.role === 'admin' ? "bg-[#4D86FF]/10 text-[#4D86FF] border-none shadow-none rounded-lg px-3 py-1 font-bold" : "bg-muted text-muted-foreground border-none shadow-none rounded-lg px-3 py-1 font-bold"}>
                                {regUser.role === 'admin' ? 'Super Admin' : 'Agent'}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-6 px-8 text-[#808191] text-sm">
                              {regUser.createdAt?.toDate ? format(regUser.createdAt.toDate(), 'MMM dd, yyyy') : 'Recently'}
                            </TableCell>
                            <TableCell className="py-6 px-8 text-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteUser(regUser.id)}
                                className="text-[#FF6A55] font-bold hover:bg-[#FF6A55]/10 rounded-lg px-3"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!registeredUsers || registeredUsers.length === 0) && !usersLoading && (
                          <TableRow>
                            <TableCell colSpan={4} className="py-20 text-center text-[#808191] font-bold">Registry currently empty. No active agents found.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                   </Table>
                </div>
              </TabsContent>

              <TabsContent value="games" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-headline font-bold">Games Repository</h1>
                  
                  <Dialog open={isAddingGame} onOpenChange={setIsAddingGame}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#4D86FF] hover:bg-[#3B71E0] h-12 px-8 rounded-xl font-bold flex gap-3 shadow-[0_10px_20px_rgba(77,134,255,0.2)]">
                        <Upload className="w-4 h-4" />
                        Deploy New Title
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 border-none bg-white">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="font-headline text-2xl font-bold">New Mission Payload</DialogTitle>
                        <DialogDescription className="text-[#808191] font-bold">
                          Define the parameters for the new game deployment.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Game Title</Label>
                          <Input 
                            id="title" 
                            className="rounded-xl h-12 bg-[#F4F4F4] border-none" 
                            placeholder="e.g. Neon Protocol" 
                            value={newGame.title}
                            onChange={(e) => setNewGame({...newGame, title: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cover" className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Cover Illustration URL</Label>
                          <Input 
                            id="cover" 
                            className="rounded-xl h-12 bg-[#F4F4F4] border-none" 
                            placeholder="https://images.unsplash.com/..." 
                            value={newGame.coverUrl}
                            onChange={(e) => setNewGame({...newGame, coverUrl: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="download" className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Asset Download URL</Label>
                          <Input 
                            id="download" 
                            className="rounded-xl h-12 bg-[#F4F4F4] border-none" 
                            placeholder="https://nexus-storage.fide.com/..." 
                            value={newGame.downloadUrl}
                            onChange={(e) => setNewGame({...newGame, downloadUrl: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Operational Category</Label>
                          <Select value={newGame.category} onValueChange={(v) => setNewGame({...newGame, category: v})}>
                            <SelectTrigger className="rounded-xl h-12 bg-[#F4F4F4] border-none">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {categories?.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                              ))}
                              {(!categories || categories.length === 0) && (
                                <p className="p-2 text-xs text-[#808191] italic">No categories available. Please add them in the Categories tab.</p>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter className="mt-10 gap-3">
                        <Button variant="ghost" onClick={() => setIsAddingGame(false)} className="rounded-xl h-12 px-6 font-bold text-[#808191]">Cancel</Button>
                        <Button onClick={handleAddGame} className="bg-[#4D86FF] hover:bg-[#3B71E0] rounded-xl h-12 px-10 font-bold text-white shadow-[0_10px_20px_rgba(77,134,255,0.2)]">Finalize Upload</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] overflow-hidden">
                  {gamesLoading ? (
                    <div className="py-20 text-center text-[#808191] animate-pulse font-headline font-bold uppercase tracking-widest">Scanning Nexus Database...</div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-white">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Title</TableHead>
                          <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Category</TableHead>
                          <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Deployment</TableHead>
                          <TableHead className="font-bold py-6 px-8 text-center text-[#808191] uppercase text-[11px] tracking-widest">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {games?.map((game: any) => (
                          <TableRow key={game.id} className="hover:bg-[#F4F4F4]/50 border-b border-[#F4F4F4]">
                            <TableCell className="py-6 px-8">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-[#F4F4F4] flex-shrink-0 border border-[#EFEFEF]">
                                  <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
                                </div>
                                <p className="font-bold text-sm">{game.title}</p>
                              </div>
                            </TableCell>
                            <TableCell className="py-6 px-8">
                              <Badge variant="outline" className="rounded-lg px-3 py-1 border-[#4D86FF]/20 text-[#4D86FF] bg-[#4D86FF]/5 font-bold">{game.category}</Badge>
                            </TableCell>
                            <TableCell className="py-6 px-8">
                              <span className="flex items-center gap-2 text-xs font-bold text-[#38CB89] uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-[#38CB89] animate-pulse" />
                                Live
                              </span>
                            </TableCell>
                            <TableCell className="py-6 px-8">
                              <div className="flex items-center justify-center gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteGame(game.id)} className="rounded-lg text-[#FF6A55] hover:bg-[#FF6A55]/10 h-10 px-3">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!games || games.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={4} className="py-20 text-center text-[#808191] font-bold">No active titles found in the Nexus database.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="categories" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-headline font-bold">Operational Categories</h1>
                  <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#4D86FF] hover:bg-[#3B71E0] h-12 px-8 rounded-xl font-bold flex gap-3 shadow-[0_10px_20px_rgba(77,134,255,0.2)]">
                        <Plus className="w-4 h-4" />
                        New Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 border-none bg-white">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="font-headline text-2xl font-bold">New Category</DialogTitle>
                        <DialogDescription className="text-[#808191] font-bold">
                          Add a new classification for the gaming nexus.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="catName" className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Category Name</Label>
                          <Input 
                            id="catName" 
                            className="rounded-xl h-12 bg-[#F4F4F4] border-none" 
                            placeholder="e.g. Cyberpunk" 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-10 gap-3">
                        <Button variant="ghost" onClick={() => setIsAddingCategory(false)} className="rounded-xl h-12 px-6 font-bold text-[#808191]">Cancel</Button>
                        <Button onClick={handleAddCategory} className="bg-[#4D86FF] hover:bg-[#3B71E0] rounded-xl h-12 px-10 font-bold text-white">Create</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] overflow-hidden p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoriesLoading ? (
                      <div className="col-span-full py-20 text-center text-[#808191] animate-pulse">Syncing categories...</div>
                    ) : (
                      categories?.map((cat: any) => (
                        <div key={cat.id} className="p-6 rounded-2xl bg-[#F4F4F4] border border-[#EFEFEF] flex items-center justify-between group hover:border-[#4D86FF] transition-all">
                          <div>
                            <p className="font-bold text-lg">{cat.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#808191] font-bold">Operational</p>
                          </div>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 rounded-lg text-[#FF6A55] opacity-0 group-hover:opacity-100 hover:bg-[#FF6A55]/10 transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))
                    )}
                    {(!categories || categories.length === 0) && !categoriesLoading && (
                      <div className="col-span-full py-20 text-center text-[#808191] font-bold">No categories defined yet.</div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-8">
                <h1 className="text-3xl font-headline font-bold">Nexus Configuration</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] p-10">
                     <div className="space-y-8">
                        <div className="grid gap-4">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Platform Protocol Name</Label>
                          <Input defaultValue="FIDE GAMES NEXUS" className="h-14 rounded-xl bg-[#F4F4F4] border-none" />
                        </div>
                        <div className="grid gap-4">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Primary Administrator</Label>
                          <Input defaultValue="nshutifidele1@gmail.com" className="h-14 rounded-xl bg-[#F4F4F4] border-none" />
                        </div>
                        <div className="grid gap-4">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Neural Encryption Layer</Label>
                          <Select defaultValue="max">
                            <SelectTrigger className="h-14 rounded-xl bg-[#F4F4F4] border-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="standard">Standard Defense</SelectItem>
                              <SelectItem value="max">Maximum Quantum Encryption</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="bg-[#111315] hover:bg-black text-white w-full h-14 rounded-xl font-bold text-lg shadow-lg">Commit Global Changes</Button>
                     </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-[#111315] rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                       <div className="relative z-10">
                         <h4 className="text-2xl font-headline font-bold mb-4">System Status</h4>
                         <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <span className="text-[#808191] font-bold">Uptime</span>
                              <span className="text-[#38CB89] font-bold">99.99%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#808191] font-bold">Memory Pulse</span>
                              <span className="text-white font-bold">2.4 GB / 8 GB</span>
                            </div>
                            <div className="w-full bg-[#272B30] h-2 rounded-full">
                              <div className="bg-[#4D86FF] h-full w-[30%] rounded-full shadow-[0_0_10px_#4D86FF]" />
                            </div>
                         </div>
                       </div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-[#4D86FF]/10 blur-[60px] rounded-full" />
                    </div>
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
