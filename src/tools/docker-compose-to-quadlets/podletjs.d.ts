declare module 'podletjs' {
    export interface QuadletOptions {
      name?: string,
      unit?: {
        description?: string
        after?: string[]
        wants?: string[]
      },
      service?: {
        restart?: string
      },
      install?: {
        wantedBy?: string[]
      },
      globals?: { podmanArgs?: string }
    }

    export default class PodletJS {
        dockerRunToQuadlet(command: string, options?: QuadletOptions): string;
        composeToQuadlet(yamlContent, options?: QuadletOptions): Array<
        {
          filename: string
          content: string
        }>;
    }
}