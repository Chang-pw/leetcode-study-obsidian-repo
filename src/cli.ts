#!/usr/bin/env node

/**
 * CLI 入口
 * 使用 commander 注册子命令：import, index, init
 */

import { Command } from 'commander';
import { join } from 'node:path';
import { fetchProblem, fetchProblemBySlug, mapToProblemMetadata } from './fetcher.js';
import { renderProblemFile } from './template.js';
import { writeProblemFile } from './writer.js';
import { generateFilename, parseInput } from './utils.js';
import { generateIndexes } from './indexer.js';
import { initVault } from './init.js';
import { createNote } from './note.js';

const program = new Command();

program
  .name('leetcode-vault')
  .description('CLI tool to import LeetCode problems into an Obsidian-compatible Markdown vault')
  .version('1.0.0')
  .option('--force', '覆盖已存在的文件', false);

program
  .command('import <input>')
  .description('导入 LeetCode 题目（支持题目编号、URL 或 slug）')
  .action(async (input: string) => {
    const force = program.opts().force as boolean;
    const cwd = process.cwd();
    const parsed = parseInput(input);

    console.log(`正在获取题目 ${input}...`);

    const result = parsed.type === 'id'
      ? await fetchProblem(parsed.value)
      : await fetchProblemBySlug(parsed.value);

    if (!result.success || !result.data) {
      console.error(result.error ?? '未知错误');
      process.exitCode = 1;
      return;
    }

    const metadata = mapToProblemMetadata(result.data);
    const problemContent = result.data.translatedContent ?? result.data.content;
    const content = renderProblemFile(metadata, problemContent);
    const filename = generateFilename(metadata.id, metadata.title);
    const filePath = join(cwd, 'problems', filename);

    const writeResult = await writeProblemFile(filePath, content, { overwrite: force });

    if (!writeResult.success) {
      console.error(writeResult.error);
      process.exitCode = 1;
      return;
    }

    console.log(`题目已导入: ${writeResult.filePath}`);
  });

program
  .command('index')
  .description('重新生成索引页面')
  .action(async () => {
    const cwd = process.cwd();
    const problemsDir = join(cwd, 'problems');
    const indexesDir = join(cwd, 'indexes');

    console.log('正在生成索引...');

    try {
      await generateIndexes(problemsDir, indexesDir);
      console.log('索引生成完成');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`索引生成失败: ${message}`);
      process.exitCode = 1;
    }
  });

program
  .command('init')
  .description('初始化 Vault 结构')
  .action(async () => {
    const cwd = process.cwd();

    console.log('正在初始化 Vault...');

    try {
      await initVault(cwd);
      console.log('Vault 初始化完成');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Vault 初始化失败: ${message}`);
      process.exitCode = 1;
    }
  });

program
  .command('note <name>')
  .description('创建章节学习笔记（如：leetcode-vault note 二叉树）')
  .action(async (name: string) => {
    const force = program.opts().force as boolean;
    const cwd = process.cwd();

    try {
      const filePath = await createNote(cwd, name, { overwrite: force });
      console.log(`笔记已创建: ${filePath}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(message);
      process.exitCode = 1;
    }
  });

program.parse();
