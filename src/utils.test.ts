import { describe, it, expect } from 'vitest';
import { generateFilename, parseInput } from './utils.js';

describe('generateFilename', () => {
  it('should zero-pad single digit ids to 4 digits', () => {
    expect(generateFilename(1, '两数之和')).toBe('0001-两数之和.md');
  });

  it('should zero-pad double digit ids to 4 digits', () => {
    expect(generateFilename(15, '三数之和')).toBe('0015-三数之和.md');
  });

  it('should not pad 4-digit ids', () => {
    expect(generateFilename(1234, '某题目')).toBe('1234-某题目.md');
  });

  it('should produce .md extension', () => {
    const result = generateFilename(42, '测试');
    expect(result.endsWith('.md')).toBe(true);
  });
});

describe('parseInput', () => {
  it('should parse pure number as id', () => {
    expect(parseInput('1')).toEqual({ type: 'id', value: '1' });
    expect(parseInput('2999')).toEqual({ type: 'id', value: '2999' });
  });

  it('should parse leetcode.com URL and extract slug', () => {
    expect(parseInput('https://leetcode.com/problems/two-sum/')).toEqual({
      type: 'slug', value: 'two-sum',
    });
  });

  it('should parse leetcode.cn URL and extract slug', () => {
    expect(parseInput('https://leetcode.cn/problems/two-sum/description/')).toEqual({
      type: 'slug', value: 'two-sum',
    });
  });

  it('should parse URL without trailing slash', () => {
    expect(parseInput('https://leetcode.com/problems/3sum')).toEqual({
      type: 'slug', value: '3sum',
    });
  });

  it('should treat non-numeric non-URL input as slug', () => {
    expect(parseInput('two-sum')).toEqual({ type: 'slug', value: 'two-sum' });
  });

  it('should trim whitespace', () => {
    expect(parseInput('  1  ')).toEqual({ type: 'id', value: '1' });
  });

  it('should handle zsh-escaped URLs with backslashes', () => {
    expect(parseInput('https\\:\\/\\/leetcode\\.cn\\/problems\\/two\\-sum\\/')).toEqual({
      type: 'slug', value: 'two-sum',
    });
  });
});
