"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/stores/gameStore";
import { ScriptNode } from "@/types";
import { MapPin, User, Target, ArrowRight, Navigation } from "lucide-react";

const CITY_ICONS: Record<string, string> = {
  南京: "🏛️",
  天津: "🌉",
  西安: "🏯",
  杭州: "🌸",
  成都: "🐼",
};

export default function MapPage() {
  const router = useRouter();
  const { script, currentNodeIndex, setCurrentNode } = useGameStore();
  const [selectedNode, setSelectedNode] = useState<ScriptNode | null>(null);

  useEffect(() => {
    if (!script) {
      router.push("/role");
    }
  }, [script, router]);

  if (!script) return null;

  const currentNode = script.nodes[currentNodeIndex];

  const handleNodeClick = (node: ScriptNode) => {
    if (node.status !== "locked") {
      setSelectedNode(node);
    }
  };

  const handleStartTask = () => {
    if (selectedNode) {
      const idx = script.nodes.findIndex((n) => n.id === selectedNode.id);
      setCurrentNode(idx);
      router.push("/chat");
    }
  };

  const completedCount = script.nodes.filter(n => n.status === "completed").length;
  const progress = (completedCount / script.nodes.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 p-6 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">{CITY_ICONS[script.city] || "🏙️"}</span>
              {script.title}
            </h1>
            <span className="text-lg text-cyan-400 font-medium">
              {completedCount}/{script.nodes.length} 完成
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-base text-slate-400 mt-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            当前任务：{currentNode?.place_name}
          </p>
        </div>
      </div>

      {/* Map Area - Full screen */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Map placeholder */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-48 h-48 rounded-3xl bg-slate-800/50 backdrop-blur-sm flex items-center justify-center border border-slate-700 shadow-2xl">
                <span className="text-8xl">{CITY_ICONS[script.city] || "🏙️"}</span>
              </div>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <p className="text-3xl text-white font-bold">{script.city}</p>
              <p className="text-slate-500 text-lg mt-2">高德地图 SDK 待接入</p>
            </div>
          </div>
        </div>

        {/* Task Points - Floating at bottom */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-400" />
                任务点
              </h3>
              <span className="text-lg text-slate-400">{completedCount}/{script.nodes.length}</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {script.nodes.map((node, idx) => (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  disabled={node.status === "locked"}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 cursor-pointer hover:scale-105 ${
                    node.status === "active"
                      ? "border-green-400 bg-green-500/20 shadow-lg shadow-green-500/20"
                      : node.status === "completed"
                      ? "border-slate-600 bg-slate-700/50 opacity-60"
                      : "border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {node.status === "completed" ? "✓" : idx + 1}
                  </div>
                  <div className="text-base text-white font-medium">{node.place_name}</div>
                  <div className="text-sm text-slate-400">{node.npc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 text-2xl">
                <MapPin className="w-7 h-7 text-orange-400" />
                {selectedNode.place_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-xl">
                <p className="text-sm text-slate-400 mb-1">NPC</p>
                <p className="font-bold text-white text-lg flex items-center gap-2">
                  <User className="w-5 h-5" /> {selectedNode.npc}
                </p>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <p className="text-sm text-cyan-400 mb-1">任务</p>
                <p className="font-medium text-white text-lg">{selectedNode.task}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-14 border-slate-600 text-white hover:bg-slate-800 text-lg"
                  onClick={() => setSelectedNode(null)}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-lg"
                  onClick={handleStartTask}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  开始对话
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
