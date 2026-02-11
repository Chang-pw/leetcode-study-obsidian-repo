import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * 初始化 Vault 目录结构
 * 创建 .obsidian 配置、README.md 首页、problems/ 和 indexes/ 目录
 */
export async function initVault(baseDir: string): Promise<void> {
  // 创建目录结构
  await mkdir(join(baseDir, '.obsidian'), { recursive: true });
  await mkdir(join(baseDir, 'problems'), { recursive: true });
  await mkdir(join(baseDir, 'indexes'), { recursive: true });

  // 写入 .obsidian/app.json 基础配置
  const appConfig = JSON.stringify({
    alwaysUpdateLinks: true,
    newFileLocation: 'folder',
    newFileFolderPath: 'problems',
  }, null, 2);
  await writeFile(join(baseDir, '.obsidian', 'app.json'), appConfig, 'utf-8');

  // 写入 README.md 首页
  const readme = `# LeetCode 刷题知识库

欢迎使用 LeetCode Obsidian Vault！本仓库用于管理你的 LeetCode 刷题记录，可直接作为 Obsidian Vault 打开使用。

## 使用说明

### 导入题目

\`\`\`bash
leetcode-vault import <题目编号>
\`\`\`

例如导入第 1 题：

\`\`\`bash
leetcode-vault import 1
\`\`\`

### 生成索引

\`\`\`bash
leetcode-vault index
\`\`\`

### 覆盖已有文件

\`\`\`bash
leetcode-vault --force import <题目编号>
\`\`\`

## 仓库结构

\`\`\`
.
├── .obsidian/           # Obsidian 配置目录
│   └── app.json
├── problems/            # 题目文件
│   ├── 0001-two-sum.md
│   └── ...
├── indexes/             # 索引页面
│   ├── by-difficulty.md # 按难度分组
│   └── by-category.md   # 按分类分组
└── README.md            # 本文件
\`\`\`

## 功能特性

- 自动从 LeetCode 导入题目信息
- 每道题目包含 **题目描述**、**解答区域** 和 **笔记区域**
- 使用 Obsidian 双向链接 \`[[]]\` 关联相关题目
- 按难度和分类自动生成索引页面
- Frontmatter 元数据支持 Obsidian 标签筛选
`;
  await writeFile(join(baseDir, 'README.md'), readme, 'utf-8');
}
