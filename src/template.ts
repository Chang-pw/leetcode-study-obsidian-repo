import { serializeFrontmatter } from './frontmatter.js';
import type { ProblemMetadata } from './types.js';

/**
 * 将题目数据渲染为完整的 Markdown 文件字符串。
 *
 * 生成结构：Frontmatter + 题目描述 + 解答区域（含代码块模板）+ 笔记区域（含复杂度提示）+ Obsidian 双向链接
 *
 * @param problem - 题目元数据
 * @param content - 题目描述内容（Markdown 格式）
 * @returns 完整的 Markdown 文件字符串
 */
export function renderProblemFile(problem: ProblemMetadata, content: string): string {
  const frontmatter = serializeFrontmatter(problem);

  const heading = `# ${problem.id}. ${problem.title}`;

  const description = `<h2 align="center">
  <em>📌 题目描述</em>
</h2>\n\n${content}`;

  const solution = [
    '<h2 align="center"><em>🚀 解答</em></h2>',
    '',
    '### 解法一',
    '',
    '```python',
    '# 在此编写你的解法',
    '```',
  ].join('\n');

  const notes = [
    '<h2 align="center"><em>📚 笔记</em></h2>',
    '',
    '- **时间复杂度**：',
    '- **空间复杂度**：',
    '- **关键思路**：',
  ].join('\n');

  const links = problem.tags.map((tag) => `[[${tag}]]`).join(' ');
  const linksSection = links ? `## 相关链接\n\n${links}` : '';

  const sections = [frontmatter, heading, '', description, '', solution, '', notes];
  if (linksSection) {
    sections.push('', linksSection);
  }
  sections.push('');

  return sections.join('\n');
}
