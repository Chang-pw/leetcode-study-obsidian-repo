import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeProblemFile } from './writer.js';
import { mkdtemp, rm, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('writeProblemFile', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'writer-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should write file when it does not exist', async () => {
    const filePath = join(tempDir, 'problems', '0001-two-sum.md');
    const result = await writeProblemFile(filePath, '# Test', { overwrite: false });
    expect(result.success).toBe(true);
    const content = await readFile(filePath, 'utf-8');
    expect(content).toBe('# Test');
  });

  it('should not overwrite existing file by default', async () => {
    const filePath = join(tempDir, '0001-two-sum.md');
    await writeFile(filePath, 'original', 'utf-8');
    const result = await writeProblemFile(filePath, 'new content', { overwrite: false });
    expect(result.success).toBe(false);
    expect(result.error).toContain('文件已存在');
    const content = await readFile(filePath, 'utf-8');
    expect(content).toBe('original');
  });

  it('should overwrite existing file when force is true', async () => {
    const filePath = join(tempDir, '0001-two-sum.md');
    await writeFile(filePath, 'original', 'utf-8');
    const result = await writeProblemFile(filePath, 'new content', { overwrite: true });
    expect(result.success).toBe(true);
    const content = await readFile(filePath, 'utf-8');
    expect(content).toBe('new content');
  });

  it('should auto-create parent directories', async () => {
    const filePath = join(tempDir, 'a', 'b', 'c', 'test.md');
    const result = await writeProblemFile(filePath, 'deep', { overwrite: false });
    expect(result.success).toBe(true);
    const content = await readFile(filePath, 'utf-8');
    expect(content).toBe('deep');
  });
});
