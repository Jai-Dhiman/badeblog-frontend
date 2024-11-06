/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const defineProps: <Props>() => Readonly<Props>;
declare const defineEmits: <Events>() => Events;
declare const defineExpose: <Exposed extends Record<string, unknown>>() => void;
declare const withDefaults: <Props, Defaults extends Partial<Props>>(
  props: Props,
  defaults: Defaults
) => Readonly<Props & Defaults>;