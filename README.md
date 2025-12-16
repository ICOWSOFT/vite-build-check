# vite-build-check

Avoid PWA stupid cache/404/blank page problem...
Generate and inject a marker(timestamp) at build time, then check marker at runtime. If # => reload

## Setup
 * `npm install @icowsoft/vite-build-check -D`

 * `quasar.config.js` : header

```js
import buildCheckPlugin from '@icowsoft/vite-build-check'
```
* `quasar.config.js` : After `export`
  
```js
  const candidate = (!ctx.dev && process.env.ICS_CANDIDATE) ? '-candidate' : ''
  const contextPath = '/' + require('./package.json').config.devServer.contextPath + candidate
```

* `quasar.config.js` : build

```js
        publicPath:contextPath,
```
* `quasar.config.js` : vitePlugins

```js
[buildCheckPlugin({contextPath: [contextPath], appName:[require('./package.json').name] })],
```

* `quasar.config.js` : `pwa > extendGenerateSWOptions ` : 

```js
        cfg.globIgnores = cfg.globIgnores || []
        cfg.globIgnores.push('**/check.json')
        cfg.runtimeCaching = cfg.runtimeCaching || []
        cfg.runtimeCaching.push({
          urlPattern: new RegExp('\\/check\\.json$'),
          handler: 'NetworkOnly',
          options: { cacheName: 'no-cache-check' }
        })
```

## Dev / Build

If any change in the code, please build, then push (I know, it's not conventional)...

To build :
```bash
npx tsc
```

Then push to github.

## Deploy

Update the package.json `version`, then
``` bash
npx tsc
npm publish
``` 


## Upgrade dep

``` 
npx npm-check-updates -u
npm install
git add .
git commit -m"Upgrade lib"
git push
```