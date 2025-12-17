import type { Plugin } from 'vite';
interface BuildCheckPluginOptions {
    contextPath?: string;
    appName?: string;
    noFetch?: boolean;
}
export default function buildCheckPlugin(options?: BuildCheckPluginOptions): Plugin;
export {};
