import { readdir, readFile, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { parseFrontmatter } from './frontmatter.js';
import type { ProblemMetadata } from './types.js';

/**
 * 扫描 problems/ 目录下所有 .md 文件，读取 Frontmatter 并返回元数据列表
 */
async function scanProblems(problemsDir: string): Promise<ProblemMetadata[]> {
  const entries = await readdir(problemsDir);
  const mdFiles = entries.filter((f) => f.endsWith('.md')).sort();

  const results: ProblemMetadata[] = [];
  for (const file of mdFiles) {
    const content = await readFile(join(problemsDir, file), 'utf-8');
    try {
      const metadata = parseFrontmatter(content);
      results.push(metadata);
    } catch {
      // Skip files with invalid frontmatter
    }
  }
  return results;
}

/**
 * 生成按难度分组的索引 Markdown 内容
 */
function renderDifficultyIndex(problems: ProblemMetadata[]): string {
  const groups: Record<string, ProblemMetadata[]> = {
    easy: [],
    medium: [],
    hard: [],
  };

  for (const p of problems) {
    if (groups[p.difficulty]) {
      groups[p.difficulty].push(p);
    }
  }

  // Sort each group by id
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.id - b.id);
  }

  const lines: string[] = ['# 按难度分组', ''];

  const labels: Record<string, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  };

  for (const difficulty of ['easy', 'medium', 'hard'] as const) {
    lines.push(`## ${labels[difficulty]}`, '');
    const items = groups[difficulty];
    if (items.length === 0) {
      lines.push('暂无题目', '');
    } else {
      for (const p of items) {
        const filename = `${String(p.id).padStart(4, '0')}-${p.title}`;
        lines.push(`- [[${filename}|${p.id}. ${p.title}]]`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * 生成按分类标签分组的索引 Markdown 内容
 */
function renderCategoryIndex(problems: ProblemMetadata[]): string {
  const groups: Record<string, ProblemMetadata[]> = {};

  for (const p of problems) {
    for (const tag of p.tags) {
      // Skip difficulty tags and hot-100 since they have their own indexes
      if (tag === 'easy' || tag === 'medium' || tag === 'hard' || tag === 'hot-100') continue;
      if (!groups[tag]) {
        groups[tag] = [];
      }
      groups[tag].push(p);
    }
  }

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groups).sort();

  // Sort problems within each category by id
  for (const cat of sortedCategories) {
    groups[cat].sort((a, b) => a.id - b.id);
  }

  const lines: string[] = ['# 按分类分组', ''];

  if (sortedCategories.length === 0) {
    lines.push('暂无分类', '');
  } else {
    for (const category of sortedCategories) {
      lines.push(`## ${category}`, '');
      for (const p of groups[category]) {
        const filename = `${String(p.id).padStart(4, '0')}-${p.title}`;
        lines.push(`- [[${filename}|${p.id}. ${p.title}]]`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * 扫描 problems/ 目录，生成按难度和分类分组的索引页面
 */
export async function generateIndexes(
  problemsDir: string,
  indexesDir: string,
): Promise<void> {
  // Ensure indexes directory exists
  await mkdir(indexesDir, { recursive: true });

  const problems = await scanProblems(problemsDir);

  const difficultyContent = renderDifficultyIndex(problems);
  const categoryContent = renderCategoryIndex(problems);
  const hot100Content = renderHot100Index(problems);

  await writeFile(join(indexesDir, 'by-difficulty.md'), difficultyContent, 'utf-8');
  await writeFile(join(indexesDir, 'by-category.md'), categoryContent, 'utf-8');
  await writeFile(join(indexesDir, 'hot-100.md'), hot100Content, 'utf-8');
}
/**
 * 生成 Hot 100 索引 Markdown 内容
 */
function renderHot100Index(problems: ProblemMetadata[]): string {
  const hot100 = problems
    .filter((p) => p.tags.includes('hot-100'))
    .sort((a, b) => a.id - b.id);

  const lines: string[] = ['# LeetCode Hot 100', ''];

  if (hot100.length === 0) {
    lines.push('暂无 Hot 100 题目', '');
  } else {
    for (const p of hot100) {
      const filename = `${String(p.id).padStart(4, '0')}-${p.title}`;
      lines.push(`- [[${filename}|${p.id}. ${p.title}]]`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
