import type { Plugin } from 'vite';
interface BuildCheckPluginOptions {
    contextPath?: string;
    appName?: string;
}
export default function buildCheckPlugin(options?: BuildCheckPluginOptions): Plugin;
export {};
