/**
 * DeepSeek解释插件 - 基于DeepSeek-V3.2-Exp大模型的文本解释功能
 * 作者：Mark
 * 版本：1.0.1
 *
 * 功能：使用DeepSeek API快速解释所选文本，支持流式输出和自定义配置
 *
 * DeepSeek API文档：https://api-docs.deepseek.com/zh-cn/
 * API端点：https://api.deepseek.com
 * 支持模型：deepseek-chat, deepseek-coder
 */

function supportLanguages() {
    return [
        "auto",
        "zh-Hans",
        "zh-Hant",
        "yue",
        "wyw",
        "pysx",
        "en",
        "ja",
        "ko",
        "fr",
        "de",
        "es",
        "it",
        "ru",
        "pt",
        "nl",
        "pl",
        "ar",
    ];
}

function translate(query, completion) {
    // 使用DeepSeek API密钥进行身份验证
    var header = {
        Authorization: "Bearer " + $option.deepseekApiKey,
        "Content-Type": "application/json",
    };

    var body = {
        model: $option.specificModel || $option.model,
        stream: true,
        stream_options: {
            include_usage: true,
        },
        messages: [
            {
                role: "system",
                content: `${$option.prompt}\n\n${query.text}`,
            },
        ],
    };

    let targetText = "";
    let model = "";
    let usage = {};
    let streamBuffer = "";
    function handleStreamData(streamText, query) {
        $log.info(`[handleStreamData] received streamText => ${streamText}`);
        if (streamText.startsWith("data: ")) {
            streamText = streamText.slice(6);
        }

        if (streamText === "[DONE]") {
            query.onCompletion({
                result: {
                    from: query.detectFrom,
                    to: query.detectTo,
                    toParagraphs: [targetText],
                    toDict:
                        $option.showExtraInfo === "true"
                            ? {
                                  parts: [
                                      {
                                          part: "model.",
                                          means: [model],
                                      },
                                      {
                                          part: "tokens.",
                                          means: [
                                              `I:${usage.prompt_tokens}`,
                                              `O: ${usage.completion_tokens}`,
                                              `T: ${usage.total_tokens}`,
                                          ],
                                      },
                                  ],
                              }
                            : {},
                },
            });
            return;
        }

        streamBuffer += streamText;

        let dataObj;
        try {
            dataObj = JSON.parse(streamBuffer.trim());
        } catch (err) {
            $log.info(`[handleStreamData] json not assembled, streamBuffer => ${streamBuffer}`);
            return;
        }

        usage = dataObj.usage || usage;
        model = dataObj.model;
        if (dataObj.choices.length == 0) {
            return;
        }
        const content = dataObj.choices[0].delta.content;
        if (content) {
            targetText += content;
        }

        query.onStream({
            result: {
                from: query.detectFrom,
                to: query.detectTo,
                toParagraphs: [targetText],
            },
        });

        streamBuffer = "";
    }

    $http.streamRequest({
        method: "POST",
        url: `${$option.endpoint}/chat/completions`,
        header,
        body,
        streamHandler: function (streamData) {
            streamData.text
                .split("\n")
                .filter((line) => line)
                .forEach((line) => {
                    handleStreamData(line, query);
                });
        },
    });
}
