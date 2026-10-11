import type { ToolsSettings } from '@/utils/tools-settings';
import type { Component } from 'vue';

export interface Tool {
  name: string;
  path: string;
  description: string;
  keywords: string[];
  component: () => Promise<Component>;
  icon: Component;
  redirectFrom?: string[];
  isNew: boolean;
  createdAt?: Date;
  npmPackages?: string[];
  externAccessDescription?: string;
  /**
   * Whether the tool needs internet access to be useful. When the deployment sets `"offline": true` in
   * tools-settings.json, tools for which this is (or returns) true are hidden. Use the function form for tools that
   * work offline once an intranet mirror is configured in tools-settings.json.
   */
  requiresInternet?: boolean | ((settings: ToolsSettings) => boolean);
  footer?: string;
  category: string;
  externalHTMLContent?: string;
}

export interface ExternalTool {
  name: string;
  path: string;
  description?: string;
  keywords?: string[];
  icon?: Component;
  redirectFrom?: string[];
  isNew: boolean;
  createdAt?: Date;
  category: string;
  markdownContent?: string;
  href?: string;
}

export interface ToolCategory {
  name: string;
  components: Tool[];
}

export interface ToolsFilter {
  excludeCategoryFilterRegex?: string;
  includeCategoryFilterRegex?: string;
  excludeToolsFilterRegex?: string;
  includeToolsFilterRegex?: string;
}

export type ToolWithCategory = Tool & { category: string };
