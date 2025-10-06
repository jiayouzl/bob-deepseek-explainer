<p align="center"><img width="100" src="icon.png"></img></p>

## 本插件基于：[bob-openai-explainer](https://github.com/Mopip77/bob-openai-explainer) 修改而来，感谢Mopip77的无私分享。

# bob-deepseek-explainer

借用 `bob` 的展示能力，使用 `DeepSeek-V3.2-Exp` 快速对所选文本进行解释说明

## Install

在 [Release](https://github.com/jiayouzl/bob-deepseek-explainer/releases) 页面进行下载并安装

## Usage

建议 `隐藏并钉到语言切换栏`，按需使用

## Configuration

| key    | defaultValue                                      |
| ------ | ------------------------------------------------- |
| prompt | 用不超过 100 字的简明语言解释，禁止 Markdown 格式 |

## Roadmap

-   [x] 基础调用
-   [x] 支持流式输出，参考 <https://github.com/openai-translator/bob-plugin-openai-translator/pull/83>
-   [x] 自定义 endpoint
-   [x] 支持自定义模型
-   [x] 支持展示额外调用信息(model、token usage)