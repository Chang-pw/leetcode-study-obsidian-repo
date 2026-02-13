# LeetCode Obsidian Vault

[中文文档](./README_CN.md)

A CLI tool that imports LeetCode problems and generates an Obsidian-compatible Markdown knowledge base. Supports Chinese titles/tags (via leetcode.cn API), Hot 100 tagging, study notes, and auto-generated indexes.

## Features

- Import LeetCode problems by ID, URL, or slug
- Chinese titles, tags, and descriptions (leetcode.cn API)
- Auto-tag Hot 100 problems
- Study note templates for topic-based learning (e.g., Binary Tree, DP)
- Auto-generated indexes (by difficulty, category, Hot 100)
- Obsidian bi-directional links for building a knowledge graph

## Installation

```bash
git clone https://github.com/Chang-pw/leetcode-study-obsidian-repo.git
cd leetcode-obsidian-repo
npm install
npm run build
npm link
```

## Quick Start

### 1. Initialize Vault

Run in your Obsidian vault directory:

```bash
cd /path/to/your/obsidian-vault
leetcode-vault init
```

This creates the following structure:

```
vault/
├── .obsidian/           # Obsidian config
│   └── app.json
├── problems/            # Problem files (auto-generated)
├── indexes/             # Index pages (auto-generated)
├── notes/               # Study notes (manual + template)
└── README.md
```

### 2. Import Problems

```bash
# By problem number
leetcode-vault import 1

# By LeetCode URL (paste directly)
leetcode-vault import "https://leetcode.cn/problems/two-sum/"

# By slug
leetcode-vault import two-sum

# Overwrite existing file
leetcode-vault --force import 1
```

This generates a file under `problems/`, e.g. `0001-两数之和.md`:

```markdown
---
id: 1
title: 两数之和
slug: two-sum
difficulty: easy
tags: [数组, 哈希表, hot-100]
date: 2025-02-12
url: https://leetcode.cn/problems/two-sum/
---

# 1. 两数之和

📌 题目描述
...

🚀 解答
### 解法一
(code block template)

📚 笔记
- 时间复杂度：
- 空间复杂度：
- 关键思路：

## 相关链接
[[数组]] [[哈希表]] [[hot-100]]
```

### 3. Create Study Notes

```bash
leetcode-vault note 二叉树       # Binary Tree
leetcode-vault note 动态规划     # Dynamic Programming
```

Generates a templated note under `notes/` with sections for core concepts, problem-solving patterns, and related problems. Use `[[0001-两数之和]]` to link to problems — Obsidian will create bi-directional links automatically.

### 4. Generate Indexes

```bash
leetcode-vault index
```

Auto-generates three index pages:
- `indexes/by-difficulty.md` — Grouped by Easy / Medium / Hard
- `indexes/by-category.md` — Grouped by algorithm category (Array, DP, Tree...)
- `indexes/hot-100.md` — LeetCode Hot 100 problem list

## Using with Obsidian

### Open Vault

Open the directory where you ran `leetcode-vault init` with Obsidian.

### Shell Commands Plugin (Recommended)

Install the [Shell Commands](https://github.com/Taitava/obsidian-shellcommands) plugin to import problems directly from within Obsidian:

1. Create a new Shell Command in the plugin settings:

```bash
cd '/path/to/your/vault' && leetcode-vault --force import '{{clipboard}}' && leetcode-vault index
```

If you get `command not found`, wrap it with:
```bash
/bin/zsh -i -l -c "<command above>"
```

2. Bind a hotkey to this command
3. Copy a LeetCode problem URL → switch to Obsidian → press hotkey → problem imported

### Recommended Workflow

1. Watch a tutorial on a topic (e.g., Binary Tree)
2. Run `leetcode-vault note 二叉树` to create a study note
3. When you encounter a related problem, copy the URL and import via Shell Command
4. Write your solution and notes in the problem file, link back with `[[二叉树]]`
5. In the study note, link to problems with `[[0094-二叉树的中序遍历]]`
6. Periodically run `leetcode-vault index` to refresh indexes

This way, Obsidian's graph view shows the connections between topics and problems at a glance.

## Commands

| Command | Description |
|---------|-------------|
| `leetcode-vault init` | Initialize vault directory structure |
| `leetcode-vault import <input>` | Import problem (number / URL / slug) |
| `leetcode-vault note <name>` | Create a study note |
| `leetcode-vault index` | Regenerate index pages |
| `leetcode-vault --force import <input>` | Force overwrite existing problem file |

## Development

```bash
npm install
npm run build    # TypeScript compilation
npm test         # Run tests
```

## If you find this useful, a ⭐ would be appreciated!
