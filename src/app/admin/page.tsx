
"use client";

import React, { useState } from "react";
import { 
  Search, 
  Bell, 
  MoreVertical, 
  Download, 
  Info, 
  BookOpen, 
  Settings, 
  UserPlus, 
  UserCircle,
  ChevronDown,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { motion } from "framer-motion";

const SIDEBAR_ITEMS = [
  { icon: Info, label: "Information", hasSub: true },
  { 
    icon: BookOpen, 
    label: "Teaching", 
    hasSub: true, 
    isOpen: true,
    subItems: ["Management", "Class Schedule", "Student Work", "Dissemination"]
  },
  { icon: Settings, label: "Event Settings", hasSub: true },
  { icon: UserPlus, label: "Add Teacher", hasSub: true },
  { icon: UserCircle, label: "Account", hasSub: true },
];

const TABLE_DATA = [
  { id: 1, workName: "Icon Design", courseName: "Design Training Camp", updateTime: "2022.03.11 22:20", progress: "0 / 80" },
  { id: 2, workName: "Interface Design", courseName: "Design Training Camp", updateTime: "2022.02.28 22:25", progress: "17 / 63" },
  { id: 3, workName: "Product Experience", courseName: "Interactive Course", updateTime: "2022.02.23 22:40", progress: "22 / 58" },
  { id: 4, workName: "Design Revision Exercises", courseName: "Design Training Camp", updateTime: "2022.02.10 10:25", progress: "33 / 47" },
  { id: 5, workName: "Color Practice", courseName: "Design Training Camp", updateTime: "2022.02.07 20:38", progress: "58 / 22" },
  { id: 6, workName: "Competition Analysis", courseName: "Interactive Course", updateTime: "2022.01.23 22:17", progress: "27 / 53" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex min-h-screen bg-[#f4f7fa] font-body text-[#333]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e2532] text-white flex flex-col shrink-0">
        <div className="p-6">
          <div className="bg-[#4d86ff] rounded-xl p-3 flex items-center justify-center gap-2 mb-8">
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-headline font-bold text-xl tracking-tight italic">ViUx</span>
          </div>

          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item, idx) => (
              <div key={idx} className="mb-2">
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.hasSub && (item.isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />)}
                </button>
                {item.isOpen && item.subItems && (
                  <div className="ml-11 mt-1 space-y-1">
                    {item.subItems.map((sub, sIdx) => (
                      <button 
                        key={sIdx}
                        className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${sub === 'Student Work' ? 'bg-[#4d86ff] text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10">
          <div className="flex items-center gap-4 text-gray-400">
            {/* Minimal spacing for balance */}
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <Avatar className="w-10 h-10 ring-2 ring-gray-50">
                <AvatarImage src="https://picsum.photos/seed/admin/100/100" />
                <AvatarFallback>HM</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-bold">Heimaux</p>
              </div>
              <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-headline font-bold text-[#1e2532] mb-2">Student Work Management</h1>
              <p className="text-gray-400 text-sm">Class students' homework correction and management.</p>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                {/* Custom Tabs */}
                <Tabs defaultValue="all" className="mb-10">
                  <TabsList className="bg-transparent h-auto p-0 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {["All Homework", "Daily Practice", "Public Courses", "Cancel Work"].map((t) => (
                      <TabsTrigger 
                        key={t}
                        value={t.toLowerCase().replace(' ', '-')}
                        className="px-8 py-3 rounded-full data-[state=active]:bg-[#4d86ff] data-[state=active]:text-white bg-[#e8effd] text-[#4d86ff] border-none font-medium text-sm transition-all"
                      >
                        {t}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                  <div className="flex flex-wrap items-center gap-6 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold whitespace-nowrap">Work Name</span>
                      <Input 
                        placeholder="Please enter here" 
                        className="w-64 h-12 rounded-xl border-gray-200 focus-visible:ring-[#4d86ff]"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold whitespace-nowrap">Course Name</span>
                      <Select>
                        <SelectTrigger className="w-64 h-12 rounded-xl border-gray-200">
                          <SelectValue placeholder="Please choose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design Training Camp</SelectItem>
                          <SelectItem value="interactive">Interactive Course</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="h-12 px-8 rounded-xl bg-white border border-[#4d86ff] text-[#4d86ff] hover:bg-[#4d86ff]/5 font-bold">
                      Search
                    </Button>
                  </div>
                  <Button className="h-12 px-8 rounded-xl bg-[#4d86ff] text-white hover:bg-[#3b71e0] font-bold flex gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#f8faff]">
                      <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="font-bold py-6 px-4">Work Name</TableHead>
                        <TableHead className="font-bold py-6 px-4">Course Name</TableHead>
                        <TableHead className="font-bold py-6 px-4">Update Time</TableHead>
                        <TableHead className="font-bold py-6 px-4">Finish/Undone</TableHead>
                        <TableHead className="font-bold py-6 px-4 text-center">Operate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TABLE_DATA.map((row) => (
                        <TableRow key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <TableCell className="py-6 px-4 font-medium">{row.workName}</TableCell>
                          <TableCell className="py-6 px-4 text-gray-500">{row.courseName}</TableCell>
                          <TableCell className="py-6 px-4 text-gray-500">{row.updateTime}</TableCell>
                          <TableCell className="py-6 px-4 font-bold text-[#1e2532]">{row.progress}</TableCell>
                          <TableCell className="py-6 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button size="sm" variant="outline" className="rounded-lg border-[#4d86ff] text-[#4d86ff] hover:bg-[#4d86ff] hover:text-white transition-all h-8 text-xs font-bold px-4">Notice</Button>
                              <Button size="sm" variant="outline" className="rounded-lg border-[#4d86ff] text-[#4d86ff] hover:bg-[#4d86ff] hover:text-white transition-all h-8 text-xs font-bold px-4">Reply</Button>
                              <Button size="sm" variant="outline" className="rounded-lg border-gray-300 text-gray-400 hover:bg-gray-100 h-8 text-xs font-bold px-4">Cancel</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Placeholder */}
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4d86ff] text-white font-bold">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 font-bold">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 font-bold">3</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 font-bold">4</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 font-bold">5</button>
                  <span className="px-2 text-gray-300">...</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 font-bold">17</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
