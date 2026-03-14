# Signup Flow

A pixel-faithful, production-grade React + TypeScript implementation of a multi-step account creation flow, built from a Figma design. 
---

## Live Demo

> Deploy with: `npx vercel --prod`  

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI library |
| TypeScript (strict) | Type safety throughout |
| Vite | Dev server and bundler |
| Pure CSS | Styling via CSS custom properties — no runtime dependencies |

No component libraries, no Tailwind, no CSS-in-JS. Zero styling runtime overhead.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── AccountType.tsx     # Step 1 — Personal / Business radio card selector
│   ├── OTPInput.tsx        # Step 2 — Phone input with country dropdown
│   │                       # Step 3 — 4-digit OTP boxes with auto-advance
│   ├── NameForm.tsx        # Step 4 — First name + Last name fields
│   ├── PasswordForm.tsx    # Step 5 — Password + confirm, strength meter, eye toggle
│   ├── SuccessDialog.tsx   # Final modal — account summary + security note
│   └── Illustration.tsx    # Inline SVG illustration (no external image assets)
├── pages/
│   └── SignupFlow.tsx      # Two-panel layout shell, renders the active step
├── hooks/
│   └── useSignupFlow.ts    # All state, validation, navigation, and async logic
├── icon/
│   └── Icon.ts            # All used Icons in svg.
├── index.css               # Design system — CSS variables, resets, all component styles
└── main.tsx                # App entry point
```

---

## Architecture

### Single custom hook as the source of truth

All form state, error state, loading state, and navigation logic lives in `useSignupFlow`. Components receive data via props and fire callbacks — they own no state of their own. This separation means:

- Components are easy to read and test in isolation
- The entire flow's behaviour can be understood by reading one file
- Swapping a component (e.g. replacing `NameForm`) requires zero changes to the hook

### Presentational components only

Every component in `/components` is purely presentational. No `useState`, no side effects — just props in, JSX out (with the exception of `OTPInput` which manages the country dropdown's open/closed state locally, since that is genuinely UI-only state that nothing else cares about, and `PasswordForm` which manages show/hide password locally for the same reason).

### Step-scoped validation

`validateStep(step, data)` runs only against the fields relevant to the current step. This means:

- Users are never shown errors for steps they haven't reached yet
- Each field's error clears the moment the user starts correcting it
- The OTP step clears all boxes and triggers a shake animation on failure, forcing a clean re-entry

### Progress bar

Computed as `(stepIndex + 1) / TOTAL_STEPS * 100` and applied as a CSS `width`. The CSS `transition` on that property handles the animation — no JavaScript animation library needed.

---

## Design Decisions

### No routing library

The flow is a single linear sequence with no URLs, back/forward browser history, or deep linking. A `step` string in `useState` is the entire router. Adding React Router here would be unnecessary weight.

### SVG illustration

The illustration is a hand-coded SVG component rather than an imported image file. This means no extra network request, no broken image fallbacks, and the illustration scales perfectly at any resolution.

### Country code dropdown built from scratch

Rather than pulling in a library (which would add significant bundle weight for one input), the country selector is a ~60-line component using a `<ul>` with `role="listbox"`, keyboard-accessible, with a search filter and `onBlur` outside-click dismissal.

### Async simulation

`goNext` includes a `setTimeout` delay to simulate a real API call. The button shows a CSS spinner during this time and is disabled to prevent double-submission. Replacing the delay with a real `fetch` requires changing one line.

---

## Enhancements Beyond the Figma

- **Country code dropdown** — searchable list of 16 countries with emoji flags, dial codes, and keyboard accessibility. The Figma showed a static `+1` label.
- **OTP paste support** — pasting a 4-digit code fills all boxes at once and auto-focuses the last.
- **Password strength meter** — live 4-bar indicator with text label, not in the original spec.
- **Password visibility toggle** — show/hide button on both password fields.
- **Confirm password match indicator** — input border turns green when passwords match.
- **Masked phone number** — OTP screen shows `834•••••39` instead of the raw number.
- **Accessible markup** — `aria-label`, `aria-invalid`, `aria-expanded`, `role="listbox"`, `role="option"` used throughout.

---

## Demo Credentials

| Field | Value |
|---|---|
| Phone | Any number ≥ 7 digits |
| OTP code | `1234` |
| Password | Any string ≥ 6 characters |
