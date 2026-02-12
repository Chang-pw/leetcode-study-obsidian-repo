import { stringify, parse } from 'yaml';
import type { ProblemMetadata } from './types.js';

/**
 * 将题目元数据序列化为 YAML Frontmatter 块（以 `---` 分隔）
 */
export function serializeFrontmatter(metadata: ProblemMetadata): string {
  const yamlStr = stringify(metadata, { defaultStringType: 'PLAIN', defaultKeyType: 'PLAIN' });
  return `---\n${yamlStr}---\n`;
}

/**
 * 从 Markdown 文件内容中提取并解析 Frontmatter，返回 ProblemMetadata
 */
export function parseFrontmatter(content: string): ProblemMetadata {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('Frontmatter 解析失败: 未找到有效的 Frontmatter 块');
  }

  const raw = parse(match[1]) as Record<string, unknown>;

  if (
    typeof raw.id !== 'number' ||
    typeof raw.title !== 'string' ||
    typeof raw.slug !== 'string' ||
    typeof raw.difficulty !== 'string' ||
    !Array.isArray(raw.tags) ||
    typeof raw.date !== 'string'
  ) {
    throw new Error('Frontmatter 解析失败: 字段类型不匹配');
  }

  const difficulty = raw.difficulty as string;
  if (difficulty !== 'easy' && difficulty !== 'medium' && difficulty !== 'hard') {
    throw new Error(`Frontmatter 解析失败: 无效的难度值 "${difficulty}"`);
  }

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    difficulty,
    tags: raw.tags as string[],
    date: raw.date,
    url: typeof raw.url === 'string' ? raw.url : `https://leetcode.cn/problems/${raw.slug}/`,
  };
}
