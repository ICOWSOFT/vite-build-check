# vite-build-check

Avoid PWA stupid cache/404/blank page problem...
Generate and inject a marker(timestamp) at build time, then check marker at runtime. If # => reload

## Setup
 * `npm install git+https://github.com/ICOWSOFT/vite-build-check.git -D`

 * `quasar.config.js` : header

```js
import buildCheckPlugin from 'vite-build-check'
```

* `quasar.config.js` : vitePlugins

```js
​[buildCheckPlugin()],
```

## Dev / Build

If any change in the code, please build, then push (I know, it's not conventional)...

To build :
```bash
npx tsc
```
