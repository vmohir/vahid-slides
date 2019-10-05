class: center, middle

## Typescript Fundamentals

_By: Vahid Mohammadi_

<div class="fz-14">
    <i>Created with: <a href="https://github.com/gnab/remark">RemarkJS</a></i>
</div>

---

## Typescript Get Started

<div class="doc-link">
    <a href="http://www.typescriptlang.org/docs/handbook/tsconfig-json.html">Tsconfig Doc</a>
    <a href="http://www.typescriptlang.org/docs/handbook/compiler-options.html">CompilerOptions Doc</a>
</div>

Things to note:

-   `npm i typescript` and `tsc` command
-   Configuration: `tsconfig.json`
    -   `files`, `include`, `exclude`
    -   `extends`
    -   Compileroptions:
        -   `baseUrl`
        -   `paths`
        -   `strict` flags
        -   `noUnusedLocals`
        -   `noUnusedParameters`

---

## Basic Types

<div class="doc-link">
    <a href="http://www.typescriptlang.org/docs/handbook/basic-types.html">Basic Types Doc</a>
    <a href="http://www.typescriptlang.org/docs/handbook/interfaces.html">Interfaces Doc</a>
</div>

-   boolean, number, string
-   any, never, void
-   null, undefined
-   array, object, .note[interface]
-   index

???
interface:
مث آبجکت جاواسکریپت نیس که بتونی بهش یه چیزی اضافه کنی.

```js
const newObj: NewType = { ...oldObj, key: value };
const newArray: NewType = oldArray.map < OldType > (old => ({ ...old, key: value }));
```

---

## Interfaces
