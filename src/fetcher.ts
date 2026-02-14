/**
 * LeetCode GraphQL Fetcher
 * 使用 leetcode.cn API 获取中文题目数据
 */

import type { LeetCodeProblem, FetchResult, ProblemMetadata } from './types.js';
import { isHot100 } from './hot100.js';

const LEETCODE_GRAPHQL_ENDPOINT = 'https://leetcode.cn/graphql';

const PROBLEM_QUERY = `
  query getQuestionDetail($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      translatedTitle
      titleSlug
      difficulty
      topicTags {
        name
        slug
        translatedName
      }
      content
      translatedContent
    }
  }
`;

/**
 * 将 LeetCodeProblem 映射为 ProblemMetadata
 * 优先使用中文标题
 */
export function mapToProblemMetadata(problem: LeetCodeProblem): ProblemMetadata {
  const id = parseInt(problem.questionId, 10);
  const tags = problem.topicTags.map((tag) => tag.translatedName ?? tag.name);
  if (isHot100(id)) {
    tags.push('hot-100');
  }
  return {
    id,
    title: problem.translatedTitle ?? problem.title,
    slug: problem.titleSlug,
    difficulty: problem.difficulty.toLowerCase() as ProblemMetadata['difficulty'],
    tags,
    date: new Date().toISOString().slice(0, 10),
    url: `https://leetcode.cn/problems/${problem.titleSlug}/`,
  };
}

/**
 * 解析 API 响应中的 question 对象
 */
function parseQuestion(question: Record<string, unknown>): LeetCodeProblem | null {
  if (
    typeof question.questionId !== 'string' ||
    typeof question.title !== 'string' ||
    typeof question.titleSlug !== 'string' ||
    typeof question.difficulty !== 'string' ||
    !Array.isArray(question.topicTags)
  ) {
    return null;
  }

  return {
    questionId: question.questionId,
    title: question.title,
    translatedTitle: (question.translatedTitle as string) ?? null,
    titleSlug: question.titleSlug,
    difficulty: question.difficulty,
    topicTags: question.topicTags as LeetCodeProblem['topicTags'],
    content: (question.content as string) ?? '',
    translatedContent: (question.translatedContent as string) ?? null,
  };
}

/**
 * 通过 titleSlug 从 leetcode.cn GraphQL API 获取题目数据（中文）
 */
export async function fetchProblemBySlug(titleSlug: string): Promise<FetchResult> {
  try {
    const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: PROBLEM_QUERY,
        variables: { titleSlug },
      }),
    });

    if (!response.ok) {
      return { success: false, error: `网络请求失败: HTTP ${response.status}` };
    }

    const json = await response.json();

    if (json.errors) {
      return { success: false, error: 'API 响应格式异常' };
    }

    const question = json?.data?.question;
    if (!question) {
      return { success: false, error: `题目 "${titleSlug}" 不存在` };
    }

    const data = parseQuestion(question);
    if (!data) {
      return { success: false, error: 'API 响应格式异常' };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `网络请求失败: ${message}` };
  }
}

/**
 * 通过题目编号获取题目（先查 slug 再获取详情）
 * leetcode.cn 不直接支持按编号查询，需要先通过搜索接口获取 slug
 */
export async function fetchProblem(questionId: string): Promise<FetchResult> {
  try {
    const query = `
      query problemsetQuestionList {
        problemsetQuestionList(
          categorySlug: ""
          limit: 1
          skip: 0
          filters: { searchKeywords: "${questionId}" }
        ) {
          questions {
            titleSlug
          }
        }
      }
    `;

    const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return { success: false, error: `网络请求失败: HTTP ${response.status}` };
    }

    const json = await response.json();
    const questions = json?.data?.problemsetQuestionList?.questions;

    if (!questions || questions.length === 0) {
      return { success: false, error: `题目 ${questionId} 不存在` };
    }

    const slug = questions[0].titleSlug;
    return fetchProblemBySlug(slug);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `网络请求失败: ${message}` };
  }
}
