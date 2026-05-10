
"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Eye,
  Lock,
  Video,
  FileArchive,
  Newspaper,
  Image as ImageIcon,
  Activity,
  UserPlus,
  Clock,
  TrendingUp,
  BarChart3,
  Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useFirestore, useCollection, useAuth, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, query, orderBy, limit, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

const chartConfig = {
  signups: {
    label: "New Agents",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [isEditingGame, setIsEditingGame] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingNews, setIsAddingNews] = useState(false);
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
    trailerUrl: "",
    zipPassword: "",
    category: ""
  });

  // Edit Game Form State
  const [editGame, setEditGame] = useState({
    title: "",
    coverUrl: "",
    downloadUrl: "",
    trailerUrl: "",
    zipPassword: "",
    category: ""
  });

  // New Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");

  // New News Form State
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    imageUrl: "",
    category: ""
  });

  const gamesQuery = useMemo(() => firestore ? query(collection(firestore, "games"), orderBy("createdAt", "desc")) : null, [firestore]);
  const { data: games, loading: gamesLoading } = useCollection(gamesQuery);

  const categoriesQuery = useMemo(() => firestore ? query(collection(firestore, "categories"), orderBy("name", "asc")) : null, [firestore]);
  const { data: categories, loading: categoriesLoading } = useCollection(categoriesQuery);

  const usersQuery = useMemo(() => firestore ? query(collection(firestore, "users"), orderBy("createdAt", "desc")) : null, [firestore]);
  const { data: registeredUsers, loading: usersLoading } = useCollection(usersQuery);

  const newsQuery = useMemo(() => firestore ? query(collection(firestore, "news"), orderBy("createdAt", "desc")) : null, [firestore]);
  const { data: newsItems, loading: newsLoading } = useCollection(newsQuery);

  // Analytics Calculation
  const analyticsData = useMemo(() => {
    if (!registeredUsers) return [];
    
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, "MMM"),
        start: startOfMonth(date),
        end: endOfMonth(date),
        count: 0
      };
    }).reverse();

    registeredUsers.forEach((regUser: any) => {
      if (regUser.createdAt?.toDate) {
        const userDate = regUser.createdAt.toDate();
        const monthIndex = last6Months.findIndex(m => 
          isWithinInterval(userDate, { start: m.start, end: m.end })
        );
        if (monthIndex !== -1) {
          last6Months[monthIndex].count++;
        }
      }
    });

    return last6Months.map(m => ({
      month: m.month,
      signups: m.count
    }));
  }, [registeredUsers]);

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
    return null;
  }

  const handleAddGame = () => {
    if (!firestore) return;
    if (!newGame.title || !newGame.coverUrl || !newGame.downloadUrl || !newGame.category) {
      toast({ title: "Validation Error", description: "All mandatory payload parameters must be defined.", variant: "destructive" });
      return;
    }

    addDoc(collection(firestore, "games"), {
      ...newGame,
      createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Success", description: "New title deployed to the Nexus repository." });
      setNewGame({ title: "", coverUrl: "", downloadUrl: "", trailerUrl: "", zipPassword: "", category: "" });
      setIsAddingGame(false);
    });
  };

  const handleEditGameClick = (game: any) => {
    setEditingGameId(game.id);
    setEditGame({
      title: game.title,
      coverUrl: game.coverUrl,
      downloadUrl: game.downloadUrl,
      trailerUrl: game.trailerUrl || "",
      zipPassword: game.zipPassword || "",
      category: game.category
    });
    setIsEditingGame(true);
  };

  const handleUpdateGame = () => {
    if (!firestore || !editingGameId) return;
    if (!editGame.title || !editGame.coverUrl || !editGame.downloadUrl || !editGame.category) {
      toast({ title: "Validation Error", description: "All mandatory payload parameters must be defined.", variant: "destructive" });
      return;
    }

    updateDoc(doc(firestore, "games", editingGameId), {
      ...editGame,
      updatedAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Success", description: "Title metadata updated in the repository." });
      setIsEditingGame(false);
      setEditingGameId(null);
    });
  };

  const handleAddNews = () => {
    if (!firestore) return;
    if (!newNews.title || !newNews.content || !newNews.imageUrl || !newNews.category) {
      toast({ title: "Validation Error", description: "All news payload parameters must be defined.", variant: "destructive" });
      return;
    }

    addDoc(collection(firestore, "news"), {
      ...newNews,
      createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Success", description: "Trending report deployed to the feed." });
      setNewNews({ title: "", content: "", imageUrl: "", category: "" });
      setIsAddingNews(false);
    });
  };

  const handleDeleteGame = (gameId: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, "games", gameId)).then(() => {
      toast({ title: "Deleted", description: "Title purged from the repository." });
    });
  };

  const handleDeleteNews = (newsId: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, "news", newsId)).then(() => {
      toast({ title: "Deleted", description: "Report purged from the feed." });
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

  const inputStyles = "rounded-xl h-12 bg-white border border-[#E2E8F0] focus:border-[#4D86FF] focus:ring-1 focus:ring-[#4D86FF] transition-all text-red-600 font-bold";

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
              { id: "activity", icon: Activity, label: "Activity Feed" },
              { id: "users", icon: Users, label: "User Registry" },
              { id: "games", icon: Gamepad, label: "Games Repository" },
              { id: "categories", icon: Layers, label: "Categories" },
              { id: "news", icon: Newspaper, label: "News Feed" },
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
              <Input placeholder="Registry Scan..." className="pl-11 w-80 h-12 bg-[#F4F4F4] border-none rounded-xl focus-visible:ring-1 focus-visible:ring-[#4D86FF] text-red-600 font-bold" />
            </div>
            <button className="relative p-3 rounded-xl bg-[#F4F4F4] text-[#1A1D1F] hover:bg-[#EFEFEF] transition-colors" onClick={() => setActiveTab("activity")}>
              <Bell className="w-5 h-5" />
              {registeredUsers && registeredUsers.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6A55] rounded-full border-2 border-white animate-pulse" />
              )}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#EFEFEF]">
                    <div className="w-12 h-12 bg-[#EAF2FF] rounded-2xl flex items-center justify-center mb-6">
                      <Users className="w-6 h-6 text-[#4D86FF]" />
                    </div>
                    <p className="text-sm font-bold text-[#808191] mb-2">Verified Agents</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-4xl font-headline font-bold">{registeredUsers?.length || 0}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#EFEFEF]">
                    <div className="w-12 h-12 bg-[#FFF4E5] rounded-2xl flex items-center justify-center mb-6">
                      <Gamepad className="w-6 h-6 text-[#FF9F1C]" />
                    </div>
                    <p className="text-sm font-bold text-[#808191] mb-2">Live Titles</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-4xl font-headline font-bold">{games?.length || 0}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#EFEFEF]">
                    <div className="w-12 h-12 bg-[#E5F9F1] rounded-2xl flex items-center justify-center mb-6">
                      <Layers className="w-6 h-6 text-[#38CB89]" />
                    </div>
                    <p className="text-sm font-bold text-[#808191] mb-2">Categories</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-4xl font-headline font-bold">{categories?.length || 0}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#EFEFEF]">
                    <div className="w-12 h-12 bg-[#FEE2E2] rounded-2xl flex items-center justify-center mb-6">
                      <Newspaper className="w-6 h-6 text-[#EF4444]" />
                    </div>
                    <p className="text-sm font-bold text-[#808191] mb-2">Reports</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-4xl font-headline font-bold">{newsItems?.length || 0}</h3>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-[#EFEFEF] p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-bold">Agent Acquisition Analytics</h3>
                        <p className="text-xs text-[#808191] font-bold uppercase tracking-widest mt-1">Last 6 Months Signup Velocity</p>
                      </div>
                      <div className="flex items-center gap-2 text-green-500 bg-green-50 px-3 py-1 rounded-full">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold">Real-time Data</span>
                      </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                      <ChartContainer config={chartConfig} className="h-full w-full">
                        <AreaChart data={analyticsData}>
                          <defs>
                            <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-signups)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="var(--color-signups)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEFEF" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#808191', fontSize: 12, fontWeight: 700 }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#808191', fontSize: 12, fontWeight: 700 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area 
                            type="monotone" 
                            dataKey="signups" 
                            stroke="var(--color-signups)" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorSignups)" 
                          />
                        </AreaChart>
                      </ChartContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] p-8">
                    <h3 className="text-xl font-bold mb-6">Recent Nexus Activity</h3>
                    <div className="space-y-4">
                      {registeredUsers?.slice(0, 5).map((regUser: any) => (
                        <div key={regUser.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F4F4]/50 border border-transparent hover:border-[#4D86FF]/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#4D86FF]/10 rounded-xl flex items-center justify-center text-[#4D86FF]">
                              <UserPlus className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">{regUser.displayName}</p>
                              <p className="text-[10px] text-[#808191] uppercase font-bold truncate">New Agent Link</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[#808191] shrink-0">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-bold">
                              {regUser.createdAt?.toDate ? format(regUser.createdAt.toDate(), 'HH:mm') : 'Recent'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {(!registeredUsers || registeredUsers.length === 0) && (
                        <div className="h-32 flex items-center justify-center text-[#808191] italic bg-[#F4F4F4] rounded-2xl">
                          [ Scanning for new activity signals... ]
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-8">
                <h1 className="text-3xl font-headline font-bold">Protocol Activity Feed</h1>
                <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] p-8">
                  <div className="space-y-6">
                    {registeredUsers?.map((regUser: any) => (
                      <div key={regUser.id} className="flex items-center gap-4 p-6 rounded-2xl bg-[#F4F4F4]/50 border border-transparent hover:border-[#4D86FF]/20 transition-all">
                        <div className="w-14 h-14 bg-[#4D86FF]/10 rounded-2xl flex items-center justify-center shrink-0">
                          <UserPlus className="w-7 h-7 text-[#4D86FF]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className="font-bold text-lg">System Registration Success</h4>
                             <Badge className="bg-green-500 text-white border-none text-[9px] h-5">VERIFIED</Badge>
                          </div>
                          <p className="text-sm text-[#808191]">
                            New neural link established by <span className="font-bold text-[#1A1D1F]">{regUser.displayName}</span> using protocol address <span className="text-[#4D86FF] font-medium">{regUser.email}</span>.
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-[#808191] font-bold uppercase tracking-widest mb-1">
                            {regUser.createdAt?.toDate ? format(regUser.createdAt.toDate(), 'MMM dd, yyyy') : 'Recent'}
                          </p>
                          <p className="text-sm font-headline font-bold text-[#4D86FF]">
                            {regUser.createdAt?.toDate ? format(regUser.createdAt.toDate(), 'HH:mm:ss') : '--:--'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-8">
                <h1 className="text-3xl font-headline font-bold">User Registry</h1>
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
                            <TableCell colSpan={4} className="py-20 text-center text-[#808191] italic animate-pulse">Scanning Secure Registry...</TableCell>
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
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(regUser.id)} className="text-[#FF6A55] font-bold hover:bg-[#FF6A55]/10">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
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
                        Deploy Title
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] rounded-3xl p-8 border-none bg-white max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="font-headline text-2xl font-bold">New Mission Payload</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Game Title</Label>
                          <Input className={inputStyles} placeholder="e.g. Neon Protocol" value={newGame.title} onChange={(e) => setNewGame({...newGame, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Category</Label>
                          <Select value={newGame.category} onValueChange={(v) => setNewGame({...newGame, category: v})}>
                            <SelectTrigger className={inputStyles}>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {categories?.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Cover URL</Label>
                          <Input className={inputStyles} placeholder="https://..." value={newGame.coverUrl} onChange={(e) => setNewGame({...newGame, coverUrl: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Trailer URL</Label>
                          <Input className={inputStyles} placeholder="YouTube Link" value={newGame.trailerUrl} onChange={(e) => setNewGame({...newGame, trailerUrl: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Download URL</Label>
                          <Input className={inputStyles} placeholder="Asset Link" value={newGame.downloadUrl} onChange={(e) => setNewGame({...newGame, downloadUrl: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">ZIP Password</Label>
                          <Input className={inputStyles} placeholder="Encryption Key" value={newGame.zipPassword} onChange={(e) => setNewGame({...newGame, zipPassword: e.target.value})} />
                        </div>
                      </div>
                      <DialogFooter className="mt-10 gap-3">
                        <Button variant="ghost" onClick={() => setIsAddingGame(false)}>Cancel</Button>
                        <Button onClick={handleAddGame} className="bg-[#4D86FF] text-white">Deploy</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Title</TableHead>
                        <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Category</TableHead>
                        <TableHead className="font-bold py-6 px-8 text-center text-[#808191] uppercase text-[11px] tracking-widest">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {games?.map((game: any) => (
                        <TableRow key={game.id} className="hover:bg-[#F4F4F4]/50">
                          <TableCell className="py-6 px-8">
                            <div className="flex items-center gap-4">
                              <img src={game.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
                              <p className="font-bold text-sm">{game.title}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 px-8">
                            <Badge variant="outline">{game.category}</Badge>
                          </TableCell>
                          <TableCell className="py-6 px-8 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditGameClick(game)} className="text-[#4D86FF]">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteGame(game.id)} className="text-[#FF6A55]">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Edit Game Dialog */}
                <Dialog open={isEditingGame} onOpenChange={setIsEditingGame}>
                  <DialogContent className="sm:max-w-[600px] rounded-3xl p-8 border-none bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="mb-6">
                      <DialogTitle className="font-headline text-2xl font-bold">Update Title Meta</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Game Title</Label>
                        <Input className={inputStyles} value={editGame.title} onChange={(e) => setEditGame({...editGame, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Category</Label>
                        <Select value={editGame.category} onValueChange={(v) => setEditGame({...editGame, category: v})}>
                          <SelectTrigger className={inputStyles}>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {categories?.map((cat: any) => (
                              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Cover URL</Label>
                        <Input className={inputStyles} value={editGame.coverUrl} onChange={(e) => setEditGame({...editGame, coverUrl: e.target.value})} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Trailer URL</Label>
                        <Input className={inputStyles} value={editGame.trailerUrl} onChange={(e) => setEditGame({...editGame, trailerUrl: e.target.value})} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Download URL</Label>
                        <Input className={inputStyles} value={editGame.downloadUrl} onChange={(e) => setEditGame({...editGame, downloadUrl: e.target.value})} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">ZIP Password</Label>
                        <Input className={inputStyles} value={editGame.zipPassword} onChange={(e) => setEditGame({...editGame, zipPassword: e.target.value})} />
                      </div>
                    </div>
                    <DialogFooter className="mt-10 gap-3">
                      <Button variant="ghost" onClick={() => setIsEditingGame(false)}>Cancel</Button>
                      <Button onClick={handleUpdateGame} className="bg-[#4D86FF] text-white">Commit Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="news" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-headline font-bold">News Feed</h1>
                  <Dialog open={isAddingNews} onOpenChange={setIsAddingNews}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#4D86FF] hover:bg-[#3B71E0] h-12 px-8 rounded-xl font-bold flex gap-3 shadow-[0_10px_20px_rgba(77,134,255,0.2)]">
                        <Plus className="w-4 h-4" />
                        Deploy News
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] rounded-3xl p-8 border-none bg-white">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="font-headline text-2xl font-bold">New Trending Report</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Report Title</Label>
                          <Input className={inputStyles} placeholder="Breaking News..." value={newNews.title} onChange={(e) => setNewNews({...newNews, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Category Tag</Label>
                          <Input className={inputStyles} placeholder="e.g. EXCLUSIVE" value={newNews.category} onChange={(e) => setNewNews({...newNews, category: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Illustration URL</Label>
                          <Input className={inputStyles} placeholder="https://..." value={newNews.imageUrl} onChange={(e) => setNewNews({...newNews, imageUrl: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Description Intel</Label>
                          <Textarea className="rounded-xl border-[#E2E8F0] focus:border-[#4D86FF] text-red-600 font-bold min-h-[120px]" placeholder="Detailed report description..." value={newNews.content} onChange={(e) => setNewNews({...newNews, content: e.target.value})} />
                        </div>
                      </div>
                      <DialogFooter className="mt-10 gap-3">
                        <Button variant="ghost" onClick={() => setIsAddingNews(false)}>Cancel</Button>
                        <Button onClick={handleAddNews} className="bg-[#4D86FF] text-white">Broadcast</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Report</TableHead>
                        <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Category</TableHead>
                        <TableHead className="font-bold py-6 px-8 text-[#808191] uppercase text-[11px] tracking-widest">Date</TableHead>
                        <TableHead className="font-bold py-6 px-8 text-center text-[#808191] uppercase text-[11px] tracking-widest">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-20 text-center text-[#808191] animate-pulse">Syncing Feed...</TableCell>
                        </TableRow>
                      ) : newsItems?.map((item: any) => (
                        <TableRow key={item.id} className="hover:bg-[#F4F4F4]/50">
                          <TableCell className="py-6 px-8">
                            <div className="flex items-center gap-4">
                              <img src={item.imageUrl} className="w-16 h-10 rounded-lg object-cover" />
                              <p className="font-bold text-sm">{item.title}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-6 px-8">
                            <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-none">{item.category}</Badge>
                          </TableCell>
                          <TableCell className="py-6 px-8 text-[#808191] text-xs">
                            {item.createdAt?.toDate ? format(item.createdAt.toDate(), 'MMM dd, HH:mm') : 'Just now'}
                          </TableCell>
                          <TableCell className="py-6 px-8 text-center">
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteNews(item.id)} className="text-[#FF6A55]">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="categories" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-headline font-bold">Categories</h1>
                  <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#4D86FF] hover:bg-[#3B71E0] h-12 px-8 rounded-xl font-bold flex gap-3 shadow-[0_10px_20px_rgba(77,134,255,0.2)]">
                        <Plus className="w-4 h-4" />
                        New Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 border-none bg-white">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="font-headline text-2xl font-bold">Establish Category</DialogTitle>
                        <DialogDescription>Add a new classification for the gaming repository.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Category Name</Label>
                          <Input className={inputStyles} placeholder="e.g. Action RPG" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                        </div>
                      </div>
                      <DialogFooter className="mt-10 gap-3">
                        <Button variant="ghost" onClick={() => setIsAddingCategory(false)}>Cancel</Button>
                        <Button onClick={handleAddCategory} className="bg-[#4D86FF] text-white">Create</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-[#EFEFEF] p-8">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {categoriesLoading ? (
                        <div className="col-span-full py-10 text-center animate-pulse text-[#808191]">Syncing classifications...</div>
                      ) : categories?.map((cat: any) => (
                        <div key={cat.id} className="p-6 rounded-2xl bg-[#F4F4F4] flex justify-between items-center group hover:bg-[#EFEFEF] transition-all">
                          <p className="font-bold">{cat.name}</p>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.id)} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-8">
                <h1 className="text-3xl font-headline font-bold">Platform Configuration</h1>
                <div className="bg-white rounded-3xl p-10 max-w-2xl border border-[#EFEFEF]">
                   <div className="space-y-8">
                      <div className="grid gap-4">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Platform Title</Label>
                        <Input defaultValue="FIDE GAMES NEXUS" className={inputStyles} />
                      </div>
                      <div className="grid gap-4">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-[#808191]">Admin Email</Label>
                        <Input defaultValue="nshutifidele1@gmail.com" className={inputStyles} />
                      </div>
                      <Button className="w-full bg-[#111315] text-white h-14 rounded-xl font-bold">Commit Changes</Button>
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
