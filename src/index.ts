import type { Plugin } from 'vite';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface BuildCheckPluginOptions {
  contextPath?: string,
  appName?: string,
}

export default function buildCheckPlugin(options: BuildCheckPluginOptions = {}): Plugin {
  const buildCheck = new Date().toISOString();
  return {
    name: 'vite-plugin-build-check',

    transformIndexHtml(html) {
      const contextPaths = JSON.stringify(Array.isArray(options.contextPath) ? options.contextPath : [options.contextPath]);
      const appNames = JSON.stringify(Array.isArray(options.appName) ? options.appName : [options.appName]);

      const injectScript = `
        <script>
          const BUILD_CHECK = "${buildCheck}";
          const contextPaths = ${contextPaths};
          const appNames = ${appNames};
          fetch('./check.json', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
              if (data.check && data.check === BUILD_CHECK) {
                return
              }
              // Event de retour pour reload
              window.addEventListener('message', (event) => {
                if (event.origin && (event.data.name !== 'PwaReloadToSkeletor' || event.data.trigger !== 'reload' ||  !contextPaths.includes(event.data.contextPath))) {
                  return
                }
                location.reload(true);
              })

              window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'failCheck', contextPath: contextPaths, appName: appNames})
                  
            })
            .catch(console.error);
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
