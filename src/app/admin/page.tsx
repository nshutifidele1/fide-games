
"use client";

import React, { useState } from "react";
import { 
  Search, 
  Bell, 
  MoreVertical, 
  Download, 
  Plus, 
  Gamepad, 
  Settings, 
  Users, 
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Upload,
  Database,
  Trash2
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
import { useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddingGame, setIsAddingGame] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  // New Game Form State
  const [newGame, setNewGame] = useState({
    title: "",
    coverUrl: "",
    downloadUrl: "",
    category: "Action"
  });

  const gamesRef = firestore ? collection(firestore, "games") : null;
  const { data: games, loading: gamesLoading } = useCollection(gamesRef);

  const handleAddGame = async () => {
    if (!firestore) return;
    if (!newGame.title || !newGame.coverUrl || !newGame.downloadUrl) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(firestore, "games"), {
        ...newGame,
        createdAt: serverTimestamp()
      });
      toast({ title: "Success", description: "Game added to the database." });
      setNewGame({ title: "", coverUrl: "", downloadUrl: "", category: "Action" });
      setIsAddingGame(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, "games", gameId));
      toast({ title: "Deleted", description: "Game removed from database." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fa] font-body text-[#333]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e2532] text-white flex flex-col shrink-0">
        <div className="p-6">
          <div className="bg-[#4d86ff] rounded-xl p-3 flex items-center justify-center gap-2 mb-8">
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-headline font-bold text-xl tracking-tight italic">FIDE ADMIN</span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-[#4d86ff] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-[#4d86ff] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">User Management</span>
            </button>
            <button 
              onClick={() => setActiveTab("games")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'games' ? 'bg-[#4d86ff] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Gamepad className="w-5 h-5" />
              <span className="text-sm font-medium">Game Database</span>
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[#4d86ff] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10">
          <div className="flex items-center gap-4 text-gray-400">
            <Badge variant="outline" className="text-[#4d86ff] border-[#4d86ff]/30">System Status: Optimal</Badge>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <Avatar className="w-10 h-10 ring-2 ring-gray-50">
                <AvatarImage src="https://picsum.photos/seed/admin-p/100/100" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-bold">Fide Admin</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Super Agent</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              
              {/* Dashboard Content */}
              <TabsContent value="dashboard" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-headline font-bold text-[#1e2532] mb-2">Nexus Overview</h1>
                  <p className="text-gray-400 text-sm">Real-time platform performance and statistics.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Total Users</p>
                    <h3 className="text-4xl font-headline font-bold">142,932</h3>
                    <div className="mt-4 flex items-center gap-2 text-green-500 text-sm font-bold">
                      <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
                      +12% vs last month
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Active Games</p>
                    <h3 className="text-4xl font-headline font-bold">{games?.length || 0}</h3>
                    <div className="mt-4 flex items-center gap-2 text-[#4d86ff] text-sm font-bold">
                      <Database className="w-4 h-4" />
                      Live in Nexus
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Monthly Downloads</p>
                    <h3 className="text-4xl font-headline font-bold">84,201</h3>
                    <div className="mt-4 flex items-center gap-2 text-green-500 text-sm font-bold">
                      <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
                      +5.4% growth
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Users Content */}
              <TabsContent value="users" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-headline font-bold text-[#1e2532] mb-2">User Registry</h1>
                  <p className="text-gray-400 text-sm">Manage platform agents and access permissions.</p>
                </div>
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-8">
                   <div className="flex justify-between items-center mb-8">
                      <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search users by email or ID..." className="pl-10 h-12 rounded-xl" />
                      </div>
                      <Button className="bg-[#4d86ff] rounded-xl h-12 px-6 gap-2">
                        <Plus className="w-4 h-4" /> Add User
                      </Button>
                   </div>
                   <Table>
                      <TableHeader className="bg-[#f8faff]">
                        <TableRow className="border-none">
                          <TableHead className="font-bold py-6 px-4">User</TableHead>
                          <TableHead className="font-bold py-6 px-4">Status</TableHead>
                          <TableHead className="font-bold py-6 px-4">Role</TableHead>
                          <TableHead className="font-bold py-6 px-4">Joined</TableHead>
                          <TableHead className="font-bold py-6 px-4 text-center">Operate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3].map((i) => (
                          <TableRow key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <TableCell className="py-6 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={`https://picsum.photos/seed/user-${i}/100/100`} />
                                </Avatar>
                                <div>
                                  <p className="font-bold text-sm">Agent_{i}</p>
                                  <p className="text-xs text-muted-foreground">agent{i}@fide.com</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-6 px-4">
                              <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-none shadow-none">Online</Badge>
                            </TableCell>
                            <TableCell className="py-6 px-4 font-medium text-sm">Pro Member</TableCell>
                            <TableCell className="py-6 px-4 text-gray-500 text-sm">2024.01.{i+10}</TableCell>
                            <TableCell className="py-6 px-4 text-center">
                              <Button variant="ghost" size="sm" className="text-[#4d86ff] hover:bg-[#4d86ff]/5">View Nexus</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                   </Table>
                </div>
              </TabsContent>

              {/* Games Content */}
              <TabsContent value="games" className="space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-headline font-bold text-[#1e2532] mb-2">Game Database</h1>
                    <p className="text-gray-400 text-sm">Upload and manage titles available in the Nexus.</p>
                  </div>
                  
                  <Dialog open={isAddingGame} onOpenChange={setIsAddingGame}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#4d86ff] hover:bg-[#3b71e0] h-12 px-6 rounded-xl font-bold flex gap-2">
                        <Upload className="w-4 h-4" />
                        Upload New Game
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl font-bold">New Mission Payload</DialogTitle>
                        <DialogDescription>
                          Add a new game title to the FIDE platform. Fill in all neural parameters.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Game Title</Label>
                          <Input 
                            id="title" 
                            className="rounded-xl h-12" 
                            placeholder="e.g. Neon Protocol" 
                            value={newGame.title}
                            onChange={(e) => setNewGame({...newGame, title: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cover" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cover Photo URL</Label>
                          <Input 
                            id="cover" 
                            className="rounded-xl h-12" 
                            placeholder="https://images.unsplash.com/..." 
                            value={newGame.coverUrl}
                            onChange={(e) => setNewGame({...newGame, coverUrl: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="download" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Download URL</Label>
                          <Input 
                            id="download" 
                            className="rounded-xl h-12" 
                            placeholder="https://nexus-storage.fide.com/..." 
                            value={newGame.downloadUrl}
                            onChange={(e) => setNewGame({...newGame, downloadUrl: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                          <Select value={newGame.category} onValueChange={(v) => setNewGame({...newGame, category: v})}>
                            <SelectTrigger className="rounded-xl h-12">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Action">Action</SelectItem>
                              <SelectItem value="RPG">RPG</SelectItem>
                              <SelectItem value="Strategy">Strategy</SelectItem>
                              <SelectItem value="Adventure">Adventure</SelectItem>
                              <SelectItem value="Racing">Racing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingGame(false)} className="rounded-xl h-12 border-gray-200">Cancel</Button>
                        <Button onClick={handleAddGame} className="bg-[#4d86ff] hover:bg-[#3b71e0] rounded-xl h-12 px-8 font-bold">Initialize Upload</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-8">
                  {gamesLoading ? (
                    <div className="py-20 text-center text-muted-foreground animate-pulse font-headline uppercase tracking-widest">Scanning Database...</div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-[#f8faff]">
                        <TableRow className="border-none">
                          <TableHead className="font-bold py-6 px-4">Game Title</TableHead>
                          <TableHead className="font-bold py-6 px-4">Category</TableHead>
                          <TableHead className="font-bold py-6 px-4">Status</TableHead>
                          <TableHead className="font-bold py-6 px-4 text-center">Operate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {games?.map((game: any) => (
                          <TableRow key={game.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <TableCell className="py-6 px-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
                                </div>
                                <p className="font-bold text-sm">{game.title}</p>
                              </div>
                            </TableCell>
                            <TableCell className="py-6 px-4">
                              <Badge variant="outline" className="rounded-full px-4 border-[#4d86ff]/20 text-[#4d86ff]">{game.category}</Badge>
                            </TableCell>
                            <TableCell className="py-6 px-4">
                              <span className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Live
                              </span>
                            </TableCell>
                            <TableCell className="py-6 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <Button size="sm" variant="outline" className="rounded-lg border-[#4d86ff] text-[#4d86ff] hover:bg-[#4d86ff] hover:text-white transition-all h-8 text-xs font-bold px-4">Edit</Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteGame(game.id)} className="rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 h-8 text-xs font-bold px-4">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!games || games.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={4} className="py-20 text-center text-muted-foreground">No games found in the Nexus database.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>

              {/* Settings Content */}
              <TabsContent value="settings" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-headline font-bold text-[#1e2532] mb-2">Nexus Settings</h1>
                  <p className="text-gray-400 text-sm">System configuration and security protocols.</p>
                </div>
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10 max-w-2xl">
                   <div className="space-y-8">
                      <div className="grid gap-4">
                        <Label className="text-sm font-bold uppercase tracking-widest">Platform Name</Label>
                        <Input defaultValue="FIDE GAMES" className="h-12 rounded-xl" />
                      </div>
                      <div className="grid gap-4">
                        <Label className="text-sm font-bold uppercase tracking-widest">Admin Email</Label>
                        <Input defaultValue="nshutifidele1@gmail.com" className="h-12 rounded-xl" />
                      </div>
                      <div className="grid gap-4">
                        <Label className="text-sm font-bold uppercase tracking-widest">Security Layer</Label>
                        <Select defaultValue="max">
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Protection</SelectItem>
                            <SelectItem value="max">Maximum Neural Encryption</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="bg-[#4d86ff] w-full h-12 rounded-xl font-bold text-lg">Update Core Settings</Button>
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
