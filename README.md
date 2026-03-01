# JU Design

A personal React component library by Julien Lietard.

## Installation

```bash
pnpm add ju-library
```

## Usage

```tsx
import { JUButton } from 'ju-library';
import 'ju-library/tokens'; // load design tokens

<JUButton label="Click me" variant="primary" />
```

## Development

```bash
pnpm install        # install dependencies
pnpm dev            # start Storybook
pnpm build          # build the library
pnpm test           # run tests
```

## Stack

- React 18 + TypeScript
- tsup (build)
- Storybook 8
- Vitest
- CSS Modules + CSS Custom Properties
