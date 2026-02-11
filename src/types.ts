/**
 * 数据模型类型定义
 * 定义项目中使用的所有核心接口和辅助类型
 */

/** 题目元数据，用于 Frontmatter 序列化/反序列化 */
export interface ProblemMetadata {
  /** LeetCode 题目编号 */
  id: number;
  /** 题目标题 */
  title: string;
  /** URL slug，用于文件命名 */
  slug: string;
  /** 难度等级 */
  difficulty: 'easy' | 'medium' | 'hard';
  /** 分类标签列表 */
  tags: string[];
  /** 导入日期，格式 YYYY-MM-DD */
  date: string;
}

/** LeetCode GraphQL API 响应中的题目数据 */
export interface LeetCodeProblem {
  /** 题目编号（字符串） */
  questionId: string;
  /** 英文标题 */
  title: string;
  /** 中文标题 */
  translatedTitle: string | null;
  /** URL slug */
  titleSlug: string;
  /** 难度（"Easy" / "Medium" / "Hard"） */
  difficulty: string;
  /** 分类标签 */
  topicTags: { name: string; slug: string; translatedName: string | null }[];
  /** 题目描述 HTML（英文） */
  content: string;
  /** 题目描述 HTML（中文） */
  translatedContent: string | null;
}

/** API 获取结果 */
export interface FetchResult {
  success: boolean;
  data?: LeetCodeProblem;
  error?: string;
}

/** 文件写入选项 */
export interface WriteOptions {
  overwrite: boolean;
}

/** 文件写入结果 */
export interface WriteResult {
  success: boolean;
  filePath: string;
  error?: string;
}
