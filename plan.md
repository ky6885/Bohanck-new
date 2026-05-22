# 城谜 CityQuest：AI 城市剧本游 - 实施计划

## 项目概述
- **项目名**: 城谜 CityQuest
- **目标**: 48-72小时内做出可演示的AI城市剧本游Demo
- **团队**: 2人 (前端+产品 / 后端+AI)
- **核心流程**: 角色选择 → AI剧本生成 → 地图任务 → NPC对话 → 故事卡

## 技术栈确认
| 模块 | 选型 |
|------|------|
| 前端框架 | Next.js 14 + React + TypeScript |
| UI组件 | Tailwind CSS + shadcn/ui |
| 地图 | 高德地图 JS API |
| 状态管理 | Zustand |
| 后端框架 | FastAPI |
| 数据库 | Supabase (PostgreSQL + pgvector) |
| AI | OpenAI API (GPT-4o) |
| 部署 | Vercel (前端) + Railway (后端) |

## 项目确认
- **目标城市**: 南京 (六朝古都，资料丰富)
- **OpenAI API**: 已准备好

---

## 一、项目结构

```
cityquest/
├── frontend/                 # Next.js 前端
│   ├── src/
│   │   ├── app/             # App Router
│   │   │   ├── page.tsx            # 首页
│   │   │   ├── role/page.tsx       # 角色选择
│   │   │   ├── script/page.tsx     # 剧本生成
│   │   │   ├── map/page.tsx        # 地图任务页
│   │   │   ├── chat/page.tsx       # NPC对话页
│   │   │   └── story-card/page.tsx # 故事卡页
│   │   ├── components/      # 组件
│   │   │   ├── ui/          # shadcn组件
│   │   │   ├── Map.tsx      # 地图组件
│   │   │   ├── Chat.tsx     # 对话组件
│   │   │   └── StoryCard.tsx # 故事卡组件
│   │   ├── lib/             # 工具函数
│   │   ├── stores/          # Zustand状态
│   │   └── types/           # TypeScript类型
│   └── package.json
│
├── backend/                  # FastAPI 后端
│   ├── app/
│   │   ├── api/             # API路由
│   │   │   ├── scripts.py    # 剧本生成API
│   │   │   ├── npc.py       # NPC对话API
│   │   │   └── story.py     # 故事卡API
│   │   ├── services/        # 业务逻辑
│   │   │   ├── script_generator.py
│   │   │   ├── npc_chat.py
│   │   │   └── story_generator.py
│   │   ├── prompts/         # AI提示词
│   │   ├── data/            # 本地数据
│   │   └── main.py          # 入口
│   └── requirements.txt
│
└── supabase/                # 数据库
    └── migrations/          # 迁移脚本
```

---

## 二、核心功能模块

### 模块1: 首页 (Landing)
- 项目Logo + Slogan
- "开始冒险" 按钮
- 城市选择下拉 (南京/西安/杭州/成都)

### 模块2: 角色与偏好选择 (Role Selection)
表单字段：
- 城市 (必选)
- 角色 (必选): 城市侦探、民国记者、非遗学徒、未来考古学家
- 兴趣 (多选): 历史、美食、建筑、非遗、悬疑
- 时长 (必选): 1小时/2小时/半天

### 模块3: AI剧本生成 (Script Generation)
输入: 用户偏好JSON
输出:
```json
{
  "script_id": "script_xxx",
  "title": "消失的老城信件",
  "role": "城市记忆调查员",
  "mission": "寻找一封藏在老城中的神秘信件",
  "nodes": [
    {
      "place_name": "老城门",
      "chapter": "第一章：城门下的暗号",
      "npc": "守城老人",
      "task": "找到城门石刻上的线索"
    }
  ]
}
```

### 模块4: 地图任务页 (Map Task)
- 高德地图显示4个任务点
- 点击标记显示任务卡片
- 任务状态: 已解锁/进行中/已完成
- 导航到NPC对话页面

### 模块5: AI NPC对话 (NPC Chat)
- 对话界面 (类似微信/短信风格)
- NPC头像 + 名称 + 角色设定
- 用户输入框
- AI回复 (基于RAG知识库)
- 完成任务按钮

### 模块6: 结局故事卡 (Story Card)
- 用户身份展示
- 探索路线回顾
- 遇见NPC列表
- 收集线索
- AI生成旅行故事 (200字)
- 3个关键词
- 分享按钮 (生成海报)

---

## 三、数据库设计 (Supabase)

### 表1: users (用户)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 表2: scripts (剧本)
```sql
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  city VARCHAR(50),
  title VARCHAR(200),
  role VARCHAR(100),
  mission TEXT,
  style VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 表3: script_nodes (剧情节点)
```sql
CREATE TABLE script_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id),
  place_name VARCHAR(100),
  chapter_title VARCHAR(200),
  npc_name VARCHAR(50),
  npc_persona TEXT,
  task TEXT,
  clue TEXT,
  order_index INT,
  status VARCHAR(20) DEFAULT 'locked' -- locked/active/completed
);
```

### 表4: conversations (对话记录)
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_node_id UUID REFERENCES script_nodes(id),
  role VARCHAR(20), -- user/npc
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 表5: knowledge_docs (文旅知识库) - 使用pgvector
```sql
CREATE TABLE knowledge_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_name VARCHAR(100),
  title VARCHAR(200),
  content TEXT,
  embedding vector(1536)
);

-- 创建向量索引
CREATE INDEX ON knowledge_docs USING ivfflat (embedding vector_cosine_ops);
```

---

## 四、后端API设计

### 1. 剧本生成
```http
POST /api/scripts/generate

Request:
{
  "city": "南京",
  "role": "民国记者",
  "interests": ["历史", "建筑"],
  "duration": "2小时"
}

Response:
{
  "script_id": "xxx",
  "title": "xxx",
  "mission": "xxx",
  "nodes": [...]
}
```

### 2. 获取剧本节点
```http
GET /api/scripts/{script_id}/nodes
```

### 3. NPC对话
```http
POST /api/npc/chat

Request:
{
  "script_node_id": "xxx",
  "message": "这里以前发生了什么？"
}

Response:
{
  "reply": "...",
  "unlocked_clue": "...",
  "task_completed": false
}
```

### 4. 完成任务
```http
POST /api/nodes/{node_id}/complete
```

### 5. 生成故事卡
```http
POST /api/story-card/generate

Request:
{
  "script_id": "xxx"
}

Response:
{
  "title": "...",
  "story": "...",
  "keywords": [...],
  "places_visited": [...],
  "npcs_met": [...]
}
```

---

## 五、AI Prompt 设计

### 5.1 剧本生成Prompt
```
你是一个文旅剧本策划师。
请根据用户偏好和城市，生成一个城市剧本游路线。

城市: {city}
角色: {role}
兴趣: {interests}
时长: {duration}

要求:
1. 输出严格JSON格式
2. 生成4个地点的剧本
3. 每个地点包含: 地点名、章节名、NPC名、任务、线索
4. 剧情可虚构，但文旅知识必须基于真实
5. 风格: 沉浸式悬疑

输出格式:
{
  "title": "剧本名",
  "mission": "核心任务",
  "nodes": [
    {
      "place_name": "地点",
      "chapter": "章节名",
      "npc": "NPC名",
      "npc_persona": "NPC角色设定",
      "task": "任务描述",
      "clue": "线索"
    }
  ]
}
```

### 5.2 NPC对话Prompt
```
你正在扮演城市剧本游NPC。

NPC: {npc_name}
身份: {npc_persona}
地点: {place_name}
当前任务: {task}

已知文化资料:
{retrieved_context}

要求:
1. 第一人称角色口吻
2. 有故事感，不胡编历史
3. 基于已知资料回答
4. 150字以内
5. 给出轻微引导
```

### 5.3 故事卡Prompt
```
根据用户完成的剧本游，生成旅行故事卡。

用户角色: {role}
探索地点: {places}
遇见NPC: {npcs}
收集线索: {clues}

输出:
{
  "title": "分享标题",
  "story": "200字故事",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}
```

---

## 六、开发阶段划分 (72小时)

### Day 1: 基础架构 + 核心流程
**目标**: 用户能走完角色选择→剧本生成

| 任务 | 负责人 |
|------|--------|
| 初始化Next.js项目 | 前端 |
| 初始化FastAPI项目 | 后端 |
| 配置Tailwind + shadcn/ui | 前端 |
| 实现首页 + 角色选择页 | 前端 |
| 准备南京4个地点数据 | 产品 |
| 实现剧本生成API | 后端+AI |
| 剧本结果展示页 | 前端 |

**验收标准**: 输入偏好 → 生成完整剧本JSON

### Day 2: 地图 + NPC对话
**目标**: Demo具备交互性

| 任务 | 负责人 |
|------|--------|
| 集成高德地图JS API | 前端 |
| 地图标记 + 弹窗组件 | 前端 |
| 实现节点状态管理 | 前端 |
| NPC对话API | 后端+AI |
| 对话界面UI | 前端 |
| 简化版RAG检索 | 后端 |
| 完成任务状态更新 | 前端+后端 |

**验收标准**: 地图显示4个点 → 点击对话 → 完成

### Day 3: 故事卡 + 路演
**目标**: 完整闭环 + 可展示

| 任务 | 负责人 |
|------|--------|
| 故事卡生成API | 后端+AI |
| 故事卡展示页面 | 前端 |
| 分享海报生成 (html2canvas) | 前端 |
| 动效优化 (Framer Motion) | 前端 |
| 3分钟路演PPT | 产品 |
| 1分钟演示视频 | 产品 |
| 部署测试 | 前端+后端 |

**验收标准**: 完整流程可演示 → 可分享故事卡

---

## 七、MVP功能优先级

### P0 (必须)
1. 首页
2. 角色选择 → 剧本生成
3. 地图任务展示
4. NPC对话
5. 故事卡

### P1 (可选)
1. 真实定位
2. 语音讲解
3. 用户登录
4. 进度保存

### P2 (暂不做)
1. AR功能
2. 支付系统
3. 多人协作
4. 复杂数据分析

---

## 八、关键文件清单

### 前端核心文件
- `frontend/src/app/page.tsx` - 首页
- `frontend/src/app/role/page.tsx` - 角色选择
- `frontend/src/app/script/page.tsx` - 剧本展示
- `frontend/src/app/map/page.tsx` - 地图任务
- `frontend/src/app/chat/page.tsx` - NPC对话
- `frontend/src/app/story-card/page.tsx` - 故事卡
- `frontend/src/components/Map.tsx` - 地图组件
- `frontend/src/stores/gameStore.ts` - 状态管理

### 后端核心文件
- `backend/app/main.py` - FastAPI入口
- `backend/app/api/scripts.py` - 剧本API
- `backend/app/api/npc.py` - NPC对话API
- `backend/app/api/story.py` - 故事卡API
- `backend/app/services/script_generator.py` - 剧本生成
- `backend/app/services/npc_chat.py` - NPC对话
- `backend/app/services/story_generator.py` - 故事卡生成
- `backend/app/prompts/` - AI提示词
- `backend/app/data/places.json` - 地点数据

---

## 九、验证方案

### 端到端测试
1. 打开首页 → 点击开始
2. 选择城市"南京" + 角色"民国记者" + 兴趣"历史"+"建筑" + 时长"2小时"
3. 点击生成剧本
4. 验证剧本包含4个节点
5. 点击地图第一个标记
6. 输入对话"你好"
7. 验证NPC回复
8. 点击完成任务
9. 验证解锁下一节点
10. 完成所有节点后生成故事卡
11. 验证故事卡包含: 标题、故事、关键词

### 部署验证
1. Vercel部署前端 → 访问无报错
2. Railway部署后端 → API响应正常
3. 前后端联调 → 跨域/网络正常