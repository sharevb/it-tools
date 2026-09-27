import PassthroughLayout from './passthrough.layout.vue';
import ToolLayout from './tool.layout.vue';

// BaseLayout is not here: App.vue renders it once around the switch, so it
// survives navigation instead of being remounted with every route.
export const layouts = {
  base: PassthroughLayout,
  toolLayout: ToolLayout,
};
