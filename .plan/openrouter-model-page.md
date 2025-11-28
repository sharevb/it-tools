# Plan for OpenRouter Model Price Comparison Page

## Overview
Create a comprehensive OpenRouter model price comparison page in `src/tools/openrouter-model/` using data from the `fetchModels` function in `src/tools/openrouter-model/fetcher.ts`. The page will include filtering capabilities and a paginated table with detailed model information.

## Implementation Plan

### 1. Data Structure and Fetching
- Utilize the existing `fetchModels()` function in `fetcher.ts`
- Transform data to include all required fields for the table
- Implement error handling for API calls

### 2. UI Components
- Create filter controls:
  - Input field for model name search
  - Dropdown for provider filtering
- Implement a responsive table with pagination
- Ensure the UI follows the existing IT Tools design patterns

### 3. Table Columns
The table will display the following columns:
- Model name
- Provider
- Context length
- Max output token (from `top_provider.max_completion_tokens`)
- Input cost
- Output cost
- Modalities
- Features

### 4. Filtering and Search
- Implement client-side filtering by model name
- Implement provider dropdown filter
- Ensure filters work in combination

### 5. Pagination
- Add pagination controls to the table
- Set a reasonable default page size (e.g., 10-20 items per page)

### 6. Integration with Existing Tool
- Update the existing `openrouter-model.vue` component or create a new component if needed
- Ensure the new page follows the same architectural patterns as other tools in the application
- Use existing composables for common functionality (copy, query params, storage)

### 7. Key Files to Modify
- `src/tools/openrouter-model/openrouter-model.vue` - Main component
- `src/tools/openrouter-model/fetcher.ts` - Data fetching (may need minor updates)
- Potentially create new components in the same directory if needed

## Technical Considerations
- Use Vue 3 Composition API with TypeScript
- Leverage Naive UI components for consistency
- Implement proper loading and error states
- Consider performance for large numbers of models
- Follow existing code patterns and conventions in the project