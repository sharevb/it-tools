export interface OpenRouterModel {
  id: string
  name: string
  created: number
  description: string
  context_length: number
  architecture: {
    modality: string
    input_modalities: string[]
    output_modalities: string[]
    tokenizer: string
    instruct_type?: string
  }
  pricing: {
    prompt: string
    completion: string
    request?: string
    image?: string
    web_search?: string
    internal_reasoning?: string
    input_cache_read?: string
    input_cache_write?: string
  }
  top_provider: {
    context_length?: number
    max_completion_tokens?: number
    is_moderated: boolean
  }
  per_request_limits: any
  supported_parameters: string[]
}

export interface OpenRouterResponse {
  data: OpenRouterModel[]
}

export interface ModelData {
  id: string
  name: string
  url: string
  provider: string
  contextWindow: string
  maxOutputToken?: number
  inputCost: string
  outputCost: string
  imageCost: string
  features: string[]
  keep: boolean
  description: string
  input_cache_read: string
  input_cache_write: string
  modalities: string[]
}

export function formatPrice(price: string) {
  const pricePerToken = Number.parseFloat(price);
  if (pricePerToken < 0) {
    return 'N/A';
  }
  const pricePerMillionTokens = pricePerToken * 1_000_000;
  return `$${pricePerMillionTokens.toFixed(pricePerMillionTokens < 0.001 ? 3 : pricePerMillionTokens < 0.01 ? 2 : 1)}`;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatContextSize(size: number) {
  if (size >= 1000000) {
    return `${size / 1000000}M`;
  }
  else if (size >= 1000) {
    return `${size / 1000}K`;
  }
  else {
    return size.toString();
  }
}

export function extractFeatures(model: OpenRouterModel) {
  const features: string[] = [];
  if (model.architecture.input_modalities.includes('image')) {
    features.push('Vision');
  }
  if (model.supported_parameters.includes('tools') || model.supported_parameters.includes('function_call')) {
    features.push('Function calling');
  }
  if (model.context_length >= 100000) {
    features.push('Long context');
  }
  if (model.architecture.modality === 'multimodal') {
    features.push('Multimodal');
  }
  return features;
}

export async function fetchModels() {
  const response = await fetch('https://openrouter.ai/api/v1/models');
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
  }
  const data: OpenRouterResponse = await response.json();

  const transformedData: ModelData[] = data.data.map((model) => {
    const providerFromId = model.id.split('/')[0];
    const provider = capitalizeFirstLetter(providerFromId);
    const contextWindow = formatContextSize(model.context_length);
    const features = extractFeatures(model);

    return {
      id: model.id,
      name: model.name,
      url: `https://openrouter.ai/models/${model.id}`,
      provider,
      contextWindow,
      maxOutputToken: model.top_provider.max_completion_tokens,
      inputCost: formatPrice(model.pricing.prompt),
      outputCost: formatPrice(model.pricing.completion),
      features,
      keep: false,
      description: model.description,
      modalities: model.architecture.input_modalities,
      input_cache_read: model.pricing.input_cache_read ? formatPrice(model.pricing.input_cache_read) : 'N/A',
      input_cache_write: model.pricing.input_cache_write ? formatPrice(model.pricing.input_cache_write) : 'N/A',
      imageCost: model.pricing.image ? formatPrice(model.pricing.image) : 'N/A',
    };
  });
  return transformedData;
}
