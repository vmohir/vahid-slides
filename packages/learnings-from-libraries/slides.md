---
# try also 'default' to start simple
theme: default
# some information about your slides (markdown enabled)
title: Creating NPM libraries key takeaways
# apply UnoCSS classes to the current slide
layout: intro
class: text-center
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
# duration of the presentation
duration: 20min
transition: slide-left
---

# Creating NPM libraries

## Key takeaways

---

# Two new libraries

- `@accurx/eslint-plugin`: Custom ESLint rules for Accurx projects.
- `@accurx/migrate-scan`: A codebase scanning tool to help with large scale migrations.

Here's what I've learned while creating them:
- `node` supports ESM and TS
- `vite` library mode
- `npm link`
- `vite-plugin-dts`
- `publint`

---
layout: intro
---

# What is Node?

### And why as a frontend engineer should I care?


---
layout: two-cols-header
transition: slide-up
---

::left::

## Browser

<br>

The environment is the browser which is dynamic and not fixed.

Access to Window, Document, DOM, Fetch API, etc.


::right::

## Node

<br>

The environment uses the Node runtime. A fixed Node version is used (unless creating libraries).

Access to File System, Path, HTTP modules, etc.

<style> .two-cols-header { column-gap: 1rem; } </style>

---
layout: two-cols-header
transition: slide-up
---

::left::

## Browser

<br>

ESM with `<script type="module" />`

````md magic-move
```html
<script src="./script.js" />
```
```html
<script src="./script.js" type="module" />
```
````

````md magic-move
```js
var script = document.createElement('script');
script.src = 'module.js';
document.head.appendChild(script);
```
```js
import './module.js';
```
````


::right::

## Node

<br>

ESM with `.mjs` or `type: "module"` in `package.json`

````md magic-move
```sh
node ./script.cjs
```
```sh
node ./script.mjs
```
```sh
node ./script.js # with "type": "module"
```
```sh
node ./script.js # with "type": "module"

# Otherwise node determines the module type
# based on its content and gives a warning
```
```sh
node ./script.ts # supports erasable TypeScript
```
````

<style> .two-cols-header { column-gap: 1rem; } </style>

---
layout: two-cols-header
---

::left::

## Browser

Different browsers and versions.

Widely available baseline: features supported by core browsers (Chrome, Firefox, Safari, Edge)<br>for 30 months.

::right::

## Node

Versions: [nodejs.org/en/about/previous-releases](https://nodejs.org/en/about/previous-releases)

Even-numbered releases (20, 22, 24, etc.) are moved to Active LTS and critical bugs are fixed<br>for 30 months.

<style> .two-cols-header { column-gap: 1rem; } </style>

---
layout: intro
---

# Creating Node.js Libraries

### Is it different from web libraries?

---

Not much, except:
- Don't bundle dependencies by default
- If it's a CLI tool, add a `bin` field in `package.json`

---



- Use `vite` to bundle CLI tools and libraries
- `npm link` to test locally
- Use `vite-plugin-dts` to generate one `.d.ts` file
- Use `publint` to validate your package before publishing

---