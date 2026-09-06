export enum Formats {
  YAML = 'Spring Boot YAML',
  PROPERTIES = 'Spring Boot Properties',
  SIMPLE = 'Simple Environment Variables',
  TERMINAL = 'Terminal Environment Variables',
  KUBERNETES = 'Kubernetes Environment Variables',
}

export const FormatsDesc: Record<string, string> = {
  YAML: 'Spring Boot YAML',
  PROPERTIES: 'Spring Boot Properties',
  SIMPLE: 'Simple Environment Variables',
  TERMINAL: 'Terminal Environment Variables',
  KUBERNETES: 'Kubernetes Environment Variables',
};

export enum ModelType {
  ENV,
  FLAT,
}

export interface Defaults {
  modelType: ModelType;
  outputType: string;
  inputValue: string;
}

export interface Model {
  inputModelType?: ModelType;
  value?: string;
}

export const DefaultsMap = new Map<string, Defaults>([
  [
    Formats.YAML,
    {
      modelType: ModelType.FLAT,
      outputType: Formats.SIMPLE,
      inputValue: 'foo-bar:\n  baz:\n    - value1\n    - value2\n  enabled: true\nabcDef: value3',
    },
  ],
  [
    Formats.PROPERTIES,
    {
      modelType: ModelType.FLAT,
      outputType: Formats.SIMPLE,
      inputValue: 'foo-bar.baz[0]=value1\nfoo-bar.baz[1]=value2\nfoo-bar.enabled=true\nabcDef=value3',
    },
  ],
  [
    Formats.SIMPLE,
    {
      modelType: ModelType.ENV,
      outputType: Formats.KUBERNETES,
      inputValue: 'FOOBAR_BAZ_0_=value1\nFOOBAR_BAZ_1_=value2\nFOOBAR_ENABLED=true\nABCDEF=value3',
    },
  ],
  [
    Formats.TERMINAL,
    {
      modelType: ModelType.ENV,
      outputType: Formats.SIMPLE,
      inputValue: 'FOOBAR_BAZ_0_=value1 FOOBAR_BAZ_1_=value2 FOOBAR_ENABLED=true ABCDEF=value3',
    },
  ],
  [
    Formats.KUBERNETES,
    {
      modelType: ModelType.ENV,
      outputType: Formats.SIMPLE,
      inputValue:
        '- name: FOOBAR_BAZ_0_\n  value: value1\n- name: FOOBAR_BAZ_1_\n  value: value2\n- name: FOOBAR_ENABLED\n  value: true\n- name: ABCDEF\n  value: value3',
    },
  ],
]);
