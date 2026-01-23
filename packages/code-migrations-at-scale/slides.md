---
theme: default
title: Visualising and Enabling Code Migrations at Scale
layout: intro
mdc: true
fonts:
  # basically the text
  sans: Gabarito
  weights: '200,400,700'
  # use with `font-serif` css class from UnoCSS
  serif: Newsreader
  # for code blocks, inline code, etc.
  mono: Fira Code
  
hideInToc: true
---

<img src="./accurx-logo.svg" class="h-4" />
<br>

<h1><span class="the-gradient">Visualising and Enabling</span>Visualising and Enabling Code Migrations at Scale</h1>

<style>
h1 {
    position: relative;
}
.the-gradient {
    background-image: linear-gradient(to right, #a4ffea, white);
    color: transparent;
    background-clip: text;
    position: absolute;
    top: 0;
    left: 0;
    text-shadow: none;
}
</style>

---
hideInToc: true
---

# Agenda

<Toc minDepth="1" maxDepth="1" />

---

# Why Code Migration is Hard at Scale

You can't do the migration in one big commit.

- **Hard to test** - too many changes to verify correctness
- **Huge PR to review** - no one wants to review 500+ files
- **Git blame destroyed** - one commit owns all the history
- **Risk of breakage** - one mistake affects everything

<v-click>

The only exception: **code formatting** changes

- Can use `.git-blame-ignore-revs` to hide formatting commits
- But this doesn't work for semantic changes!

</v-click>

---

## Example: TypeScript verbatimModuleSyntax

Adding explicit `import type` and `export type`:

````md magic-move
```ts
// Before: ambiguous imports
import { User, UserService } from './user'
export { User }
```

```ts
// After: explicit type imports
import type { User } from './user'
import { UserService } from './user'
export type { User }
```
````

<v-click>

Why migrate?
- Required for `verbatimModuleSyntax: true`
- Better tree-shaking
- Clearer intent in code
- Faster TypeScript compilation

</v-click>

---

# Good Solutions for Code Migration

Migrate gradually, track progress, delegate ownership.

---

## 1. Automated Codemods

Use tools to transform code automatically:

- **jscodeshift** - Facebook's codemod toolkit
- **ts-morph** - TypeScript-specific transformations
- **ESLint with --fix** - for simple patterns

```bash
# Run codemod on specific directory
npx jscodeshift -t ./transforms/add-type-imports.ts ./src/components
```

Codemods let teams migrate their own code on their own schedule.

---

## 2. Lint Rules to Prevent Regression

Once migrated, prevent old patterns from coming back:

```js
// eslint.config.js
export default [
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
    }
  }
]
```

- Error on old patterns in new code
- Can start as `warn` and escalate to `error`

---

## 3. Track Progress with Dashboards

Visualize migration status across the codebase:

- Files migrated vs remaining
- Progress per team/package
- Burndown charts

Tools:
- Custom scripts + spreadsheets
- Grafana dashboards
- GitHub Projects for tracking

---

## 4. Divide and Delegate

Assign ownership to teams:

| Team | Package | Status |
|------|---------|--------|
| Platform | @accurx/core | ✅ Done |
| Frontend | @accurx/design | 🔄 In Progress |
| Backend | @accurx/api | ⏳ Not Started |

- Each team migrates code they own
- Set deadlines per team
- Provide codemods and documentation

---

## 5. CI Gates for New Code

Block old patterns in modified files:

```yaml
# In CI pipeline
- name: Check migration compliance
  run: |
    # Only lint files changed in this PR
    FILES=$(git diff --name-only origin/main)
    npx eslint $FILES --rule '@typescript-eslint/consistent-type-imports: error'
```

- New code must follow new patterns
- Gradually shrinks the migration surface

---

## 6. Deprecation Warnings

For runtime migrations, warn before removing:

```ts
/** @deprecated Use `fetchUser` instead. Will be removed in v3.0 */
export function getUser(id: string) {
  console.warn('getUser is deprecated, use fetchUser instead')
  return fetchUser(id)
}
```

- Gives teams time to migrate
- Makes usage visible in logs/monitoring

---

# Summary

1. **Don't do big-bang migrations** - they're risky and hard to review
2. **Use codemods** - automate the transformation
3. **Add lint rules** - prevent regression
4. **Track progress** - visualize with dashboards
5. **Delegate to teams** - they own their code
6. **Gate CI** - enforce new patterns in new code
7. **Deprecate gradually** - warn before removing
