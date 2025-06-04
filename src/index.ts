import type { Plugin } from 'vite';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface BuildCheckPluginOptions {
  contextPath?: string
}

export default function buildCheckPlugin (options: BuildCheckPluginOptions = {}): Plugin {
  const buildCheck = new Date().toISOString();
  return {
    name: 'vite-plugin-build-check',

    transformIndexHtml (html) {
      const injectScript = `
        <script>
          const BUILD_CHECK = "${buildCheck}";
          fetch('./check.json', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
              if (data.check && data.check !== BUILD_CHECK) {
                if ('serviceWorker' in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log('SW actif pour cette iframe :', navigator.serviceWorker.controller.scriptURL);
  } else {
    console.warn('Pas de SW actif pour cette iframe.');
  }

  navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration) {
      console.log('SW enregistré sur ce scope :', registration.scope);
    } else {
      console.warn('Aucun SW enregistré pour ce scope.');
    }
  });
}
                window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'failCheck', contextPath: '${options.contextPath}'})
              }
            })
            .catch(console.error);
        </script>
      `;
      return html.replace('</head>', `${injectScript}</head>`);
    },
    configResolved (config) {
      // Génère dans public/
      const publicPath = join(config.root, 'public', 'check.json');
      writeFileSync(publicPath, JSON.stringify({ check: buildCheck }, null, 2));
    }
  }
}
