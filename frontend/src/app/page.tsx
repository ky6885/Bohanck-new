"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Users, MessageSquare, Sparkles, ArrowRight, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[100px] animate-pulse [animation-delay:1.5s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px]" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-10 max-w-4xl">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-base text-slate-300">AI-Powered City Adventure</span>
          </div>

          {/* Title */}
          <div className="space-y-5">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight">
              城谜 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">CityQuest</span>
            </h1>
            <p className="text-2xl md:text-3xl text-slate-400 font-light max-w-2xl mx-auto">
              探索城市的秘密，体验 AI 驱动的沉浸式城市剧本游
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-5">
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-800/40 border border-slate-700/50 text-slate-300">
              <MapPin className="w-5 h-5 text-orange-400" />
              <span className="text-base font-medium">城市探索</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-800/40 border border-slate-700/50 text-slate-300">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-base font-medium">AI NPC</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-800/40 border border-slate-700/50 text-slate-300">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <span className="text-base font-medium">智能对话</span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8">
            <Link href="/role">
              <Button
                size="lg"
                className="group h-18 px-12 text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 border-0 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Play className="w-6 h-6 mr-3" />
                开始冒险
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="mt-6 text-base text-slate-500">
              3分钟体验 · 无需下载
            </p>
          </div>
        </div>

        {/* Features Cards */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 cursor-pointer group hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl text-white font-semibold mb-2">AI 剧本生成</h3>
              <p className="text-base text-slate-400">智能生成专属剧情</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 cursor-pointer group hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-xl text-white font-semibold mb-2">沉浸式对话</h3>
              <p className="text-base text-slate-400">与 AI NPC 实时互动</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 cursor-pointer group hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl text-white font-semibold mb-2">专属故事</h3>
              <p className="text-base text-slate-400">生成你的旅行故事</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
