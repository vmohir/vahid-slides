---
theme: default
title: Package Dependencies & Bundling
layout: intro
mdc: true
#transition: slide-left
hideInToc: true
---

# Package Dependencies & Bundling

---
hideInToc: true
---

# Agenda

<Toc minDepth="1" maxDepth="1" />

---
layout: two-cols-header
layoutClass: gap-8
---

# How NPM Installs Dependencies

::left::

[How NPM v3+ works](https://npm.github.io/how-npm-works-docs/npm3/how-npm3-works.html)

> dependency resolution depends on install order

Example:
1. Install A-v1
2. Install B-v1
3. Update to A-v2
4. Update to B-v2
5. `npm dedupe`

::right::

````md magic-move
```sh
A-v1 --> Dep-v1
B-v1 --> Dep-v1
A-v2 --> Dep-v2
B-v2 --> Dep-v2
```
```sh
A-v1 --> Dep-v1
B-v1 --> Dep-v1
A-v2 --> Dep-v2
B-v2 --> Dep-v2

node_modules/
├── A-v1/
└── dep-v1/ # Hoisted
```
```sh
A-v1 --> dep-v1
B-v1 --> dep-v1
A-v2 --> dep-v2
B-v2 --> dep-v2

node_modules/
├── A-v1/
├── B-v1/
└── dep-v1/ # Hoisted
```

```sh
A-v1 --> Dep-v1
B-v1 --> Dep-v1
A-v2 --> Dep-v2
B-v2 --> Dep-v2

node_modules/
├── A-v2/
│   └── node_modules/
│       └── dep-v2/   
├── B-v1/
└── dep-v1/ # Hoisted
```
```sh
A-v1 --> Dep-v1
B-v1 --> Dep-v1
A-v2 --> Dep-v2
B-v2 --> Dep-v2

node_modules/
├── A-v2/
│   └── node_modules/
│       └── dep-v2/   
└── B-v2/
    └── node_modules/
        └── dep-v2/
```
```sh
A-v1 --> Dep-v1
B-v1 --> Dep-v1
A-v2 --> Dep-v2
B-v2 --> Dep-v2

node_modules/
├── A-v2/   
├── B-v2/
└── dep-v2/ # Hoisted
```
````

---

# How to find duplicated dependencies

- `npm find-dupes`: shows all duplicated packages
- `npm ls <package>`: shows dependency tree for a package
- `npx node-modules-inspector`: Node modules inspector shows a visual tree of dependencies and duplicates

<img v-click src="./multiple-versions.png" alt="" style="max-width: 650px; margin: 0 auto;" />

---

## Radix UI Example in Design System

````md magic-move
```json
{
  "name": "@accurx/design",
  "dependencies": {
    "@radix-ui/react-accordion": "^1.0.0",
    "@radix-ui/react-button": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0"
  }
}
```

```json
{
  "name": "@accurx/design",
  "dependencies": {
    "radix-ui": "^1.0.0"
  }
}
```
````

<v-switch>
<template #1><img src="./before-radix-ui-separate-radix-packages.png" alt="" /></template>
<template #2><img src="./after-using-radix-ui.png" alt="" /></template>
</v-switch>

---
layout: intro
---

# dependencies vs peerDependencies

---

# NPM Dependency Types for libraries

- **dependencies**: npm installs them in consumer's node_modules
- **peerDependencies**: npm expects consumers to have these
    - Doesn't guarantee single copy. duplicates happen when version ranges don't overlap.
- **devDependencies**: dev-time only, not shipped to consumers.
    - Without peers in devDependencies, you can't run tests or dev server.
    - In non-library projects, devDependencies behave like dependencies.
- **peerDependenciesMeta**: mark peers as optional.
    - npm won't warn/error if the peer is missing
    - npm won't auto-install it
    - Consumer must handle the missing dependency

<v-click>

- **optionalDependencies**: like dependencies, but install failures are ignored. Can be omitted by `npm install --no-optional`
    - For example `playwright` is optional and can speed up CI installs for build.

</v-click>

<style>
strong {
  color: #ffc870;
}
</style>


---

## Example

````md magic-move
```json
{
  "name": "@accurx/design",
  "exports": { ".": "./dist/index.js" },
  "dependencies": {
    "radix-ui": "^1.0.0" # We don't expect consumers to install this
  }
}
```

```json
{
  "name": "@accurx/design",
  "exports": { ".": "./dist/index.js" },
  "dependencies": {
    "radix-ui": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 | ^19.0.0" # We expect consumers to have React
  }
}
```

```json
{
  "name": "@accurx/design",
  "exports": { ".": "./dist/index.js" },
  "dependencies": {
    "radix-ui": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 | ^19.0.0"
  },
  "devDependencies": {
    "react": "^19.0.0" # For local development/testing
  }
}
```


```json
{
  "name": "@accurx/design",
  "exports": { ".": "./dist/index.js" },
  "dependencies": {
    "radix-ui": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 | ^19.0.0",
    "react-router": "^6.0.0" # One component uses this
  },
  "devDependencies": {
    "react": "^19.0.0"
  }
}
```

```json
{
  "name": "@accurx/design",
  "exports": { ".": "./dist/index.js" },
  "dependencies": {
    "radix-ui": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 | ^19.0.0",
    "react-router": "^6.0.0" # One component uses this
  },
  "peerDependenciesMeta": {
    "react-router": { "optional": true } # Not all consumers use that component
  },
  "devDependencies": {
    "react": "^19.0.0"
  }
}
```

```json
{
  "name": "@accurx/design",
  "exports": {
    ".": "./dist/index.js",
    "./router-component": "./dist/router-component.js"
  },
  "dependencies": {
    "radix-ui": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 | ^19.0.0",
    "react-router": "^6.0.0"
  },
  "peerDependenciesMeta": {
    "react-router": { "optional": true }
  },
  "devDependencies": {
    "react": "^19.0.0"
  }
}
```

```json
{
  "name": "@accurx/design",
  "exports": {
    ".": "./dist/index.js"
  },
  "dependencies": {
    "radix-ui": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 | ^19.0.0"
  },
  "devDependencies": {
    "react": "^19.0.0"
  }
}
```

```json {11|13-17|18-21}
{
  "name": "@accurx/design",
  "exports": {
    ".": "./dist/index.js",
  },
  "dependencies": {
    "radix-ui": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 | ^19.0.0",
    "vue": "^3.0.0", # Support Vue too
  },
  "peerDependenciesMeta": {
    # Consumers may use React OR Vue
    "react": { "optional": true },
    "vue": { "optional": true },
  },
  "devDependencies": {
    "react": "^19.0.0",
    "vue": "^3.0.0",
  }
}
```
````

---
layout: intro
---

# To Bundle or Not to Bundle

Making the right decision for your dependencies

---

## Bundle vs External

**Bundle** (include in your dist):
- Small utilities you wrote
- Tiny dependencies (< 5KB)
- Dependencies you've modified

**Don't Bundle** (mark as external):
- Peer dependencies (React, Vue)
- Large dependencies (lodash, date-fns)
- Dependencies consumers likely have

---

## Bundler Configuration

````md magic-move
```js
// rollup.config.js - bundle everything
export default {
  input: 'src/index.js',
  output: { file: 'dist/index.js' }
}
```

```js
// rollup.config.js - externalize peers
export default {
  input: 'src/index.js',
  output: { file: 'dist/index.js' },
  external: ['react', 'react-dom']
}
```

```js
// rollup.config.js - externalize all deps
import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: { file: 'dist/index.js' },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ]
}
```
````

---

## Why Bundling Peers is Bad

```
Consumer's bundle:
├── your-package (15KB)
│   └── react (bundled, 45KB)  ❌ Duplicate!
└── react (45KB)

Total: 105KB (should be 60KB)
```

**Problems:**
- Duplicate code = larger bundles
- Multiple instances = broken state
- Can't tree-shake what you bundled

---

# The sideEffects Field

Enabling aggressive tree-shaking

---

## What are Side Effects?

Code that runs just by importing:

````md magic-move
```js
// No side effects - safe to remove if unused
export function add(a, b) {
  return a + b
}
```

```js
// Has side effects - can't remove!
import './polyfills.js'  // Modifies globals

export function add(a, b) {
  return a + b
}
```

```js
// Has side effects - CSS import
import './styles.css'  // Adds styles to page

export function Button() {
  return <button>Click</button>
}
```
````

---

## Declaring sideEffects

````md magic-move
```json
{
  "name": "my-utils",
  "main": "dist/index.js"
}
```

```json
{
  "name": "my-utils",
  "main": "dist/index.js",
  "sideEffects": false
}
```

```json
{
  "name": "my-ui-library",
  "main": "dist/index.js",
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}
```
````

**Bundler support:** Webpack, Rollup, esbuild, Vite, Parcel

---

## The Impact

```js
// Consumer's code
import { Button } from 'my-ui-library'
// Only uses Button, not the other 50 components
```

**Without sideEffects: false**
- Bundler keeps all exports "just in case"
- Full library ends up in bundle

**With sideEffects: false**
- Bundler knows unused exports are safe to remove
- Only Button code is included

---

# Package Exports (Subentries)

Modern package entry points

---

## The exports Field

Replaces `main`, `module`, and `browser` fields:

````md magic-move
```json
{
  "name": "my-package",
  "main": "dist/index.js",
  "module": "dist/index.mjs"
}
```

```json
{
  "name": "my-package",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

```json
{
  "name": "my-package",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```
````

---

## Subpath Exports

````md magic-move
```json
{
  "exports": {
    ".": "./dist/index.js"
  }
}
```

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js",
    "./react": "./dist/adapters/react.js",
    "./vue": "./dist/adapters/vue.js"
  }
}
```
````

```js
// Consumer imports
import { core } from 'my-package'
import { helper } from 'my-package/utils'
import { useMyHook } from 'my-package/react'
```

---

## Subentries + Optional Peers

The powerful combination:

````md magic-move
```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "vue": "^3.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "vue": { "optional": true }
  }
}
```

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "vue": "^3.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "vue": { "optional": true }
  },
  "exports": {
    ".": "./dist/core.js",
    "./react": "./dist/react.js",
    "./vue": "./dist/vue.js"
  }
}
```
````

**Why this works:**
- Core functionality has no framework deps
- React users import `pkg/react` (only needs React)
- Vue users import `pkg/vue` (only needs Vue)
- No runtime errors from missing frameworks!

---

## Real World: TanStack Query

```json
{
  "exports": {
    ".": { "import": "./build/modern/index.js" },
    "./react": { "import": "./build/modern/react.js" },
    "./vue": { "import": "./build/modern/vue.js" },
    "./solid": { "import": "./build/modern/solid.js" },
    "./svelte": { "import": "./build/modern/svelte.js" }
  },
  "peerDependencies": {
    "react": "^18 || ^19",
    "vue": "^3.0.0",
    "solid-js": "^1.0.0",
    "svelte": "^5.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "vue": { "optional": true },
    "solid-js": { "optional": true },
    "svelte": { "optional": true }
  }
}
```

---

# Putting It Together

A complete package.json example

---

## Best Practices Summary

````md magic-move
```json
{
  "name": "@accurx/design"
}
```

```json
{
  "name": "@accurx/design",
  "type": "module",
  "sideEffects": false
}
```

```json
{
  "name": "@accurx/design",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

```json
{
  "name": "@accurx/design",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "dependencies": {
    "es-toolkit": "^1.0.0",
    "radix-ui": "^1.0.0"
  }
}
```

```json
{
  "name": "@accurx/design",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "dependencies": {
    "es-toolkit": "^1.0.0",
    "radix-ui": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-router": "^6.0.0"
  },
  "peerDependenciesMeta": {
    "react-router": { "optional": true }
  },
  "devDependencies": {
    "react": "^18.0.0",
    "react-router": "^6.0.0",
    "typescript": "~5.0.0"
  }
}
```
````

---
layout: intro
---

# Key Takeaways

1. **dependencies** = "install this for me", **peerDependencies** = "I expect you to have this"
2. Peers go in **devDependencies** too (for local development)
3. **peerDependenciesMeta** makes peers optional
4. **Don't bundle** peer dependencies
5. **sideEffects: false** enables tree-shaking
6. **exports** with subentries = modular, tree-shakeable packages

---
layout: intro
---

# Questions?

## Resources
- [npm3 Duplication](https://npm.github.io/how-npm-works-docs/npm3/duplication.html)
- [React: Invalid Hook Call Warning](https://react.dev/warnings/invalid-hook-call-warning)
