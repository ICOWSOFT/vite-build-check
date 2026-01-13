import type { Plugin } from 'vite';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface BuildCheckPluginOptions {
  contextPath?: string,
  appName?: string,
  noFetch?: boolean
}

export default function buildCheckPlugin(options: BuildCheckPluginOptions = {}): Plugin {
  const buildCheck = new Date().toISOString();
  return {
    name: 'vite-plugin-build-check',

    transformIndexHtml(html) {
      if (options.noFetch) {
        const injectScript = `
            <script>
              const BUILD_CHECK = "${buildCheck}";
            </script>
        `
        return html.replace('</head>', `${injectScript}</head>`);
      }
      const contextPaths = JSON.stringify(Array.isArray(options.contextPath) ? options.contextPath : (options.contextPath ? [options.contextPath] : []));
      const appNames = JSON.stringify(Array.isArray(options.appName) ? options.appName : (options.appName ? [options.appName] : []));

      const injectScript = `
        <script>
        fetch('./check.json', { cache: 'no-store' })
          .then(res => res.json())
          .then(data => {
            const BUILD_CHECK = "${buildCheck}";
            const contextPaths = ${contextPaths};
            const appNames = ${appNames};
            if (data.check && data.check === BUILD_CHECK) {
              if (contextPaths.length > 1) {
                setTimeout(() => {
                  window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'checkOthers', contextPath: contextPaths, appName: appNames, buildCheck:'${buildCheck}' })
                }, 3000)
              }
              return
            }
            // Event de retour pour reload
            window.addEventListener('message', (event) => {
              if (event.origin && (event.data.name !== 'PwaReloadToSkeletor' || event.data.trigger !== 'reload')) {
                return
              }
              if (!(contextPaths.length === event.data.contextPath.length && contextPaths.every((val, i) => val === event.data.contextPath[i]))) {
                return
              }
              location.reload(true);
            })
            setTimeout(() => {
              window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'failCheck', contextPath: contextPaths, appName: appNames })
            }, 3000)
          }).catch(console.error);
        </script>
      `;
      return html.replace('</head>', `${injectScript}</head>`);
    },
    configResolved(config) {
      // Génère dans public/
      const publicPath = join(config.root, 'public', 'check.json');
      writeFileSync(publicPath, JSON.stringify({ check: buildCheck }, null, 2));
    }
  }
}
