import { describe, it, expect } from 'vitest';
import { renderProblemFile } from './template.js';
import type { ProblemMetadata } from './types.js';

const sampleProblem: ProblemMetadata = {
  id: 1,
  title: 'Two Sum',
  slug: 'two-sum',
  difficulty: 'easy',
  tags: ['array', 'hash-table'],
  date: '2024-01-01',
};

const sampleContent = 'Given an array of integers nums and an integer target...';

describe('renderProblemFile', () => {
  it('should contain valid frontmatter block delimited by ---', () => {
    const result = renderProblemFile(sampleProblem, sampleContent);
    expect(result).toMatch(/^---\n[\s\S]*?\n---\n/);
  });

  it('should include the problem heading with id and title', () => {
    const result = renderProblemFile(sampleProblem, sampleContent);
    expect(result).toContain('# 1. Two Sum');
  });

  it('should include 题目描述 section with content', () => {
    const result = renderProblemFile(sampleProblem, sampleContent);
    expect(result).toContain('📌 题目描述');
    expect(result).toContain(sampleContent);
  });

  it('should include 解答 section with code block template', () => {
    const result = renderProblemFile(sampleProblem, sampleContent);
    expect(result).toContain('🚀 解答');
    expect(result).toContain('### 解法一');
    expect(result).toContain('```python');
    expect(result).toContain('# 在此编写你的解法');
  });

  it('should include 笔记 section with complexity prompts', () => {
    const result = renderProblemFile(sampleProblem, sampleContent);
    expect(result).toContain('📚 笔记');
    expect(result).toContain('- **时间复杂度**：');
    expect(result).toContain('- **空间复杂度**：');
    expect(result).toContain('- **关键思路**：');
  });

  it('should include Obsidian double-bracket links for each tag', () => {
    const result = renderProblemFile(sampleProblem, sampleContent);
    expect(result).toContain('[[array]]');
    expect(result).toContain('[[hash-table]]');
  });

  it('should handle empty tags array without links section', () => {
    const noTagsProblem: ProblemMetadata = { ...sampleProblem, tags: [] };
    const result = renderProblemFile(noTagsProblem, sampleContent);
    expect(result).not.toContain('## 相关链接');
  });
});
