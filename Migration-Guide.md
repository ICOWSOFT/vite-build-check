# TO v2

## Package.json
```bash
npm uninstall vite-build-check vite-vue-template-html
npm i @icowsoft/vite-build-check @icowsoft/vite-vue-template-html -D
```

## Quasar.config.sj

### import
```js 
import VueTemplateSrc from '@icowsoft/vite-vue-template-html'
import buildCheckPlugin from '@icowsoft/vite-build-check'
```

### vitePlugins

Replace

      ```js 
      [buildCheckPlugin({contextPath })],
      ```

By

      ```js
      [buildCheckPlugin({ contextPath: [contextPath], appName: [require('./package.json').name]})],
      ```

### extendGenerateSWOptions

Add

```js 
        cfg.globIgnores = cfg.globIgnores || []
        cfg.globIgnores.push('**/check.json')
``` 

Replace

```js 
        cfg.globIgnores = cfg.globIgnores || []
        cfg.globIgnores.push('**/check.json')
        cfg.runtimeCaching.push({
          urlPattern: new RegExp('\\/check\\.json$'),
          handler: 'NetworkOnly',
          options: { cacheName: 'no-cache-check' }
        })
``` 