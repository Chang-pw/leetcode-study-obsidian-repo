# Implementation Plan: LeetCode Obsidian Repo

## Overview

基于 TypeScript 实现一个 CLI 工具，从 LeetCode API 导入题目并生成 Obsidian 兼容的 Markdown 知识库。采用自底向上的实现顺序：先实现数据层和工具函数，再实现服务层，最后组装 CLI。

## Tasks

- [x] 1. 项目初始化与基础设施
  - [x] 1.1 初始化 npm 项目，安装依赖（typescript, commander, yaml, vitest, fast-check），配置 tsconfig.json 和 vitest.config.ts
    - 创建 `package.json`，配置 `scripts`（build, test）
    - 安装 `commander`, `yaml` 作为运行时依赖
    - 安装 `typescript`, `vitest`, `fast-check`, `@types/node` 作为开发依赖
    - 配置 TypeScript 编译选项（target: ES2022, module: NodeNext）
    - _Requirements: 全局_

  - [x] 1.2 创建数据模型类型定义 (`src/types.ts`)
    - 定义 `ProblemMetadata` 接口（id, title, slug, difficulty, tags, date）
    - 定义 `LeetCodeProblem` 接口（API 响应类型）
    - 定义 `FetchResult`, `WriteResult` 等辅助类型
    - _Requirements: 5.1_

- [x] 2. Frontmatter 序列化器
  - [x] 2.1 实现 Frontmatter 序列化与反序列化 (`src/frontmatter.ts`)
    - 实现 `serializeFrontmatter(metadata: ProblemMetadata): string`，使用 `yaml` 库将元数据序列化为 `---` 包裹的 YAML 块
    - 实现 `parseFrontmatter(content: string): ProblemMetadata`，从 Markdown 文件内容中提取并解析 Frontmatter
    - _Requirements: 5.1, 5.2, 4.2_

  - [ ]* 2.2 编写 Frontmatter 往返属性测试
    - **Property 1: Frontmatter 往返一致性**
    - 使用 fast-check 生成随机 ProblemMetadata，验证 serialize → parse 往返一致
    - **Validates: Requirements 5.1, 5.2, 5.3, 4.2**

- [x] 3. 文件名生成与模板引擎
  - [x] 3.1 实现文件名生成函数 (`src/utils.ts`)
    - 实现 `generateFilename(id: number, slug: string): string`，生成 `{四位零填充编号}-{slug}.md` 格式
    - _Requirements: 1.2_

  - [ ]* 3.2 编写文件名格式属性测试
    - **Property 3: 文件名格式正确性**
    - 使用 fast-check 生成随机 id 和 slug，验证文件名格式
    - **Validates: Requirements 1.2**

  - [x] 3.3 实现模板引擎 (`src/template.ts`)
    - 实现 `renderProblemFile(problem: ProblemMetadata, content: string): string`
    - 渲染完整 Markdown 文件：Frontmatter + 题目描述 + 解答区域（含代码块模板）+ 笔记区域（含复杂度提示）+ Obsidian 双向链接
    - _Requirements: 1.3, 1.4, 2.1, 2.4, 3.1, 3.3, 4.3, 5.4_

  - [ ]* 3.4 编写模板渲染完整性属性测试
    - **Property 2: 模板渲染完整性**
    - 使用 fast-check 生成随机 ProblemMetadata 和内容，验证渲染结果包含所有必需区域
    - **Validates: Requirements 1.3, 1.4, 2.1, 2.4, 3.1, 3.3, 4.3, 5.4**

- [x] 4. Checkpoint - 确保数据层测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [x] 5. LeetCode Fetcher 与标签处理
  - [x] 5.1 实现 LeetCode GraphQL Fetcher (`src/fetcher.ts`)
    - 实现 `fetchProblem(questionId: string): Promise<FetchResult>`
    - 构造 GraphQL 查询，调用 `https://leetcode.com/graphql`
    - 将 API 响应映射为 `ProblemMetadata`（difficulty 转小写，topicTags 提取 slug）
    - 处理题目不存在、网络错误等异常
    - _Requirements: 1.1, 1.5_

  - [ ]* 5.2 编写 API 响应映射属性测试
    - **Property 6: API 响应映射正确性**
    - 使用 fast-check 生成随机 LeetCodeProblem 对象，验证映射后字段正确
    - **Validates: Requirements 1.1**

  - [ ]* 5.3 编写标签完整性属性测试
    - **Property 4: 标签完整性**
    - 使用 fast-check 生成随机难度和分类标签，验证 Frontmatter tags 包含所有标签
    - **Validates: Requirements 6.1, 6.2**

- [x] 6. 文件写入器
  - [x] 6.1 实现文件写入器 (`src/writer.ts`)
    - 实现 `writeProblemFile(filePath: string, content: string, options: WriteOptions): Promise<WriteResult>`
    - 自动创建 `problems/` 目录（如不存在）
    - 处理文件已存在的情况：默认不覆盖，`--force` 时覆盖
    - _Requirements: 1.2, 1.6_

  - [ ]* 6.2 编写文件写入器单元测试
    - 测试文件不存在时正常写入
    - 测试文件已存在时默认不覆盖
    - 测试 force 模式覆盖
    - _Requirements: 1.6_

- [x] 7. 索引生成器
  - [x] 7.1 实现索引生成器 (`src/indexer.ts`)
    - 实现 `generateIndexes(problemsDir: string, indexesDir: string): Promise<void>`
    - 扫描 problems/ 目录，读取每个文件的 Frontmatter
    - 生成 `indexes/by-difficulty.md`（按 Easy/Medium/Hard 分组，使用 `[[]]` 链接）
    - 生成 `indexes/by-category.md`（按分类标签分组，使用 `[[]]` 链接）
    - _Requirements: 6.3, 6.4_

  - [ ]* 7.2 编写索引生成正确性属性测试
    - **Property 5: 索引生成正确性**
    - 使用 fast-check 生成随机题目集合，验证索引分组正确性
    - **Validates: Requirements 6.3, 6.4**

- [x] 8. Checkpoint - 确保所有服务层测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [x] 9. CLI 组装与 Vault 初始化
  - [x] 9.1 实现 CLI 入口 (`src/cli.ts`)
    - 使用 `commander` 注册 `import <problem-id>` 命令（调用 Fetcher → Template → Writer）
    - 注册 `index` 命令（调用 IndexGenerator）
    - 注册 `init` 命令（初始化 Vault 结构）
    - 添加 `--force` 全局选项
    - 配置 `package.json` 的 `bin` 字段
    - _Requirements: 1.1, 1.5, 1.6_

  - [x] 9.2 实现 Vault 初始化功能
    - 创建 `.obsidian/app.json` 基础配置
    - 创建 `README.md` 首页（包含使用说明和仓库结构介绍）
    - 创建 `problems/` 和 `indexes/` 目录
    - _Requirements: 4.4, 4.5_

- [x] 10. Final Checkpoint - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。

## Notes

- 标记 `*` 的任务为可选任务，可跳过以加快 MVP 进度
- 每个任务引用了具体的需求编号以确保可追溯性
- 属性测试验证通用正确性，单元测试验证具体边界情况
- Checkpoint 任务确保增量验证
