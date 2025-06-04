import type { Plugin } from 'vite';

export default function buildCheckPlugin (): Plugin {
  const buildCheck = process.env.BUILD_CHECK || new Date().toISOString();

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
                location.reload(true);
              }
            })
            .catch(console.error);
        </script>
      `;
      return html.replace('</head>', `${injectScript}</head>`);
    },

    generateBundle () {
      this.emitFile({
        type: 'asset',
        fileName: 'check.json',
        source: JSON.stringify({ check: buildCheck })
      });
    }
  };
}
