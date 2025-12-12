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
          // window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'failCheck', contextPath: '${options.contextPath}'})
          return r.update()
        })
        // 4. Écouter le changement de contrôleur
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Reloading')
          window.location.reload(); // Recharge la page quand le nouveau SW est actif
        });
        return Promise.all(ws.filter(el => el != null))
      },
      (err) => {
        throw err
      }
    )
      .then((resp) => {
        console.log('Reloading done')
      }, (err) => {
        console.error('Reloading error', error)
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
    };
}
