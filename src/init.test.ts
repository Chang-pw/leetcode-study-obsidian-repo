import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { initVault } from './init.js';

describe('initVault', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'vault-init-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should create .obsidian/app.json with valid JSON config', async () => {
    await initVault(tempDir);

    const content = await readFile(join(tempDir, '.obsidian', 'app.json'), 'utf-8');
    const config = JSON.parse(content);
    expect(config).toEqual({
      alwaysUpdateLinks: true,
      newFileLocation: 'folder',
      newFileFolderPath: 'problems',
    });
  });

  it('should create README.md with usage instructions', async () => {
    await initVault(tempDir);

    const content = await readFile(join(tempDir, 'README.md'), 'utf-8');
    expect(content).toContain('LeetCode');
    expect(content).toContain('leetcode-vault import');
    expect(content).toContain('leetcode-vault index');
    expect(content).toContain('problems/');
    expect(content).toContain('indexes/');
  });

  it('should create problems/ directory', async () => {
    await initVault(tempDir);

    await expect(access(join(tempDir, 'problems'))).resolves.toBeUndefined();
  });

  it('should create indexes/ directory', async () => {
    await initVault(tempDir);

    await expect(access(join(tempDir, 'indexes'))).resolves.toBeUndefined();
  });

  it('should create .obsidian/ directory', async () => {
    await initVault(tempDir);

    await expect(access(join(tempDir, '.obsidian'))).resolves.toBeUndefined();
  });

  it('should be idempotent (running twice does not throw)', async () => {
    await initVault(tempDir);
    await expect(initVault(tempDir)).resolves.toBeUndefined();
  });
});
