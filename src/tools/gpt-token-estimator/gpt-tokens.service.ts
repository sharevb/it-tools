import type { Tiktoken, TiktokenModel } from 'js-tiktoken';
import { encodingForModel } from 'js-tiktoken';
import { promptTokensEstimate } from 'openai-chat-tokens';
import { translate as t } from '@/plugins/i18n.plugin';

interface MessageItem {
  name?: string
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class GPTTokens {
  protected static modelEncodingCache = new Map<TiktokenModel, Tiktoken>();

  protected static getEncodingForModelCached(model: TiktokenModel): Tiktoken {
    const modelEncodingCache = GPTTokens.modelEncodingCache;
    if (!modelEncodingCache.has(model)) {
      try {
        modelEncodingCache.set(model, encodingForModel(model));
      }
      catch (e: any) {
        throw new Error(`Model '${model}' not found: ${e.toString()}`);
      }
    }

    return modelEncodingCache.get(model)!;
  }

  constructor(options: {
    model?: TiktokenModel
    messages?: GPTTokens['messages']
    tools?: GPTTokens['tools']
    debug?: boolean
  }) {
    const {
      model,
      messages,
      tools,
      debug = false,
    } = options;

    this.model = model as TiktokenModel;
    this.debug = debug;
    this.messages = messages;
    this.tools = tools;

    this.checkOptions();
  }

  private checkOptions() {
    if (!this.messages && !this.tools) {
      throw new Error(t('tools.gpt-tokens.service.texts.must-set-one-of-messages-or-function'));
    }

    if (this.tools && !this.messages) {
      throw new Error(t('tools.gpt-tokens.service.texts.function-must-set-messages'));
    }
  }

  public static get supportModels() {
    return ['davinci-002', 'babbage-002', 'text-davinci-003', 'text-davinci-002', 'text-davinci-001', 'text-curie-001', 'text-babbage-001', 'text-ada-001', 'davinci', 'curie', 'babbage', 'ada', 'code-davinci-002', 'code-davinci-001', 'code-cushman-002', 'code-cushman-001', 'davinci-codex', 'cushman-codex', 'text-davinci-edit-001', 'code-davinci-edit-001', 'text-embedding-ada-002', 'text-embedding-3-small', 'text-embedding-3-large', 'text-similarity-davinci-001', 'text-similarity-curie-001', 'text-similarity-babbage-001', 'text-similarity-ada-001', 'text-search-davinci-doc-001', 'text-search-curie-doc-001', 'text-search-babbage-doc-001', 'text-search-ada-doc-001', 'code-search-babbage-code-001', 'code-search-ada-code-001', 'gpt2', 'gpt-3.5-turbo', 'gpt-35-turbo', 'gpt-3.5-turbo-0301', 'gpt-3.5-turbo-0613', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo-0125', 'gpt-3.5-turbo-16k', 'gpt-3.5-turbo-16k-0613', 'gpt-3.5-turbo-instruct', 'gpt-3.5-turbo-instruct-0914', 'gpt-4', 'gpt-4-0314', 'gpt-4-0613', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-4-32k-0613', 'gpt-4-turbo', 'gpt-4-turbo-2024-04-09', 'gpt-4-turbo-preview', 'gpt-4-1106-preview', 'gpt-4-0125-preview', 'gpt-4-vision-preview', 'gpt-4o', 'gpt-4o-2024-05-13', 'gpt-4o-2024-08-06', 'gpt-4o-2024-11-20', 'gpt-4o-mini-2024-07-18', 'gpt-4o-mini', 'gpt-4o-search-preview', 'gpt-4o-search-preview-2025-03-11', 'gpt-4o-mini-search-preview', 'gpt-4o-mini-search-preview-2025-03-11', 'gpt-4o-audio-preview', 'gpt-4o-audio-preview-2024-12-17', 'gpt-4o-audio-preview-2024-10-01', 'gpt-4o-mini-audio-preview', 'gpt-4o-mini-audio-preview-2024-12-17', 'o1', 'o1-2024-12-17', 'o1-mini', 'o1-mini-2024-09-12', 'o1-preview', 'o1-preview-2024-09-12', 'o1-pro', 'o1-pro-2025-03-19', 'o3', 'o3-2025-04-16', 'o3-mini', 'o3-mini-2025-01-31', 'o4-mini', 'o4-mini-2025-04-16', 'chatgpt-4o-latest', 'gpt-4o-realtime', 'gpt-4o-realtime-preview-2024-10-01', 'gpt-4o-realtime-preview-2024-12-17', 'gpt-4o-mini-realtime-preview', 'gpt-4o-mini-realtime-preview-2024-12-17', 'gpt-4.1', 'gpt-4.1-2025-04-14', 'gpt-4.1-mini', 'gpt-4.1-mini-2025-04-14', 'gpt-4.1-nano', 'gpt-4.1-nano-2025-04-14', 'gpt-4.5-preview', 'gpt-4.5-preview-2025-02-27', 'gpt-5', 'gpt-5-2025-08-07', 'gpt-5-nano', 'gpt-5-nano-2025-08-07', 'gpt-5-mini', 'gpt-5-mini-2025-08-07', 'gpt-5-chat-latest'];
  }

  public readonly debug;
  public readonly model;
  public readonly messages?: MessageItem [];

  public readonly tools?: {
    type: 'function'
    function: {
      name: string
      description?: string
      parameters: Record<string, unknown>
    }
  } [];

  // Used Tokens (total)
  public get usedTokens(): number {
    if (this.tools) {
      return promptTokensEstimate({
        messages: this.messages!,
        functions: this.tools.map(item => item.function),
      });
    }

    if (this.messages) {
      return this.promptUsedTokens + this.completionUsedTokens;
    }

    return 0;
  }

  // Used Tokens (prompt)
  public get promptUsedTokens() {
    return GPTTokens.num_tokens_from_messages(this.promptMessages, this.model);
  }

  // Used Tokens (completion)
  public get completionUsedTokens() {
    return this.completionMessage
      ? GPTTokens.contentUsedTokens(this.model, this.completionMessage)
      : 0;
  }

  public static contentUsedTokens(model: TiktokenModel, content: string) {
    const encoding = GPTTokens.getEncodingForModelCached(model);

    return encoding.encode(content).length;
  }

  private get lastMessage() {
    return this.messages![this.messages!.length - 1];
  }

  private get promptMessages() {
    return this.lastMessage.role === 'assistant' ? this.messages!.slice(0, -1) : this.messages!;
  }

  private get completionMessage() {
    return this.lastMessage.role === 'assistant'
      ? this.lastMessage.content
      : '';
  }

  /**
     * Return the number of tokens in a list of messages.
     * @param messages A list of messages.
     * @param model The model to use for encoding.
     * @returns The number of tokens in the messages.
     * @throws If the model is not supported.
     */
  private static num_tokens_from_messages(messages: MessageItem [], model: TiktokenModel) {
    let tokens_per_message!: number;
    let tokens_per_name !: number;

    let num_tokens = 0;

    if (model === 'gpt-3.5-turbo-0301') {
      tokens_per_message = 4;
      tokens_per_name = -1;
    }
    else {
      tokens_per_message = 3;
      tokens_per_name = 1;
    }

    const encoding = GPTTokens.getEncodingForModelCached(model);

    // This is a port of the Python code from
    //
    // Python => Typescript by gpt-4
    //
    // https://notebooks.githubusercontent.com/view/ipynb?browser=edge&bypass_fastly=true&color_mode=dark&commit=d67c4181abe9dfd871d382930bb778b7014edc66&device=unknown_device&docs_host=https%3A%2F%2Fdocs.github.com&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6f70656e61692f6f70656e61692d636f6f6b626f6f6b2f643637633431383161626539646664383731643338323933306262373738623730313465646336362f6578616d706c65732f486f775f746f5f636f756e745f746f6b656e735f776974685f74696b746f6b656e2e6970796e62&logged_in=true&nwo=openai%2Fopenai-cookbook&path=examples%2FHow_to_count_tokens_with_tiktoken.ipynb&platform=mac&repository_id=468576060&repository_type=Repository&version=114#6d8d98eb-e018-4e1f-8c9e-19b152a97aaf

    for (const message of messages) {
      num_tokens += tokens_per_message;

      for (const [key, value] of Object.entries(message)) {
        if (typeof value !== 'string') {
          continue;
        }

        num_tokens += encoding.encode(value as string).length;
        if (key === 'name') {
          num_tokens += tokens_per_name;
        }
      }
    }

    // Supplementary
    // encoding.free()

    // every reply is primed with <|start|>assistant<|message|>
    return num_tokens + 3;
  }

  public static encode(model: TiktokenModel, text: string) {
    const encoding = GPTTokens.getEncodingForModelCached(model);
    return encoding.encode(text);
  }

  public static decode(model: TiktokenModel, tokens: number[]) {
    const encoding = GPTTokens.getEncodingForModelCached(model);
    return encoding.decode(tokens);
  }
}
