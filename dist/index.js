import { writeFileSync } from 'fs';
import { join } from 'path';
export default function buildCheckPlugin() {
    const buildCheck = process.env.BUILD_CHECK || new Date().toISOString();
    return {
        name: 'vite-plugin-build-check',
        transformIndexHtml(html) {
            const injectScript = `
        <script>
          const BUILD_CHECK = "${buildCheck}";
          fetch('./check.json', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
              if (data.check && data.check !== BUILD_CHECK) {
                location.reload(true);
              }
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
