---
theme: default
title: Package Dependencies & Bundling
layout: intro
mdc: true
transition: slide-left
hideInToc: true
---

# Package Dependencies & Bundling

Everything you need to know when publishing NPM packages

---
hideInToc: true
---

# Agenda

<Toc minDepth="1" maxDepth="1" />

---

# dependencies vs peerDependencies

The three types of dependencies in package.json

---

## The Three Dependency Types

<v-clicks>

- **dependencies** - Installed automatically with your package
- **peerDependencies** - Consumer must provide (ensures single instance)
- **devDependencies** - Build-time only, not shipped to consumers

</v-clicks>

---

## When to Use Each

````md magic-move
```json
{
  "name": "my-utils",
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

```json
{
  "name": "react-date-picker",
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
```

```json
{
  "name": "react-date-picker",
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```
````

---

## Why peerDependencies Matter

<v-clicks>

**The React singleton problem:**

If your package bundles its own React:
- Consumer's app has React 18.2.0
- Your package ships React 18.1.0
- **Result:** Two React instances = hooks break!

</v-clicks>

<v-click>

**Solution:** Use peerDependencies

```json
{
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0"
  }
}
```

</v-click>

---

## Real World Example

````md magic-move
```json
// A utility library - bundles everything
{
  "name": "@company/utils",
  "dependencies": {
    "date-fns": "^3.0.0",
    "uuid": "^9.0.0"
  }
}
```

```json
// A React component library - peers React
{
  "name": "@company/ui",
  "dependencies": {
    "clsx": "^2.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

```json
// A plugin - peers the host library
{
  "name": "vite-plugin-svg",
  "peerDependencies": {
    "vite": "^5.0.0"
  }
}
```
````

---

# peerDependenciesMeta

Making peer dependencies optional

---

## The optional Flag

<v-click>

When a package works with multiple frameworks:

</v-click>

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

<v-click>

**What `optional: true` does:**
- npm won't warn if the peer is missing
- npm won't auto-install it
- Your code must handle the missing dependency

</v-click>

---

## When to Use Optional Peers

<v-clicks>

- **Multi-framework support** - React OR Vue OR Svelte
- **Optional integrations** - Works alone, enhanced with X
- **TypeScript types** - `@types/*` packages as optional peers

</v-clicks>

<v-click>

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

</v-click>

---

# How NPM Installs Dependencies

Understanding node_modules structure

---

## Flat vs Nested node_modules

<v-click>

**npm v3+ uses a flat structure with hoisting:**

</v-click>

````md magic-move
```
# What you might expect (nested)
node_modules/
├── package-a/
│   └── node_modules/
│       └── lodash@4.17.20/
└── package-b/
    └── node_modules/
        └── lodash@4.17.21/
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

## Package Manager Differences

<v-clicks>

| Feature | npm | pnpm | yarn |
|---------|-----|------|------|
| Storage | Flat copy | Symlinks + Store | PnP / node_modules |
| Disk usage | High | Low (shared) | Medium |
| Strictness | Loose | Strict | Configurable |
| Phantom deps | Allowed | Blocked | Depends |

</v-clicks>

<v-click>

**Phantom dependencies:** Using packages you didn't explicitly install (because they were hoisted from a transitive dependency)

</v-click>

---

## pnpm's Approach

````md magic-move
```
# npm - flat, allows phantom deps
node_modules/
├── my-dep/
├── transitive-dep/      # You can import this!
└── another-transitive/  # And this too!
```

```
# pnpm - symlinked, strict
node_modules/
├── .pnpm/               # Actual packages stored here
│   ├── my-dep@1.0.0/
│   └── transitive-dep@2.0.0/
└── my-dep -> .pnpm/my-dep@1.0.0/node_modules/my-dep
# transitive-dep is NOT accessible from your code
```
````

<v-click>

**Why this matters for package authors:**

Test your package with pnpm to catch missing dependencies early!

</v-click>

---

# To Bundle or Not to Bundle

Making the right decision for your dependencies

---

## Bundle vs External

<v-clicks>

**Bundle** (include in your dist):
- Small utilities you wrote
- Tiny dependencies (< 5KB)
- Dependencies you've modified

**Don't Bundle** (mark as external):
- Peer dependencies (React, Vue)
- Large dependencies (lodash, date-fns)
- Dependencies consumers likely have

</v-clicks>

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

<v-click>

```
Consumer's bundle:
├── your-package (15KB)
│   └── react (bundled, 45KB)  ❌ Duplicate!
└── react (45KB)

Total: 105KB (should be 60KB)
```

</v-click>

<v-click>

**Problems:**
- Duplicate code = larger bundles
- Multiple instances = broken state
- Can't tree-shake what you bundled

</v-click>

---

# The sideEffects Field

Enabling aggressive tree-shaking

---

## What are Side Effects?

<v-click>

Code that runs just by importing:

</v-click>

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

<v-click>

**Bundler support:**
- Webpack (introduced it)
- Rollup
- esbuild
- Vite
- Parcel

</v-click>

---

## The Impact

<v-click>

```js
// Consumer's code
import { Button } from 'my-ui-library'
// Only uses Button, not the other 50 components
```

</v-click>

<v-click>

**Without sideEffects: false**
- Bundler keeps all exports "just in case"
- Full library ends up in bundle

</v-click>

<v-click>

**With sideEffects: false**
- Bundler knows unused exports are safe to remove
- Only Button code is included

</v-click>

---

# Package Exports (Subentries)

Modern package entry points

---

## The exports Field

<v-click>

Replaces `main`, `module`, and `browser` fields:

</v-click>

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
    "./types": "./dist/types.js"
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

<v-click>

```js
// Consumer imports
import { core } from 'my-package'
import { helper } from 'my-package/utils'
import { useMyHook } from 'my-package/react'
```

</v-click>

---

## Subentries + Optional Peers

<v-click>

The powerful combination:

</v-click>

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

<v-click>

**Why this works:**
- Core functionality has no framework deps
- React users import `pkg/react` (only needs React)
- Vue users import `pkg/vue` (only needs Vue)
- No runtime errors from missing frameworks!

</v-click>

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
  "name": "@company/awesome-lib"
}
```

```json
{
  "name": "@company/awesome-lib",
  "type": "module",
  "sideEffects": false
}
```

```json
{
  "name": "@company/awesome-lib",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./react": {
      "types": "./dist/react.d.ts",
      "import": "./dist/react.js"
    }
  }
}
```

```json
{
  "name": "@company/awesome-lib",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./react": {
      "types": "./dist/react.d.ts",
      "import": "./dist/react.js"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true }
  }
}
```

```json
{
  "name": "@company/awesome-lib",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./react": {
      "types": "./dist/react.d.ts",
      "import": "./dist/react.js"
    }
  },
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true }
  },
  "dependencies": {
    "tiny-invariant": "^1.3.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsup": "^8.0.0",
    "vitest": "^1.0.0"
  }
}
```
````

---
layout: intro
---

# Key Takeaways

<v-clicks>

1. **dependencies** for what you bundle, **peerDependencies** for what consumers provide
2. **peerDependenciesMeta** makes peers optional (multi-framework support)
3. **Don't bundle** peer dependencies or large shared libs
4. **sideEffects: false** enables tree-shaking
5. **exports** with subentries = modular, tree-shakeable packages
6. Test with **pnpm** to catch missing dependencies

</v-clicks>

---
layout: intro
---

# Questions?

