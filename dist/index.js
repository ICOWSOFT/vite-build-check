import { writeFileSync } from 'fs';
import { join } from 'path';
export default function buildCheckPlugin(options = {}) {
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
              navigator.serviceWorker.getRegistrations().then(
                (registrations) => {
                  const ws = registrations.map(r => {
                    if (!r.scope.includes('/${options.contextPath}/')) {
                      return null
                    }
                    window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'failCheck', contextPath: '${options.contextPath}'})
                    return r
                  })
                  return Promise.all(ws)
                },
                (err) => {
                  throw err
                }
              ).then(
                (resp) => {
                  location.reload(true);
                },
                (err) => {
                  reject(contextPath, err)
                }
              )
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
    };
}
