---
theme: default
title: Visualising and Enabling Code Migrations at Scale
layout: intro
mdc: true
transition: slide-left
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

# Tech Radar

<div class="radar-wrapper">
  <div class="radar">
<div class="ring ring-4"></div>
<div class="ring ring-3"></div>
<div class="ring ring-2"></div>
<div class="ring ring-1"></div>
<div class="crosshair horizontal"></div>
<div class="crosshair vertical"></div>
<div class="center-dot"></div>

<span class="ring-label adopt-label">Adopt</span>
<span class="ring-label trial-label">Trial</span>
<span class="ring-label assess-label">Assess</span>
<span class="ring-label hold-label">HOLD</span>

<div class="blip adopt" style="top: 38%; right: 49%;">
  <span class="blip-dot"></span>
  <span class="blip-label">es-toolkit</span>
</div>
<div class="blip adopt" style="bottom: 38%; right: 48%;">
  <span class="blip-dot"></span>
  <span class="blip-label">date-fns</span>
</div>
<div class="blip trial" style="top: 30%; right: 58%;">
  <span class="blip-dot"></span>
  <span class="blip-label">es-toolkit/compat</span>
</div>
<div class="blip hold" style="top: 18%; right: 70%;">
  <span class="blip-dot"></span>
  <span class="blip-label">Lodash</span>
</div>
<div class="blip hold" style="bottom: 12%; right: 58%;">
  <span class="blip-dot"></span>
  <span class="blip-label">Moment</span>
</div>
<div class="scan-line"></div>
  </div>
</div>

<style>
.radar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}
.radar {
  position: relative;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,50,30,0.8) 0%, rgba(0,20,10,0.95) 70%);
  box-shadow: 0 0 60px rgb(0 130 76 / 10%), inset 0 0 80px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0,255,150,0.2);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
box-shadow: none;
}
.ring-1 { width: 22%; height: 22%; border-color: rgba(74,222,128,0.1); }
.ring-2 { width: 44%; height: 44%; border-color: rgba(250,204,21,0.1); }
.ring-3 { width: 66%; height: 66%; border-color: rgba(251,146,60,0.1); }
.ring-4 { width: 88%; height: 88%; border-color: rgba(239,68,68,0.1); }
.crosshair {
  position: absolute;
  background: rgba(0,255,150,0.1);
}
.crosshair.horizontal {
  width: 100%;
  height: 1px;
  top: 50%;
}
.crosshair.vertical {
  width: 1px;
  height: 100%;
  left: 50%;
}
.center-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #4ade80;
}
.ring-label {
  position: absolute;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  top: 45%;
  font-weight: 600;
  opacity: 0.2;
}
.adopt-label { left: 53%; color: #4ade80; }
.trial-label { left: 64%; color: #facc15; }
.assess-label { left: 75%; color: #fb923c; }
.hold-label { left: 86%; color: #ef4444; }
.blip {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
}
.blip-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
  flex-shrink: 0;
}
.blip.adopt .blip-dot { background: #4ade80; color: #4ade80; }
.blip.trial .blip-dot { background: #facc15; color: #facc15; }
.blip.assess .blip-dot { background: #fb923c; color: #fb923c; }
.blip.hold .blip-dot { background: #ef4444; color: #ef4444; }
.blip-label {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.9);
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
}
.blip-label.right {
  order: -1;
  text-align: right;
}
.scan-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, rgba(0,255,150,0.8), transparent);
  transform-origin: left center;
  animation: scan 15s linear infinite;
  box-shadow: 0 0 15px rgba(0,255,150,0.5);
opacity: 0.7;
}
@keyframes scan {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

---

# Why Code Migration is Hard at Scale

You can't do migrations in one big commit.

- Hard to test
- Huge PR to review
- Git blame becomes useless
- Lots of merge conflicts
- Difficult to revert if something goes wrong

<v-click>

<br>

#### One exception: **code formatting**

Can use `.git-blame-ignore-revs` to hide formatting commits

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

---

# How a good migration strategy looks

<v-clicks depth="2">

1. **Detect legacy patterns**:
    - Regex (grep)
    - Linters
    - `hasLegacyCode(file, migration): boolean`
2. **Migrate gradually**:
    - Owned by teams
    - Guideline
    - Fail CI for new code
3. **Track progress**:
    - Easy to see remaining work
    - Incentivise completion

</v-clicks>

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
