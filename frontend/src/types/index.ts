export interface ScriptNode {
  id: string;
  place_name: string;
  chapter: string;
  npc: string;
  npc_persona: string;
  task: string;
  clue: string;
  order_index: number;
  status: "locked" | "active" | "completed";
}

export interface Script {
  id: string;
  title: string;
  role: string;
  mission: string;
  nodes: ScriptNode[];
  city: string;
}

export interface GameState {
  city: string;
  role: string;
  interests: string[];
  duration: string;
  script: Script | null;
  currentNodeIndex: number;

  setPreferences: (prefs: { city: string; role: string; interests: string[]; duration: string }) => void;
  setScript: (script: Script) => void;
  completeNode: (nodeId: string) => void;
  setCurrentNode: (index: number) => void;
  reset: () => void;
}
