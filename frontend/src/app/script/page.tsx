"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/stores/gameStore";
import { Script } from "@/types";
import { Sparkles, MapPin, User, Target, ArrowRight, Loader2 } from "lucide-react";

const generateMockScript = (city: string, role: string): Script => {
  const scripts: Record<string, Script> = {
    南京: {
      id: "script_001",
      title: "消失的老城信件",
      role: role,
      mission: "寻找一封藏在老城中的神秘信件",
      city: city,
      nodes: [
        {
          id: "node_1",
          place_name: "中华门",
          chapter: "第一章：城门下的暗号",
          npc: "守城老人",
          npc_persona: "在中华门守了50年的老人，熟悉城中大小事务",
          task: "找到城门石刻上的线索",
          clue: "石刻上的花纹隐藏着密码",
          order_index: 0,
          status: "active",
        },
        {
          id: "node_2",
          place_name: "老门东",
          chapter: "第二章：巷子里的秘密",
          npc: "非遗传承人",
          npc_persona: "金陵纸伞传承人，手艺精湛",
          task: "询问关于神秘信件的消息",
          clue: "伞面上绘制着地图",
          order_index: 1,
          status: "locked",
        },
        {
          id: "node_3",
          place_name: "夫子庙",
          chapter: "第三章：秦淮河畔",
          npc: "画舫船夫",
          npc_persona: "在秦淮河上漂泊了30年的老船夫",
          task: "乘坐画舫寻找线索",
          clue: "河水的倒影中藏有信息",
          order_index: 2,
          status: "locked",
        },
        {
          id: "node_4",
          place_name: "中山陵",
          chapter: "第四章：最终谜底",
          npc: "历史学者",
          npc_persona: "研究南京历史多年的学者",
          task: "解开最终谜题",
          clue: "一切线索指向这里",
          order_index: 3,
          status: "locked",
        },
      ],
    },
    天津: {
      id: "script_003",
      title: "津门谍影",
      role: role,
      mission: "探寻近代天津的风云往事",
      city: city,
      nodes: [
        {
          id: "node_1",
          place_name: "天津之眼",
          chapter: "第一章：摩天轮下的秘密",
          npc: "老船长",
          npc_persona: "在海河上航行了40年的老船长，熟悉天津卫的每一条水道",
          task: "从船长口中获取线索",
          clue: "河面上的倒影隐藏着信息",
          order_index: 0,
          status: "active",
        },
        {
          id: "node_2",
          place_name: "意式风情区",
          chapter: "第二章：洋楼里的往事",
          npc: "华侨后裔",
          npc_persona: "在意式风情区生活了60年的老人，见证了天津的变迁",
          task: "探寻洋楼的历史",
          clue: "建筑上的雕刻有特殊含义",
          order_index: 1,
          status: "locked",
        },
        {
          id: "node_3",
          place_name: "古文化街",
          chapter: "第三章：津味十足",
          npc: "泥人张传人",
          npc_persona: "津门泥人张第五代传人，手艺精湛",
          task: "寻找关于手艺的秘密",
          clue: "泥人的颜色有讲究",
          order_index: 2,
          status: "locked",
        },
        {
          id: "node_4",
          place_name: "五大道",
          chapter: "第四章：民国风云",
          npc: "历史学者",
          npc_persona: "研究天津近代史的学者",
          task: "解开五大道的历史谜团",
          clue: "每栋建筑都有一个故事",
          order_index: 3,
          status: "locked",
        },
      ],
    },
    西安: {
      id: "script_002",
      title: "大唐西域记",
      role: role,
      mission: "追寻玄奘法师的足迹",
      city: city,
      nodes: [
        {
          id: "node_1",
          place_name: "大雁塔",
          chapter: "第一章：塔影重重",
          npc: "僧侣",
          npc_persona: "大慈恩寺的资深僧侣",
          task: "寻找玄奘翻译的经文",
          clue: "经文首页有特殊标记",
          order_index: 0,
          status: "active",
        },
        {
          id: "node_2",
          place_name: "回民街",
          chapter: "第二章：丝路美食",
          npc: "老字号店主",
          npc_persona: "世代经营泡馍的老店老板",
          task: "品尝美食获取线索",
          clue: "碗底刻着图案",
          order_index: 1,
          status: "locked",
        },
        {
          id: "node_3",
          place_name: "城墙",
          chapter: "第三章：城墙往事",
          npc: "城墙管理员",
          npc_persona: "负责城墙维护的老师傅",
          task: "巡视城墙寻找线索",
          clue: "砖块上的编号",
          order_index: 2,
          status: "locked",
        },
        {
          id: "node_4",
          place_name: "兵马俑",
          chapter: "第四章：千古之谜",
          npc: "考古队员",
          npc_persona: "兵马俑博物馆的考古研究员",
          task: "解开兵马俑的秘密",
          clue: "俑坑中的特殊位置",
          order_index: 3,
          status: "locked",
        },
      ],
    },
  };

  return scripts[city] || scripts["南京"];
};

export default function ScriptPage() {
  const router = useRouter();
  const { city, role, setScript } = useGameStore();
  const [isGenerating, setIsGenerating] = useState(true);
  const [script, setScriptData] = useState<Script | null>(null);

  useEffect(() => {
    if (!city || !role) {
      router.push("/role");
      return;
    }

    const timer = setTimeout(() => {
      const mockScript = generateMockScript(city, role);
      setScriptData(mockScript);
      setScript(mockScript);
      setIsGenerating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [city, role, router, setScript]);

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
              <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-3xl border-4 border-cyan-400/30 animate-ping" />
          </div>

          <div className="space-y-2">
            <p className="text-2xl text-white font-bold">AI 正在生成剧本</p>
            <p className="text-slate-400">根据你的选择定制专属剧情...</p>
          </div>

          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!script) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Hero Card - Full width */}
          <Card className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <CardHeader className="relative">
              <Sparkles className="w-12 h-12 mb-3" />
              <CardTitle className="text-4xl font-black">{script.title}</CardTitle>
              <p className="text-cyan-100 flex items-center gap-6 text-lg">
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {script.role}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {script.city}
                </span>
              </p>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-3 text-xl">
                <Target className="w-6 h-6" />
                <span className="font-medium">任务：{script.mission}</span>
              </div>
            </CardContent>
          </Card>

          {/* Chapters - Full width list */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              剧本章节
            </h2>
            {script.nodes.map((node, index) => (
              <Card
                key={node.id}
                className={`bg-slate-900/50 border-slate-800 transition-all duration-300 hover:bg-slate-800/50 hover:scale-[1.01] ${
                  node.status === "active" ? "ring-2 ring-cyan-500/50" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                        node.status === "active"
                          ? "bg-gradient-to-br from-green-400 to-emerald-500"
                          : node.status === "completed"
                          ? "bg-slate-600"
                          : "bg-slate-700 text-slate-400"
                      }`}>
                        {node.status === "completed" ? "✓" : index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{node.chapter}</CardTitle>
                        <div className="flex items-center gap-4 mt-1 text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {node.place_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" /> {node.npc}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm px-4 py-2 rounded-full ${
                      node.status === "active"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : node.status === "completed"
                        ? "bg-slate-700 text-slate-400"
                        : "bg-slate-800 text-slate-500"
                    }`}>
                      {node.status === "active" ? "进行中" : node.status === "completed" ? "已完成" : "未解锁"}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="sticky bottom-0 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => router.push("/map")}
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 border-0 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <MapPin className="w-6 h-6 mr-2" />
            开始探索
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
