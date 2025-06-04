# vite-build-check

For PWA : Generate and inject a marker at build time, then check marker at runtime. If # => reload

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

## Credits

 * "author": "m310851010",
 * "homepage": "https://github.com/m310851010/vite-vue-template-src#readme",