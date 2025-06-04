import type { Plugin } from 'vite';
interface BuildCheckPluginOptions {
    appName?: string;
}
export default function buildCheckPlugin(options?: BuildCheckPluginOptions): Plugin;
export {};
