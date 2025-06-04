import type { Plugin } from 'vite';
interface BuildCheckPluginOptions {
    contextPath?: string;
}
export default function buildCheckPlugin(options?: BuildCheckPluginOptions): Plugin;
export {};
