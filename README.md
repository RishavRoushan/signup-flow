# Signup Flow

Pixel-faithful React + TypeScript implementation of the Figma login/signup flow.

## Stack
- **React 18** + **TypeScript** (strict)
- **Vite** — dev server & build
- **Pure CSS** — design tokens via CSS custom properties, zero runtime deps

## Getting Started

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

Deploy:
```bash
npx vercel --prod
# or drag /dist to netlify.com/drop after build
```

## Project Structure

```
src/
├── components/
│   ├── AccountType.tsx     # Step 1 — Personal / Business radio cards
│   ├── OTPInput.tsx        # Step 2 (PhoneInput) + Step 3 (OTPBoxes)
│   ├── NameForm.tsx        # Step 4 — First & Last name fields
│   ├── PasswordForm.tsx    # Step 5 — New + confirm password, strength meter
│   ├── SuccessDialog.tsx   # Final modal overlay with account summary
│   └── Illustration.tsx    # SVG illustration (orange-shirt seated figure)
├── pages/
│   └── SignupFlow.tsx      # Orchestrates all steps, renders the two-panel layout
├── hooks/
│   └── useSignupFlow.ts    # All state, validation, navigation logic
├── index.css               # Global design system (CSS variables, all component styles)
└── main.tsx                # Entry point
```

## Design Decisions

### State in one hook
`useSignupFlow` owns everything — form data, errors, loading, step. Pages and components
are pure presentational; they receive props and fire callbacks. Makes testing trivial.

### Pure CSS, no UI library
The design system lives entirely in `index.css` using CSS custom properties. No Tailwind,
no CSS-in-JS. This keeps the bundle tiny and makes the token system explicit and inspectable.

### Validation strategy
- Validates only the *current* step's fields on "Continue"
- Clears a field's error as soon as the user starts editing it
- OTP error triggers shake animation and clears all boxes, forcing re-entry

### Progress bar
Calculated from `(stepIndex + 1) / totalSteps * 100`. Animates with CSS transition on width.

## Demo Credentials
- **OTP code:** `1234`
- Any phone number ≥ 9 digits is accepted
- Any password ≥ 6 characters is accepted
