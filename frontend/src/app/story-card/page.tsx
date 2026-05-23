"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGameStore } from "@/stores/gameStore";
import { Sparkles, MapPin, Users, Share2, RotateCcw, Loader2 } from "lucide-react";

export default function StoryCardPage() {
  const router = useRouter();
  const { script, reset } = useGameStore();
  const [isGenerating, setIsGenerating] = useState(true);

  const storyData = {
    title: script?.title || "城市探索",
    story: `这是一段难忘的城市探索之旅。作为${script?.role || "冒险者"}，我在${script?.city || "这座城市"}中展开了追寻。

从${script?.nodes[0]?.place_name || "起点"}开始，我遇到了${script?.nodes[0]?.npc || "神秘人"}，在他的指引下，我逐渐揭开了关于${script?.mission || "秘密"}的真相。

途中，我相继拜访了${script?.nodes.slice(1).map(n => n.place_name).join("、") || "其他地点"}，每一次相遇都是一段独特的故事。这不仅是一次寻找，更是一次与这座城市深度对话的旅程。`,
    keywords: ["探索", "发现", "传承", "历史", "文化"],
    places: script?.nodes.map(n => n.place_name) || [],
    npcs: script?.nodes.map(n => n.npc) || [],
  };

  useEffect(() => {
    if (!script) {
      router.push("/role");
      return;
    }

    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [script, router]);

  const handleRestart = () => {
    reset();
    router.push("/");
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
              <Sparkles className="w-14 h-14 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-3xl border-4 border-amber-400/30 animate-ping" />
          </div>

          <div className="space-y-2">
            <p className="text-2xl text-white font-bold">AI 正在撰写你的故事</p>
            <p className="text-slate-400 text-lg">为你生成专属旅行故事...</p>
          </div>

          <div className="flex justify-center">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Card className="bg-slate-900 border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
          {/* Decorative header */}
          <div className="h-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

          <CardContent className="p-8 space-y-6">
            {/* Title section */}
            <div className="text-center space-y-3">
              <div className="text-6xl mb-3">🏆</div>
              <h1 className="text-3xl font-black text-white">
                {storyData.title}
              </h1>
              <p className="text-xl text-cyan-400 font-medium">{script?.role}</p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-700" />
              <Sparkles className="w-6 h-6 text-amber-400" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-700" />
            </div>

            {/* Story */}
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
                {storyData.story}
              </p>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 justify-center">
              {storyData.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 rounded-full text-base font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-sm text-slate-500">访问地点</div>
                <div className="text-2xl font-bold text-white">{storyData.places.length}</div>
              </div>
              <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-sm text-slate-500">遇见NPC</div>
                <div className="text-2xl font-bold text-white">{storyData.npcs.length}</div>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-3">
              <div className="text-base text-slate-500 font-medium">探索路线</div>
              <div className="flex flex-wrap gap-2">
                {storyData.places.map((p, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-full text-base border border-slate-700"
                  >
                    {i + 1}. {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-lg shadow-lg">
                <Share2 className="w-6 h-6 mr-2" />
                分享故事卡
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl font-bold text-lg"
                onClick={handleRestart}
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                再次冒险
              </Button>
            </div>
          </CardContent>

          {/* Decorative footer */}
          <div className="h-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
        </Card>

        {/* Thank you message */}
        <p className="text-center text-slate-500 text-base mt-8">
          感谢你的探索旅程 ✨
        </p>
      </div>
    </div>
  );
}
