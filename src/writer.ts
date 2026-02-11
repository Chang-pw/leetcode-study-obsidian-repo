import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { WriteOptions, WriteResult } from './types.js';

/**
 * 将生成的 Markdown 写入文件系统
 * 自动创建父目录，处理文件已存在的情况
 */
export async function writeProblemFile(
  filePath: string,
  content: string,
  options: WriteOptions
): Promise<WriteResult> {
  try {
    // 自动创建父目录
    await mkdir(dirname(filePath), { recursive: true });

    // 检查文件是否已存在
    try {
      await access(filePath);
      // 文件存在
      if (!options.overwrite) {
        return {
          success: false,
          filePath,
          error: `文件已存在: ${filePath}，使用 --force 覆盖`,
        };
      }
    } catch {
      // 文件不存在，继续写入
    }

    await writeFile(filePath, content, 'utf-8');
    return { success: true, filePath };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      filePath,
      error: `无法写入文件: ${message}`,
    };
  }
}
