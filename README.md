# LeetCode Obsidian Vault

一个 CLI 工具，从 LeetCode 自动导入题目并生成 Obsidian 兼容的 Markdown 知识库。支持中文题目、中文标签、Hot 100 标记、章节学习笔记，以及自动生成索引页面。

## 功能

- 🚀 一键导入 LeetCode 题目（支持题目编号、URL、slug）
- 🇨🇳 中文标题、中文标签、中文题目描述（使用 leetcode.cn API）
- 🔥 自动标记 Hot 100 题目
- 📝 章节学习笔记模板（二叉树、动态规划等）
- 📊 自动生成索引（按难度、按分类、Hot 100）
- 🔗 Obsidian 双向链接，支持关系图谱浏览

## 安装

```bash
git clone https://github.com/your-username/leetcode-obsidian-repo.git
cd leetcode-obsidian-repo
npm install
npm run build
npm link
```

## 快速开始

### 1. 初始化 Vault

在你的 Obsidian Vault 目录下运行：

```bash
cd /path/to/your/obsidian-vault
leetcode-vault init
```

这会创建以下结构：

```
vault/
├── .obsidian/           # Obsidian 配置
│   └── app.json
├── problems/            # 题目文件（自动生成）
├── indexes/             # 索引页面（自动生成）
├── notes/               # 章节学习笔记（手动 + 模板）
└── README.md
```

### 2. 导入题目

```bash
# 通过题目编号
leetcode-vault import 1

# 通过 LeetCode 链接（直接粘贴）
leetcode-vault import "https://leetcode.cn/problems/two-sum/"

# 通过 slug
leetcode-vault import two-sum

# 覆盖已有文件
leetcode-vault --force import 1
```

导入后会在 `problems/` 下生成文件，例如 `0001-两数之和.md`：

```markdown
---
id: 1
title: 两数之和
slug: two-sum
difficulty: easy
tags: [数组, 哈希表, hot-100]
date: 2025-02-12
---

# 1. 两数之和

📌 题目描述
...

🚀 解答
### 解法一
（代码块模板）

📚 笔记
- 时间复杂度：
- 空间复杂度：
- 关键思路：

## 相关链接
[[数组]] [[哈希表]] [[hot-100]]
```

### 3. 创建学习笔记

```bash
leetcode-vault note 二叉树
leetcode-vault note 动态规划
```

会在 `notes/` 下生成带模板的笔记文件，包含核心概念、解题套路、相关题目等区域。在笔记中用 `[[0001-两数之和]]` 链接到题目，Obsidian 会自动建立双向关联。

### 4. 生成索引

```bash
leetcode-vault index
```

自动生成三个索引页面：
- `indexes/by-difficulty.md` — 按 Easy / Medium / Hard 分组
- `indexes/by-category.md` — 按算法分类分组（数组、动态规划、二叉树...）
- `indexes/hot-100.md` — LeetCode Hot 100 题目列表

## 在 Obsidian 中使用

### 打开 Vault

用 Obsidian 打开你运行 `leetcode-vault init` 的目录即可。

### 配合 Shell Commands 插件（推荐）

安装 [Shell Commands](https://github.com/Taitava/obsidian-shellcommands) 插件后，可以在 Obsidian 内直接导入题目：

1. 在插件设置中新建一个 Shell Command：

```bash
cd '/path/to/your/vault' && leetcode-vault --force import '{{clipboard}}' && leetcode-vault index
```

如果出现 `command not found` 可以加一句：
```bash
/bin/zsh -i -l -c "<code>"
```


2. 给这个命令绑定一个快捷键
3. 复制 LeetCode 题目链接 → 回到 Obsidian → 按快捷键 → 题目自动导入

### 推荐工作流

1. 看视频学习某个章节（如二叉树）
2. 运行 `leetcode-vault note 二叉树` 创建章节笔记
3. 遇到相关题目时，复制链接，用 Shell Command 快捷导入
4. 在题目文件中写解法和笔记，用 `[[二叉树]]` 链接回章节笔记
5. 在章节笔记中用 `[[0094-二叉树的中序遍历]]` 链接到题目
6. 定期运行 `leetcode-vault index` 更新索引

这样在 Obsidian 的关系图谱中，你能直观看到章节和题目之间的关联。

## 命令一览

| 命令 | 说明 |
|------|------|
| `leetcode-vault init` | 初始化 Vault 目录结构 |
| `leetcode-vault import <input>` | 导入题目（编号 / URL / slug） |
| `leetcode-vault note <name>` | 创建章节学习笔记 |
| `leetcode-vault index` | 重新生成索引页面 |
| `leetcode-vault --force import <input>` | 强制覆盖已有题目文件 |

## 开发

```bash
npm install
npm run build    # TypeScript 编译
npm test         # 运行测试
```

## 希望得到大佬的一颗🌟
