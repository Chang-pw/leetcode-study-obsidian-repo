import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { serializeFrontmatter } from './frontmatter.js';
import { generateIndexes } from './indexer.js';
import type { ProblemMetadata } from './types.js';

async function createProblemFile(dir: string, meta: ProblemMetadata, body = ''): Promise<void> {
  const filename = `${String(meta.id).padStart(4, '0')}-${meta.title}.md`;
  const content = serializeFrontmatter(meta) + '\n' + body;
  await writeFile(join(dir, filename), content, 'utf-8');
}

describe('generateIndexes', () => {
  let tmpDir: string;
  let problemsDir: string;
  let indexesDir: string;

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'indexer-test-'));
    problemsDir = join(tmpDir, 'problems');
    indexesDir = join(tmpDir, 'indexes');
    await mkdir(problemsDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it('should create indexes directory if it does not exist', async () => {
    await generateIndexes(problemsDir, indexesDir);
    const diff = await readFile(join(indexesDir, 'by-difficulty.md'), 'utf-8');
    expect(diff).toContain('# 按难度分组');
  });

  it('should generate by-difficulty.md with correct grouping', async () => {
    const problems: ProblemMetadata[] = [
      { id: 1, title: '两数之和', slug: 'two-sum', difficulty: 'easy', tags: ['数组', '哈希表'], date: '2024-01-01' },
      { id: 15, title: '三数之和', slug: '3sum', difficulty: 'medium', tags: ['数组', '双指针'], date: '2024-01-02' },
      { id: 42, title: '接雨水', slug: 'trapping-rain-water', difficulty: 'hard', tags: ['栈', '动态规划'], date: '2024-01-03' },
    ];
    for (const p of problems) await createProblemFile(problemsDir, p);

    await generateIndexes(problemsDir, indexesDir);
    const content = await readFile(join(indexesDir, 'by-difficulty.md'), 'utf-8');

    expect(content).toContain('## Easy');
    expect(content).toContain('## Medium');
    expect(content).toContain('## Hard');
    expect(content).toContain('[[0001-两数之和|1. 两数之和]]');
    expect(content).toContain('[[0015-三数之和|15. 三数之和]]');
    expect(content).toContain('[[0042-接雨水|42. 接雨水]]');
  });

  it('should generate by-category.md with correct grouping', async () => {
    const problems: ProblemMetadata[] = [
      { id: 1, title: '两数之和', slug: 'two-sum', difficulty: 'easy', tags: ['数组', '哈希表'], date: '2024-01-01' },
      { id: 15, title: '三数之和', slug: '3sum', difficulty: 'medium', tags: ['数组', '双指针'], date: '2024-01-02' },
    ];
    for (const p of problems) await createProblemFile(problemsDir, p);

    await generateIndexes(problemsDir, indexesDir);
    const content = await readFile(join(indexesDir, 'by-category.md'), 'utf-8');

    expect(content).toContain('## 数组');
    expect(content).toContain('## 哈希表');
    expect(content).toContain('## 双指针');
  });

  it('should handle empty problems directory', async () => {
    await generateIndexes(problemsDir, indexesDir);
    const diff = await readFile(join(indexesDir, 'by-difficulty.md'), 'utf-8');
    const cat = await readFile(join(indexesDir, 'by-category.md'), 'utf-8');
    expect(diff).toContain('暂无题目');
    expect(cat).toContain('暂无分类');
  });

  it('should generate hot-100.md index', async () => {
    const problems: ProblemMetadata[] = [
      { id: 1, title: '两数之和', slug: 'two-sum', difficulty: 'easy', tags: ['数组', 'hot-100'], date: '2024-01-01' },
      { id: 9999, title: '非热门题', slug: 'not-hot', difficulty: 'easy', tags: ['数组'], date: '2024-01-02' },
    ];
    for (const p of problems) await createProblemFile(problemsDir, p);

    await generateIndexes(problemsDir, indexesDir);
    const content = await readFile(join(indexesDir, 'hot-100.md'), 'utf-8');

    expect(content).toContain('[[0001-两数之和|1. 两数之和]]');
    expect(content).not.toContain('非热门题');
  });
});
