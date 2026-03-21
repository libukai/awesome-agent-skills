# Implementation Patterns

可复用的实现模式，适用于任何领域的 skill。

---

## Pattern A: config.json 初始设置

### 何时用

Skill 需要用户提供个性化配置（账号、路径、偏好、API key 等），且这些配置在多次使用中保持不变。

### 标准流程

```
首次运行
  ↓
检查 config.json 是否存在
  ↓ 不存在
用 AskUserQuestion 收集配置
  ↓
写入 config.json
  ↓
继续执行主流程
```

### 检查逻辑

```bash
# 检查顺序（优先级从高到低）
1. {project-dir}/.{skill-name}/config.json   # 项目级
2. ~/.{skill-name}/config.json               # 用户级
```

### 示例 config.json 结构

```json
{
  "version": 1,
  "output_dir": "illustrations",
  "preferred_style": "notion",
  "watermark": {
    "enabled": false,
    "content": ""
  },
  "language": null
}
```

### 最佳实践

- 字段用 `snake_case`
- 必须有 `version` 字段，方便未来迁移
- 可选字段设合理默认值，不要强制用户填所有项
- 敏感信息（API key）不要存在 config.json，用环境变量
- 配置变更时提示用户当前值，让他们选择保留或修改

### 与 EXTEND.md 的区别

| | config.json | EXTEND.md |
|--|-------------|-----------|
| 格式 | 纯 JSON | YAML frontmatter + Markdown |
| 适合 | 结构化配置，脚本读取 | 需要注释说明的复杂配置 |
| 可读性 | 机器友好 | 人类友好 |
| 推荐场景 | 大多数情况 | 配置项需要大量说明时 |

---

## Pattern B: Gotchas 章节

### 何时用

所有 skill 都应该有。这是 skill 中信息密度最高的部分——记录 Claude 在真实使用中反复犯的错误。

### 结构模板

```markdown
## Gotchas

- **[问题简述]**: [具体描述] → [正确做法]
- **[问题简述]**: [具体描述] → [正确做法]
```

### 示例

```markdown
## Gotchas

- **不要字面翻译隐喻**: 文章说"用电锯切西瓜"时，不要画电锯和西瓜，
  要可视化背后的概念（高效/暴力/不匹配）
- **prompt 文件必须先保存**: 不要直接把 prompt 文本传给生成命令，
  必须先写入文件再引用文件路径
- **路径锁定**: 获取当前文件路径后立即保存到变量，
  不要在后续步骤重新获取（workspace.json 会随 Obsidian 操作变化）
```

### 维护原则

- 遇到 Claude 反复犯的错误，立即追加
- 每条 gotcha 要有"为什么"和"怎么做"，不只是"不要做 X"
- 定期回顾，删除已经不再出现的问题
- 把 gotchas 当作 skill 的"活文档"，不是一次性写完的

---

## Pattern C: 脚本复用

### 何时用

在 eval transcript 里发现 Claude 在多次运行中反复写了相同的辅助代码。

### 识别信号

运行 3 个测试用例后，检查 transcript：
- 3 个测试都写了类似的 `parse_outline.py`？
- 每次都重新实现相同的文件命名逻辑？
- 反复构造相同格式的 API 请求？

这些都是"应该提取到 `scripts/` 的信号"。

### 提取步骤

1. 从 transcript 中找出重复的代码模式
2. 提取成通用脚本，放入 `scripts/`
3. 在 SKILL.md 中明确告知 Claude 使用它：
   ```markdown
   Use `scripts/build-batch.ts` to generate the batch file.
   DO NOT rewrite this logic inline.
   ```
4. 重新运行测试，验证 Claude 确实使用了脚本而不是重写

### 好处

- 每次调用不再重复造轮子，节省 token
- 脚本经过测试，比 Claude 即兴生成的代码更可靠
- 逻辑集中在一处，维护更容易

---

## Pattern D: 数据存储与记忆

### 何时用

Skill 需要跨会话记忆（如记录历史操作、积累用户偏好、追踪状态）。

### 三种方案对比

| 方案 | 适用场景 | 复杂度 |
|------|---------|--------|
| Append-only log | 简单历史记录，只追加 | 低 |
| JSON 文件 | 结构化状态，需要读写 | 低 |
| SQLite | 复杂查询，大量数据 | 高 |

### 存储位置

```bash
# ✅ 推荐：稳定目录，插件升级不会删除
${CLAUDE_PLUGIN_DATA}/{skill-name}/

# ❌ 避免：skill 目录，插件升级时会被覆盖
.claude/skills/{skill-name}/data/
```

### 示例：append-only log

```bash
# 追加记录
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | published | ${ARTICLE_PATH}" \
  >> "${CLAUDE_PLUGIN_DATA}/obsidian-to-x/history.log"

# 读取最近 10 条
tail -10 "${CLAUDE_PLUGIN_DATA}/obsidian-to-x/history.log"
```

### 示例：JSON 状态文件

```json
{
  "last_run": "2026-03-20T10:00:00Z",
  "total_published": 42,
  "preferred_style": "notion"
}
```

---

## Pattern E: 按需钩子

### 何时用

需要在 skill 激活期间拦截特定操作，但不希望这个拦截一直生效（会影响其他工作）。

### 概念

Skill 被调用时注册钩子，整个会话期间生效。用户主动调用才激活，不会干扰日常工作。

### 典型场景

```markdown
# /careful skill
激活后，拦截所有包含以下内容的 Bash 命令：
- rm -rf
- DROP TABLE
- force-push / --force
- kubectl delete

拦截时提示用户确认，而不是直接执行。
适合：知道自己在操作生产环境时临时开启。
```

```markdown
# /freeze skill
激活后，阻止对指定目录之外的任何 Edit/Write 操作。
适合：调试时"我只想加日志，不想不小心改了其他文件"。
```

### 实现方式

在 SKILL.md 中声明 PreToolUse 钩子：

```yaml
hooks:
  - type: PreToolUse
    matcher: "Bash"
    action: intercept_dangerous_commands
```

详见 Claude Code hooks 文档。

---

## 延伸阅读

- `content-patterns.md` — 5 种内容结构模式
- `design_principles.md` — 5 大设计原则
