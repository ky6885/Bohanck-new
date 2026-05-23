"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/stores/gameStore";
import { MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "npc";
  content: string;
}

const NPC_RESPONSES: Record<string, string> = {
  中华门: "这位冒险者，中华门可是南京城的门面啊！想当年我守这门的时候......对了，你说的那封信，我好像听老一辈提起过。",
  老门东: "年轻人是做伞的还是寻人的？这纸伞啊，是我们老金家的手艺，一代代传下来的。你要找的东西，可能和这伞有关。",
  夫子庙: "秦淮河的水养育了我们这些人。你说的秘密？让我想想......当年的画舫上发生过不少故事啊。",
  中山陵: "中山先生长眠于此，这里的每一步都承载着历史。你能找到这里，说明你我有缘。",
  天津之眼: "年轻人，这海河的水深着呢......你想知道的秘密，都在这河里。",
  意式风情区: "这些洋楼啊，每一栋都有一个故事。你想听哪一个？",
  古文化街: "津门手艺，讲究！这泥人张啊，是咱们天津的一绝。",
  五大道: "这里曾是民国风云人物的聚集地，每栋楼都有自己的传奇。",
  大雁塔: "阿弥陀佛，玄奘法师翻译的经文就在这塔中。老衲在此修行三十年，若有机缘，自会指点于你。",
  回民街: "来，尝尝正宗的羊肉泡馍！这可是我们老马家传了三代的手艺。你要找的东西？吃完再说，吃完再说。",
  城墙: "这城墙啊，修了上千年，每块砖都有故事。你说的线索......让我带你巡视一圈。",
  兵马俑: "考古这事急不得。你看这些兵马俑，千年尘土，拨开迷雾才能见真相。",
};

const NPC_AVATARS: Record<string, string> = {
  守城老人: "👴",
  非遗传承人: "🎨",
  画舫船夫: "⛵",
  历史学者: "📚",
  老船长: "⛵",
  华侨后裔: "👨‍💼",
  泥人张传人: "🎭",
  僧侣: "🧓",
  老字号店主: "👨‍🍳",
  城墙管理员: "👷",
  考古队员: "🔬",
};

export default function ChatPage() {
  const router = useRouter();
  const { script, currentNodeIndex, completeNode } = useGameStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentNode = script?.nodes[currentNodeIndex];

  useEffect(() => {
    if (!script || !currentNode) {
      router.push("/role");
      return;
    }

    setMessages([
      {
        role: "npc",
        content: `你好，我是${currentNode.npc}。${currentNode.npc_persona} 你来找我有什么事吗？`,
      },
    ]);
  }, [script, currentNode, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setIsTyping(true);
    setTimeout(() => {
      const response = NPC_RESPONSES[currentNode?.place_name || ""] ||
        "这个嘛......让我想想该怎么告诉你。";
      setMessages((prev) => [...prev, { role: "npc", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleComplete = () => {
    if (currentNode) {
      completeNode(currentNode.id);

      const allCompleted = script?.nodes.every((n) => n.status === "completed" || n.id === currentNode.id);

      if (allCompleted) {
        router.push("/story-card");
      } else {
        router.push("/map");
      }
    }
  };

  if (!currentNode) return null;

  const npcAvatar = NPC_AVATARS[currentNode.npc] || "👤";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 p-6 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl shadow-lg shadow-cyan-500/25">
            {npcAvatar}
          </div>
          <div>
            <h1 className="font-bold text-white text-2xl">{currentNode.npc}</h1>
            <p className="text-base text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {currentNode.place_name}
            </p>
          </div>
        </div>
      </div>

      {/* Task Info */}
      <div className="bg-cyan-500/10 border-b border-cyan-500/20 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-base text-cyan-300 flex items-center gap-2">
            <span className="text-xl">🎯</span> 任务：{currentNode.task}
          </p>
        </div>
      </div>

      {/* Messages - Full screen */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "npc" && (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl mr-3 flex-shrink-0">
                  {npcAvatar}
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-5 py-4 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "bg-slate-800 border border-slate-700 text-white"
                }`}
              >
                <p className="text-base leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl mr-3">
                {npcAvatar}
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-900/50 border-t border-slate-800 p-6 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入你的问题..."
              className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-14 rounded-xl text-base"
            />
            <Button
              onClick={handleSend}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 h-14 px-8 rounded-xl"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <Button
            onClick={handleComplete}
            variant="outline"
            className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10 h-14 rounded-xl text-lg"
          >
            <CheckCircle2 className="w-6 h-6 mr-2" />
            完成任务
          </Button>
        </div>
      </div>
    </div>
  );
}
