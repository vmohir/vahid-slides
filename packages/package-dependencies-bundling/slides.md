---
theme: default
title: Package Dependencies & Bundling
layout: intro
mdc: true
transition: slide-left
hideInToc: true
---

# Package Dependencies & Bundling

How I reduced bundle size of internal packages by

---

# How NPM Installs Dependencies

npm v3+ uses a flat structure with hoisting:

````md magic-move
```
# What you might expect (nested)
node_modules/
├── package-a/
│   └── node_modules/
│       └── dep@1/
└── package-b/
    └── node_modules/
        └── dep@2/
```

```
# What npm actually does (hoisted)
node_modules/
├── package-a/
├── package-b/
└── lodash@4.17.21/    # Hoisted to top level
```

```
# When versions conflict (partially nested)
node_modules/
├── package-a/
│   └── node_modules/
│       └── lodash@4.17.20/   # Can't hoist, conflicts
├── package-b/
└── lodash@4.17.21/    # Hoisted (most common version)
```
````

---

## npm3 Duplication

**Key insight:** Install order matters. When version ranges don't overlap, npm creates nested copies.

```
my-app/
├── node_modules/
│   ├── module-a/           # requires lodash@^3.0.0
│   │   └── node_modules/
│   │       └── lodash@3.10.1/   # Nested (can't share)
│   ├── module-b/           # requires lodash@^4.0.0
│   └── lodash@4.17.21/     # Hoisted
```

Read more: [npm3 Duplication](https://npm.github.io/how-npm-works-docs/npm3/duplication.html)

---
hideInToc: true
---

# Agenda

<Toc minDepth="1" maxDepth="1" />

---

# dependencies vs peerDependencies

- **dependencies** - "Install this for me" - npm installs it in your package
- **peerDependencies** - "I expect you to have this" - declares compatibility
- **devDependencies** - Build-time only, not shipped to consumers

---

## When to Use Each

````md magic-move
```json
{
  "name": "@accurx/design",
  "dependencies": {
    "es-toolkit": "^1.0.0",
    "radix-ui": "^1.0.0"
  }
}
```

```json
{
  "name": "@accurx/design",
  "dependencies": {
    "es-toolkit": "^1.0.0",
    "radix-ui": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-router": "^6.0.0"
  }
}
```

```json
{
  "name": "@accurx/design",
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
  }
}
```

```json
{
  "name": "@accurx/design",
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

## Why Peers in devDependencies Too?

- **peerDependencies** → tells consumers what to install
- **devDependencies** → ensures YOU have them during development

Without peers in devDependencies, you can't run tests or dev server!

---

## Why peerDependencies Matter

**The singleton problem (React, Vue, etc):**

These libraries require a single instance - multiple copies break state/hooks.

With `dependencies`:
- You're saying "install this version for me"
- If consumer has a different version → two copies

With `peerDependencies`:
- You're saying "I'm compatible with this range"
- npm prefers the consumer's existing copy if it matches

**Note:** peerDependencies doesn't *guarantee* single copy - it *declares compatibility*. Duplicates happen when version ranges don't overlap.

---

# peerDependenciesMeta

Making peer dependencies optional

---

## The optional Flag

When a package works with multiple frameworks:

````md magic-move
```json
{
  "name": "universal-state",
  "peerDependencies": {
    "react": "^18.0.0",
    "vue": "^3.0.0"
  }
}
```

```json
{
  "name": "universal-state",
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
````

**What `optional: true` does:**
- npm won't warn if the peer is missing
- npm won't auto-install it
- Your code must handle the missing dependency

---

## When to Use Optional Peers

- **Multi-framework support** - React OR Vue OR Svelte
- **Optional integrations** - Works alone, enhanced with X
- **TypeScript types** - `@types/*` packages as optional peers

```json
{
  "peerDependencies": {
    "@types/react": "^18.0.0"
  },
  "peerDependenciesMeta": {
    "@types/react": { "optional": true }
  }
}
```

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
