import { describe, it, expect } from 'vitest';
import { serializeFrontmatter, parseFrontmatter } from './frontmatter.js';
import type { ProblemMetadata } from './types.js';

const sampleMetadata: ProblemMetadata = {
  id: 1,
  title: 'Two Sum',
  slug: 'two-sum',
  difficulty: 'easy',
  tags: ['array', 'hash-table'],
  date: '2024-01-15',
};

describe('serializeFrontmatter', () => {
  it('should wrap YAML in --- delimiters', () => {
    const result = serializeFrontmatter(sampleMetadata);
    expect(result).toMatch(/^---\n[\s\S]*\n---\n$/);
  });

  it('should include all metadata fields', () => {
    const result = serializeFrontmatter(sampleMetadata);
    expect(result).toContain('id: 1');
    expect(result).toContain('title: Two Sum');
    expect(result).toContain('slug: two-sum');
    expect(result).toContain('difficulty: easy');
    expect(result).toContain('date: 2024-01-15');
    expect(result).toContain('array');
    expect(result).toContain('hash-table');
  });

  it('should handle empty tags array', () => {
    const meta: ProblemMetadata = { ...sampleMetadata, tags: [] };
    const result = serializeFrontmatter(meta);
    expect(result).toContain('tags: []');
  });
});

describe('parseFrontmatter', () => {
  it('should parse frontmatter from markdown content', () => {
    const content = serializeFrontmatter(sampleMetadata) + '\n# Two Sum\n\nSome content';
    const parsed = parseFrontmatter(content);
    expect(parsed).toEqual(sampleMetadata);
  });

  it('should throw on missing frontmatter', () => {
    expect(() => parseFrontmatter('# No frontmatter')).toThrow('未找到有效的 Frontmatter 块');
  });

  it('should throw on invalid difficulty', () => {
    const content = '---\nid: 1\ntitle: Test\nslug: test\ndifficulty: unknown\ntags: []\ndate: "2024-01-01"\n---\n';
    expect(() => parseFrontmatter(content)).toThrow('无效的难度值');
  });

  it('should throw on missing fields', () => {
    const content = '---\nid: 1\ntitle: Test\n---\n';
    expect(() => parseFrontmatter(content)).toThrow('字段类型不匹配');
  });

  it('should handle all difficulty levels', () => {
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      const meta: ProblemMetadata = { ...sampleMetadata, difficulty: diff };
      const content = serializeFrontmatter(meta);
      expect(parseFrontmatter(content).difficulty).toBe(diff);
    }
  });
});

describe('round-trip', () => {
  it('should produce equivalent object after serialize then parse', () => {
    const serialized = serializeFrontmatter(sampleMetadata);
    const parsed = parseFrontmatter(serialized);
    expect(parsed).toEqual(sampleMetadata);
  });

  it('should round-trip with special characters in title', () => {
    const meta: ProblemMetadata = {
      ...sampleMetadata,
      title: "3Sum Closest (Two Pointers)",
      slug: '3sum-closest',
      id: 16,
    };
    const parsed = parseFrontmatter(serializeFrontmatter(meta));
    expect(parsed).toEqual(meta);
  });
});
