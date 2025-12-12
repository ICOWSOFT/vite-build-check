import type { Plugin } from 'vite';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface BuildCheckPluginOptions {
  contextPath?: string
}

export default function buildCheckPlugin(options: BuildCheckPluginOptions = {}): Plugin {
  const buildCheck = new Date().toISOString();
  return {
    name: 'vite-plugin-build-check',

    transformIndexHtml(html) {
      const injectScript = `
        <script>
         const BUILD_CHECK = "${buildCheck}";
fetch('./check.json', { cache: 'no-store' })
  .then(res => res.json())
  .then(data => {
    if (data.check && data.check === BUILD_CHECK) {
      return
    }
    // Event de retour pour reload
    window.addEventListener('message', (event) => {
      if (event.origin && (event.data.name !== 'PwaReloadToSkeletor' || event.data.trigger !== 'reload' || event.data.contextPath !== '${options.contextPath}')) {
        return
      }
      location.reload(true);
    })
    // Récup du SW to unregister
    navigator.serviceWorker.getRegistrations().then(
      (registrations) => {
        const ws = registrations.map(r => {
          if (!r.scope.includes('${options.contextPath}/')) {
            return null
          }
          // Sending msg popur display wait box
          return r.update()
        })
        const toUpdates = ws.filter(el => el != null)
        window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'failCheck', contextPath: '${options.contextPath}' })
        return Promise.all(toUpdates)
      },
      (err) => {
        throw err
      }
    ).then(() => {
      console.log('UPDATED')
    })
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
