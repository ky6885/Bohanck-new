"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/stores/gameStore";
import { MapPin, User, Heart, Clock, ArrowRight, Sparkles } from "lucide-react";

const CITIES = [
  { value: "南京", label: "南京", desc: "六朝古都", icon: "🏛️" },
  { value: "天津", label: "天津", desc: "渤海明珠", icon: "🌉" },
  { value: "西安", label: "西安", desc: "十三朝古都", icon: "🏯" },
  { value: "杭州", label: "杭州", desc: "人间天堂", icon: "🌸" },
  { value: "成都", label: "成都", desc: "天府之国", icon: "🐼" },
];

const ROLES = [
  { value: "城市侦探", label: "城市侦探", desc: "破解城市中的谜题", icon: "🔍" },
  { value: "民国记者", label: "民国记者", desc: "探寻历史真相", icon: "📰" },
  { value: "非遗学徒", label: "非遗学徒", desc: "传承传统文化", icon: "🎨" },
  { value: "未来考古学家", label: "未来考古学家", desc: "寻找远古遗迹", icon: "⛏️" },
];

const INTERESTS = [
  { value: "历史", label: "历史" },
  { value: "美食", label: "美食" },
  { value: "建筑", label: "建筑" },
  { value: "非遗", label: "非遗" },
  { value: "悬疑", label: "悬疑" },
];

const DURATIONS = [
  { value: "1小时", label: "1小时" },
  { value: "2小时", label: "2小时" },
  { value: "半天", label: "半天" },
  { value: "1天", label: "1天" },
  { value: "2天", label: "2天" },
];

export default function RolePage() {
  const router = useRouter();
  const setPreferences = useGameStore((state) => state.setPreferences);

  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [duration, setDuration] = useState("");

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (!city || !role || interests.length === 0 || !duration) {
      alert("请完成所有选择");
      return;
    }
    setPreferences({ city, role, interests, duration });
    router.push("/script");
  };

  const isComplete = city && role && interests.length > 0 && duration;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="text-xs text-cyan-400">Step 1 of 3</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">
              选择你的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">角色</span>
            </h1>
            <p className="text-slate-400 text-lg">定制你的城市冒险体验</p>
          </div>

          {/* City Selection - Full width grid */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <MapPin className="w-6 h-6 text-orange-400" />
                选择城市
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CITIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCity(c.value)}
                  className={`p-5 rounded-2xl border-2 text-center transition-all duration-300 cursor-pointer hover:scale-105 ${
                    city === c.value
                      ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                      : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                  }`}
                >
                  <div className="text-4xl mb-2">{c.icon}</div>
                  <div className="font-bold text-white text-lg">{c.label}</div>
                  <div className="text-sm text-slate-400">{c.desc}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Role Selection - 4 columns */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <User className="w-6 h-6 text-purple-400" />
                选择角色
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`p-5 rounded-2xl border-2 text-center transition-all duration-300 cursor-pointer hover:scale-105 ${
                    role === r.value
                      ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                      : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{r.icon}</div>
                  <div className="font-bold text-white">{r.label}</div>
                  <div className="text-sm text-slate-400">{r.desc}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Interests - Full width tags */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <Heart className="w-6 h-6 text-pink-400" />
                选择兴趣
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 justify-center">
              {INTERESTS.map((i) => (
                <button
                  key={i.value}
                  onClick={() => toggleInterest(i.value)}
                  className={`px-6 py-3 rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-105 text-lg ${
                    interests.includes(i.value)
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {i.label}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Duration */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <Clock className="w-6 h-6 text-green-400" />
                选择时长
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                    duration === d.value
                      ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                      : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                  }`}
                >
                  <div className="font-bold text-white text-xl">{d.label}</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="sticky bottom-0 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`w-full h-16 text-xl font-bold rounded-2xl transition-all duration-300 ${
              isComplete
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25"
                : "bg-slate-700 cursor-not-allowed"
            }`}
          >
            {isComplete ? (
              <>
                <Sparkles className="w-6 h-6 mr-2" />
                生成剧本
                <ArrowRight className="w-6 h-6 ml-2" />
              </>
            ) : (
              "请完成所有选择"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
