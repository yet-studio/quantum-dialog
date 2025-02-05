# Guide de Style

## 🎨 Design System

### Couleurs
```css
:root {
  /* Primaires */
  --color-primary: rgba(121, 184, 255, 0.8);
  --color-secondary: rgba(133, 232, 157, 0.8);
  
  /* Neutres */
  --color-background: #ffffff;
  --color-text: #2c3e50;
  --color-muted: rgba(0, 0, 0, 0.6);
  
  /* États */
  --color-hover: rgba(0, 0, 0, 0.05);
  --color-active: rgba(0, 0, 0, 0.1);
  --color-focus: rgba(0, 0, 0, 0.2);
}
```

### Typographie
```css
:root {
  /* Tailles */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Hauteurs de ligne */
  --line-height-tight: 1.25;
  --line-height-base: 1.5;
  --line-height-loose: 1.75;
  
  /* Espacements */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
}
```

### Espacement
```css
:root {
  /* Base 4px */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

### Animations
```css
:root {
  /* Durées */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  
  /* Courbes */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}
```

## 🖼 Composants

### Messages
```css
.message {
  padding: var(--space-4);
  border-radius: var(--space-2);
  background: var(--color-background);
  transition: all var(--duration-normal) var(--ease-out);
}

.message:hover {
  transform: translateY(-2px);
}
```

### Émetteur
```css
.sender {
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--space-2);
}
```

### Contenu
```css
.message-content {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text);
}
```

## 📐 Layout

### Grille
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

### Flexbox
```css
.flex {
  display: flex;
  gap: var(--space-4);
}

.flex-col {
  flex-direction: column;
}
```

## 📱 Responsive

### Breakpoints
```css
/* Mobile first */
@media (min-width: 640px) {
  /* Small */
}

@media (min-width: 768px) {
  /* Medium */
}

@media (min-width: 1024px) {
  /* Large */
}

@media (min-width: 1280px) {
  /* Extra Large */
}
```

## 🎭 États

### Interaction
```css
.interactive {
  transition: all var(--duration-fast) var(--ease-out);
}

.interactive:hover {
  background: var(--color-hover);
}

.interactive:active {
  background: var(--color-active);
}

.interactive:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-focus);
}
```

## 🌗 Thèmes

### Variables
```css
/* Clair (défaut) */
:root {
  --bg-primary: #ffffff;
  --text-primary: #2c3e50;
}

/* Sombre */
[data-theme="dark"] {
  --bg-primary: #2c3e50;
  --text-primary: #ffffff;
}
```

## 📏 Conventions

### Nommage
- BEM (Block Element Modifier)
- Préfixes fonctionnels
- Namespace pour les utilitaires

### Structure
- Mobile first
- Composants isolés
- Variables réutilisables
- Documentation inline

### Performance
- Minimiser les spécificités
- Éviter les !important
- Optimiser les animations
- Regrouper les media queries
