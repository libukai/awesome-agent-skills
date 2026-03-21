# Content Design Patterns

Skills share the same file format, but the logic inside varies enormously. These 5 patterns are recurring content structures found across the skill ecosystem — from engineering tools to content creation, research, and personal productivity.

The format problem is solved. The challenge now is content design.

## Choosing a Pattern

```
主要目的是注入知识/规范？
  → Tool Wrapper

主要目的是生成一致性输出？
  → Generator

主要目的是评审/打分？
  → Reviewer

需要先收集用户信息再执行？
  → Inversion（或在其他模式前加 Inversion 阶段）

需要严格顺序、不允许跳步？
  → Pipeline

以上都有？
  → 组合使用（见文末）
```

---

## Pattern 1: Tool Wrapper

**一句话**：把专业知识打包成按需加载的上下文，让 Claude 在需要时成为某个领域的专家。

### 何时用

- 你有一套规范、约定、或最佳实践，希望 Claude 在特定场景下遵守
- 知识量大，不适合全部放在 SKILL.md 里
- 不同任务只需要加载相关的知识子集

### 结构特征

```
SKILL.md
├── 触发条件（什么时候加载哪个 reference）
├── 核心规则（少量，最重要的）
└── references/
    ├── conventions.md    ← 完整规范
    ├── gotchas.md        ← 常见错误
    └── examples.md       ← 示例
```

关键：SKILL.md 告诉 Claude "什么时候读哪个文件"，而不是把所有内容塞进来。

### 示例

写作风格指南 skill：
```markdown
You are a writing style expert. Apply these conventions to the user's content.

## When Reviewing Content
1. Load 'references/style-guide.md' for complete writing conventions
2. Check against each rule
3. For each issue, cite the specific rule and suggest the fix

## When Writing New Content
1. Load 'references/style-guide.md'
2. Follow every convention exactly
3. Match the tone and voice defined in the guide
```

真实案例：`baoyu-article-illustrator` 的各个 style 文件（`references/styles/blueprint.md` 等）就是 Tool Wrapper 模式——只在需要某个风格时才加载对应文件。

---

## Pattern 2: Generator

**一句话**：用模板 + 风格指南确保每次输出结构一致，Claude 负责填充内容。

### 何时用

- 需要生成格式固定的文档、图片、代码
- 同类输出每次结构应该相同
- 有明确的模板可以复用

### 结构特征

```
SKILL.md
├── 步骤：加载模板 → 收集变量 → 填充 → 输出
└── assets/
    └── template.md    ← 输出模板
references/
    └── style-guide.md ← 风格规范
```

关键：模板放在 `assets/`，风格指南放在 `references/`，SKILL.md 只做协调。

### 示例

封面图生成 skill：
```markdown
Step 1: Load 'references/style-guide.md' for visual conventions.
Step 2: Load 'assets/prompt-template.md' for the image prompt structure.
Step 3: Ask the user for missing information:
  - Article title and topic
  - Preferred style (or auto-recommend based on content)
Step 4: Fill the template with article-specific content.
Step 5: Generate the image using the completed prompt.
```

真实案例：`obsidian-cover-image` 是典型的 Generator——分析文章内容，推荐风格，填充 prompt 模板，生成封面图。

---

## Pattern 3: Reviewer

**一句话**：把"检查什么"和"怎么检查"分离，用可替换的 checklist 驱动评审流程。

### 何时用

- 需要对内容/代码/设计进行系统性评审
- 评审标准可能随场景变化（换个 checklist 就换了评审维度）
- 需要结构化的输出（按严重程度分组、打分等）

### 结构特征

```
SKILL.md
├── 评审流程（固定）
└── references/
    └── review-checklist.md  ← 评审标准（可替换）
```

关键：流程是固定的，标准是可替换的。换一个 checklist 文件就得到完全不同的评审 skill。

### 示例

文章质量审查 skill：
```markdown
Step 1: Load 'references/review-checklist.md' for evaluation criteria.
Step 2: Read the article carefully. Understand its purpose before critiquing.
Step 3: Apply each criterion. For every issue found:
  - Note the location (section/paragraph)
  - Classify severity: critical / suggestion / minor
  - Explain WHY it's a problem
  - Suggest a specific fix
Step 4: Produce structured review:
  - Summary: overall quality assessment
  - Issues: grouped by severity
  - Score: 1-10 with justification
  - Top 3 recommendations
```

---

## Pattern 4: Inversion

**一句话**：翻转默认行为——不是用户驱动、Claude 执行，而是 Claude 先采访用户，收集完信息再动手。

### 何时用

- 任务需要大量上下文才能做好
- 用户往往说不清楚自己想要什么
- 做错了代价高（比如生成了大量内容后才发现方向不对）

### 结构特征

```
SKILL.md
├── Phase 1: 采访（逐个问题，等待回答）
│   └── 明确的门控条件：所有问题回答完才能继续
├── Phase 2: 确认（展示理解，让用户确认）
└── Phase 3: 执行（基于收集的信息）
```

关键：必须有明确的 gate condition——"DO NOT proceed until all questions are answered"。没有门控的 Inversion 会被 Claude 跳过。

### 示例

需求收集 skill：
```markdown
You are conducting a structured requirements interview.
DO NOT start building until all phases are complete.

## Phase 1 — Discovery (ask ONE question at a time, wait for each answer)
- Q1: "What problem does this solve for users?"
- Q2: "Who are the primary users?"
- Q3: "What does success look like?"

## Phase 2 — Confirm (only after Phase 1 is fully answered)
Summarize your understanding and ask: "Does this capture what you need?"
DO NOT proceed until user confirms.

## Phase 3 — Execute (only after confirmation)
[actual work here]
```

真实案例：`baoyu-article-illustrator` 的 Step 3（Confirm Settings）是 Inversion 模式——用 AskUserQuestion 收集 type、density、style 后才开始生成。

---

## Pattern 5: Pipeline

**一句话**：把复杂任务拆成有序步骤，每步有明确的完成条件，不允许跳步。

### 何时用

- 任务有严格的依赖顺序（步骤 B 依赖步骤 A 的输出）
- 某些步骤需要用户确认才能继续
- 跳步会导致严重错误

### 结构特征

```
SKILL.md
├── Step 1: [描述] → Gate: [完成条件]
├── Step 2: [描述] → Gate: [完成条件]
├── Step 3: [描述] → Gate: [完成条件]
└── ...
```

关键：每个步骤都有明确的 gate condition。"DO NOT proceed to Step N until [condition]" 是 Pipeline 的核心语法。

### 示例

文章发布流程 skill（`obsidian-to-x` 的简化版）：
```markdown
## Step 1 — Detect Content Type
Read the active file. Check frontmatter for title field.
- Has title → X Article workflow
- No title → Regular post workflow
DO NOT proceed until content type is determined.

## Step 2 — Convert Format
Run the appropriate conversion script.
DO NOT proceed if conversion fails.

## Step 3 — Preview
Show the converted content to the user.
Ask: "Does this look correct?"
DO NOT proceed until user confirms.

## Step 4 — Publish
Execute the publishing script.
```

真实案例：`obsidian-to-x` 和 `baoyu-article-illustrator` 都是 Pipeline——严格的步骤顺序，每步有明确的完成条件。

---

## 模式组合

模式不是互斥的，可以自由组合：

| 组合 | 适用场景 |
|------|---------|
| **Inversion + Generator** | 先采访收集变量，再填充模板生成输出 |
| **Inversion + Pipeline** | 先收集需求，再严格执行多步流程 |
| **Pipeline + Reviewer** | 流程末尾加一个自我审查步骤 |
| **Tool Wrapper + Pipeline** | 在流程的特定步骤按需加载专业知识 |

`baoyu-article-illustrator` 是 **Inversion + Pipeline**：Step 3 用 Inversion 收集设置，Step 4-6 用 Pipeline 严格执行生成流程。

`skill-creator-pro` 本身也是 **Inversion + Pipeline**：Phase 1 先采访用户，Phase 2-6 严格按顺序执行。

---

## 延伸阅读

- `design_principles.md` — 5 大设计原则
- `patterns.md` — 实现层模式（config.json、gotchas 等）
