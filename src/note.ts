import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * 创建章节学习笔记
 */
export async function createNote(
  baseDir: string,
  name: string,
  options: { overwrite: boolean }
): Promise<string> {
  const notesDir = join(baseDir, 'notes');
  await mkdir(notesDir, { recursive: true });

  const filePath = join(notesDir, `${name}.md`);

  // 检查文件是否已存在
  try {
    await access(filePath);
    if (!options.overwrite) {
      throw new Error(`文件已存在: ${filePath}，使用 --force 覆盖`);
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith('文件已存在')) {
      throw err;
    }
    // 文件不存在，继续
  }

  const today = new Date().toISOString().slice(0, 10);

  const content = `---
title: ${name}
date: ${today}
tags: [${name}]
---

# ${name}

<h2 align="center">
  <em>核心概念</em>


<h2 align="center">
  <em>解题套路 / 模板代码</em>

\`\`\`python

\`\`\`

<h2 align="center">
  <em>相关题目</em>

- [[]] - 
- [[]] - 
- [[]] - 

`;

  await writeFile(filePath, content, 'utf-8');
  return filePath;
}
