# 需求文档

## 简介

本项目是一个基于 Obsidian 兼容的 Markdown 仓库，用于管理 LeetCode 刷题过程。用户可以通过命令行工具自动导入 LeetCode 题目信息，在统一的 Markdown 文件中编写解题代码和学习笔记，并利用 Obsidian 的双向链接、标签等功能进行知识管理。

## 术语表

- **Importer（导入器）**：负责从 LeetCode 获取题目信息并生成 Markdown 文件的命令行工具
- **Problem_File（题目文件）**：为每道 LeetCode 题目生成的 Markdown 文件，包含题目描述、解答区域和笔记区域
- **Vault（知识库）**：整个项目目录，作为 Obsidian Vault 直接打开使用
- **Frontmatter（前置元数据）**：Markdown 文件头部的 YAML 格式元数据块，用于存储题目属性
- **Solution_Section（解答区域）**：题目文件中供用户编写解题代码的区域
- **Note_Section（笔记区域）**：题目文件中供用户编写学习笔记、思路分析的区域
- **Tag（标签）**：Obsidian 标签，用于按难度、分类等维度组织题目

## 需求

### 需求 1：题目自动导入

**用户故事：** 作为一名刷题用户，我希望通过命令行工具自动导入 LeetCode 题目信息，以便快速建立题目文件而无需手动复制粘贴。

#### 验收标准

1. WHEN 用户提供一个 LeetCode 题目编号, THE Importer SHALL 从 LeetCode 公开 API 获取题目标题、描述、难度和分类标签
2. WHEN Importer 成功获取题目信息, THE Importer SHALL 在 `problems/` 目录下生成一个格式为 `{编号}-{题目slug}.md` 的 Markdown 文件
3. WHEN 生成题目文件时, THE Importer SHALL 在文件 Frontmatter 中包含题目编号、标题、难度、分类标签和导入日期
4. WHEN 生成题目文件时, THE Importer SHALL 在文件中包含题目描述的 Markdown 格式内容
5. IF 用户提供的题目编号不存在, THEN THE Importer SHALL 返回明确的错误信息并终止操作
6. IF 目标文件已存在, THEN THE Importer SHALL 提示用户确认是否覆盖，默认保留已有文件

### 需求 2：解答区域

**用户故事：** 作为一名刷题用户，我希望在题目文件中有专门的解答区域来编写我的解题代码，以便代码和题目保持在同一文件中方便查阅。

#### 验收标准

1. WHEN 生成题目文件时, THE Importer SHALL 在题目描述之后创建一个标题为 `## 解答` 的区域
2. THE Solution_Section SHALL 支持通过 Markdown 代码块（```language）编写多种编程语言的代码
3. WHEN 用户在 Solution_Section 中编写多个解法时, THE Problem_File SHALL 支持使用子标题（如 `### 解法一`、`### 解法二`）区分不同解法
4. WHEN 生成题目文件时, THE Importer SHALL 在 Solution_Section 中预置一个空的代码块模板

### 需求 3：笔记区域

**用户故事：** 作为一名刷题用户，我希望在题目文件中有专门的笔记区域来记录解题思路和学习心得，以便日后复习时快速回忆。

#### 验收标准

1. WHEN 生成题目文件时, THE Importer SHALL 在 Solution_Section 之后创建一个标题为 `## 笔记` 的区域
2. THE Note_Section SHALL 支持标准 Markdown 语法，包括列表、链接、图片和数学公式
3. WHEN 生成题目文件时, THE Importer SHALL 在 Note_Section 中预置提示性模板文本，引导用户记录时间复杂度、空间复杂度和关键思路

### 需求 4：Obsidian 兼容性

**用户故事：** 作为一名 Obsidian 用户，我希望该仓库可以直接作为 Obsidian Vault 打开使用，以便利用 Obsidian 的知识管理功能组织我的刷题记录。

#### 验收标准

1. THE Vault SHALL 使用纯 Markdown 文件存储所有内容，确保与 Obsidian 完全兼容
2. THE Vault SHALL 在 Frontmatter 中使用 Obsidian 兼容的 YAML 格式标签（tags 字段）
3. WHEN 生成题目文件时, THE Importer SHALL 使用 Obsidian 双向链接语法（`[[]]`）链接相关题目或分类页面
4. THE Vault SHALL 包含一个 `README.md` 作为首页，提供仓库使用说明和题目索引
5. THE Vault SHALL 在根目录包含 `.obsidian/` 配置目录的基础配置，确保开箱即用

### 需求 5：题目文件模板与 Frontmatter 序列化

**用户故事：** 作为一名开发者，我希望题目文件的 Frontmatter 和模板内容能够被正确序列化和反序列化，以便工具能可靠地读写题目元数据。

#### 验收标准

1. THE Importer SHALL 将题目元数据序列化为 YAML 格式的 Frontmatter 块（以 `---` 分隔）
2. WHEN 读取已有题目文件时, THE Importer SHALL 能够正确解析 Frontmatter 中的所有字段
3. FOR ALL 合法的题目元数据对象, 序列化为 Frontmatter 再反序列化 SHALL 产生等价的对象（往返一致性）
4. THE Importer SHALL 将题目模板（包含各区域标题和占位内容）渲染为完整的 Markdown 字符串

### 需求 6：题目组织与导航

**用户故事：** 作为一名刷题用户，我希望能够按难度和分类浏览题目，以便有针对性地进行专项练习。

#### 验收标准

1. WHEN 导入题目时, THE Importer SHALL 根据题目难度在 Frontmatter 的 tags 中添加对应的难度标签（如 `easy`、`medium`、`hard`）
2. WHEN 导入题目时, THE Importer SHALL 根据题目分类在 Frontmatter 的 tags 中添加对应的分类标签（如 `array`、`dynamic-programming`）
3. THE Vault SHALL 包含按难度分组的索引页面（如 `indexes/by-difficulty.md`）
4. THE Vault SHALL 包含按分类分组的索引页面（如 `indexes/by-category.md`）
