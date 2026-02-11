/**
 * 工具函数
 */

/**
 * 生成题目文件名，格式为 `{四位零填充编号}-{title}.md`
 *
 * @param id - LeetCode 题目编号（正整数）
 * @param title - 题目标题（中文）
 * @returns 格式化的文件名
 */
export function generateFilename(id: number, title: string): string {
  const paddedId = String(id).padStart(4, '0');
  return `${paddedId}-${title}.md`;
}

export type ParsedInput =
  | { type: 'id'; value: string }
  | { type: 'slug'; value: string };

/**
 * 解析用户输入，支持以下格式：
 * - 纯数字：题目编号，如 "1"
 * - LeetCode URL：如 "https://leetcode.com/problems/two-sum/"
 * - LeetCode CN URL：如 "https://leetcode.cn/problems/two-sum/"
 * - slug：如 "two-sum"
 *
 * 自动清理 shell 转义字符（zsh 可能会在 URL 中插入反斜杠）
 */
export function parseInput(input: string): ParsedInput {
  // 清理 shell 转义字符
  const trimmed = input.trim().replace(/\\/g, '');

  // 纯数字 → 题目编号
  if (/^\d+$/.test(trimmed)) {
    return { type: 'id', value: trimmed };
  }

  // LeetCode URL → 提取 slug
  const urlMatch = trimmed.match(
    /^https?:\/\/leetcode\.(?:com|cn)\/problems\/([a-z0-9-]+)/i
  );
  if (urlMatch) {
    return { type: 'slug', value: urlMatch[1].toLowerCase() };
  }

  // 其他情况当作 slug
  return { type: 'slug', value: trimmed.toLowerCase() };
}
