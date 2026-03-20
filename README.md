# JU Design

Bibliotheque de composants React personnelle, construite autour d'une esthetique **Glassmorphism 2.0** white-first.

67 composants — Atoms, Molecules, Organisms, Layouts, Widgets — types TypeScript, animes en CSS pur, avec support dark mode natif.

## Installation

```bash
pnpm add ju-library
```

Peer dependencies requises :

```bash
pnpm add react react-dom lucide-react prismjs
```

## Utilisation

```tsx
import { JUButton, JUCard, JUModal } from 'ju-library';
import 'ju-library/styles';   // styles complets (tokens + reset + composants)
```

Pour importer uniquement les design tokens :

```tsx
import 'ju-library/tokens';
```

### Dark mode

Le theming fonctionne via l'attribut `data-theme` sur un element parent :

```html
<div data-theme="dark">
  <JUButton label="Action" variant="primary" />
</div>
```

Sans attribut explicite, le systeme respecte la preference OS via `prefers-color-scheme`.

## Composants

| Categorie | Nb | Exemples |
|-----------|----|----------|
| **Atoms** | 10 | Button, Badge, Avatar, Switch, Divider, PingDot, Status, Signature, UserPill, Typography |
| **Molecules** | 17 | Input, Card, SearchBar, AskBar, Breadcrumbs, Pagination, Skeleton, Toast, Tooltip, ChatBubble, Callout, TextField, TagInput, Slider, VideoPlayer, SectionHeader, CodeBlock |
| **Organisms** | 17 | Modal, Editor, FileUpload, Carousel, Dock, ContextualMenu, CommandPalette, StatCard, NotificationCenter, StepWizard, AuthPanel, Timeline, CreditCard, ProjectCard, CommentThread, CommentBox, SubCalendar |
| **Layouts** | 2 | Sidebar, Island |
| **Widgets** | 21 | NerveCenter, GPUPulse, PriorityHorizon, BioSync, SystemHealth, WorkflowTrigger, ModelSelector, TemporalBridge, GlobalContext, SemanticRadar, AppAudit, GitPulse, DigestSentinel, DependencyGuardian, TaskCard, FeedLayout, PricingCard, WelcomeCard, ReferralCard, FinancialFlow, QuoteFooter |

Chaque composant est disponible dans le [Storybook](https://storybook.ju-design.dev) avec des controles interactifs.

## Design Tokens

Les tokens sont definis en CSS Custom Properties dans `src/tokens/tokens.css` :

- **Couleurs** : primary (`#1b82ff`), accent (`#ff4e6b`), danger, success, warning, info + echelle de gris
- **Typographie** : Inter Variable, tailles xs a xl, graisses 400-700
- **Spacing** : xs (4px) a 2xl (48px)
- **Radius** : sm (8px) a full (999px) — rounded par defaut
- **Shadows** : ultra-diffuses, 4 niveaux de profondeur
- **Glass** : surfaces translucides avec blur, variantes subtle/default/strong
- **Animations** : easings bounce, smooth, spring + durations fast/normal/slow

## Stack technique

- React 18/19 + TypeScript (strict)
- [tsup](https://tsup.egoist.dev) — build ESM + CJS
- [Storybook 8](https://storybook.js.org) — documentation et playground
- [Vitest](https://vitest.dev) + Testing Library — 55 suites de tests
- CSS Modules + CSS Custom Properties — zero runtime CSS-in-JS
- Animations en CSS pur — aucune dependance d'animation externe

## Developpement

```bash
pnpm install          # installer les dependances
pnpm dev              # lancer Storybook (port 6006)
pnpm build            # compiler la bibliotheque
pnpm test             # lancer les tests
pnpm test:watch       # tests en mode watch
pnpm lint             # type-check (tsc --noEmit)
```

## Structure du projet

```
src/
  components/         # 67 composants (un dossier par composant)
    ju-button/
      ju-button.tsx          # composant
      ju-button.css          # styles (CSS Module)
      ju-button.test.tsx     # tests
      ju-button.stories.tsx  # story Storybook
  tokens/
    tokens.css        # design tokens (custom properties)
  styles/
    reset.css         # reset CSS minimal
  index.ts            # barrel export (API publique)
```

## Licence

MIT — Julien Lietard
