import { describe, it, expect, vi, afterEach } from 'vitest';
import { mapToProblemMetadata, fetchProblemBySlug } from './fetcher.js';
import type { LeetCodeProblem } from './types.js';

const sampleProblem: LeetCodeProblem = {
  questionId: '1',
  title: 'Two Sum',
  translatedTitle: '两数之和',
  titleSlug: 'two-sum',
  difficulty: 'Easy',
  topicTags: [
    { name: 'Array', slug: 'array', translatedName: '数组' },
    { name: 'Hash Table', slug: 'hash-table', translatedName: '哈希表' },
  ],
  content: '<p>Given an array of integers...</p>',
  translatedContent: '<p>给定一个整数数组 nums...</p>',
};

describe('mapToProblemMetadata', () => {
  it('should map questionId to numeric id', () => {
    const result = mapToProblemMetadata(sampleProblem);
    expect(result.id).toBe(1);
  });

  it('should use translatedTitle (Chinese) when available', () => {
    const result = mapToProblemMetadata(sampleProblem);
    expect(result.title).toBe('两数之和');
    expect(result.slug).toBe('two-sum');
  });

  it('should fall back to English title when translatedTitle is null', () => {
    const problem: LeetCodeProblem = { ...sampleProblem, translatedTitle: null };
    const result = mapToProblemMetadata(problem);
    expect(result.title).toBe('Two Sum');
  });

  it('should convert difficulty to lowercase', () => {
    expect(mapToProblemMetadata({ ...sampleProblem, difficulty: 'Easy' }).difficulty).toBe('easy');
    expect(mapToProblemMetadata({ ...sampleProblem, difficulty: 'Medium' }).difficulty).toBe('medium');
    expect(mapToProblemMetadata({ ...sampleProblem, difficulty: 'Hard' }).difficulty).toBe('hard');
  });

  it('should extract Chinese tag names from topicTags', () => {
    const result = mapToProblemMetadata(sampleProblem);
    expect(result.tags).toContain('数组');
    expect(result.tags).toContain('哈希表');
  });

  it('should add hot-100 tag for Hot 100 problems', () => {
    // questionId '1' (Two Sum) is in Hot 100
    const result = mapToProblemMetadata(sampleProblem);
    expect(result.tags).toContain('hot-100');
  });

  it('should not add hot-100 tag for non-Hot-100 problems', () => {
    const problem: LeetCodeProblem = { ...sampleProblem, questionId: '9999' };
    const result = mapToProblemMetadata(problem);
    expect(result.tags).not.toContain('hot-100');
  });

  it('should handle empty topicTags', () => {
    const problem: LeetCodeProblem = { ...sampleProblem, topicTags: [] };
    const result = mapToProblemMetadata(problem);
    // Still has hot-100 because questionId 1 is in Hot 100
    expect(result.tags).toEqual(['hot-100']);
  });

  it('should set date to today in YYYY-MM-DD format', () => {
    const result = mapToProblemMetadata(sampleProblem);
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should generate leetcode.cn url from slug', () => {
    const result = mapToProblemMetadata(sampleProblem);
    expect(result.url).toBe('https://leetcode.cn/problems/two-sum/');
  });
});

describe('fetchProblemBySlug', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should return success with data on valid response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { question: sampleProblem } }),
    });

    const result = await fetchProblemBySlug('two-sum');
    expect(result.success).toBe(true);
    expect(result.data!.translatedTitle).toBe('两数之和');
    expect(result.data!.translatedContent).toBe('<p>给定一个整数数组 nums...</p>');
  });

  it('should return error when problem does not exist', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { question: null } }),
    });

    const result = await fetchProblemBySlug('nonexistent');
    expect(result.success).toBe(false);
    expect(result.error).toContain('不存在');
  });

  it('should return error on HTTP failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    const result = await fetchProblemBySlug('two-sum');
    expect(result.success).toBe(false);
    expect(result.error).toContain('网络请求失败');
  });

  it('should return error on network failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('fetch failed'));

    const result = await fetchProblemBySlug('two-sum');
    expect(result.success).toBe(false);
    expect(result.error).toContain('fetch failed');
  });
});
