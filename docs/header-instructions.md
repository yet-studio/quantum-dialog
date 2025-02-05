# Header Sticky avec Scale - Itération 2/10

## Vue d'ensemble

### Objectifs Atteints (Itération 1)
- Structure HTML simple
- Détection basique de la hauteur
- Throttling des events scroll

### Focus Itération 2
- Transitions fluides
- Séparateur sticky

## Solution

### HTML
```html
<header>
  <h1>Titre</h1>
  <hr>
  <div class="content">Contenu</div>
</header>
```

### CSS
```css
:root {
  --bg: #1B1F23;
  --mix: color-mix(in srgb, var(--bg) 90%, white);
  --pad: 20px;
}

header {
  background: var(--bg);
}

h1 {
  position: sticky;
  top: 0;
  margin: 0;
  padding: var(--pad);
  background: var(--mix);
  transform-origin: 0 0;
  transition: transform .2s;
  contain: layout;
}

hr {
  position: sticky;
  top: calc(1.2em + 2 * var(--pad));
  height: 1px;
  margin: 0;
  border: 0;
  background: white;
  opacity: .1;
}

:where(header[data-scrolled]:not([data-multi])) h1 {
  transform: scale(.8);
}
```

### JavaScript
```javascript
const header = document.querySelector('header');
const title = header.querySelector('h1');

const update = () => {
  const isMultiLine = title.offsetHeight > parseFloat(getComputedStyle(title).lineHeight);
  header.toggleAttribute('data-multi', isMultiLine);
  header.toggleAttribute('data-scrolled', scrollY > 0);
};

addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
addEventListener('resize', update, { passive: true });

requestAnimationFrame(update);
```

### Améliorations
1. Transition CSS plutôt que JS
2. Séparateur indépendant et sticky
3. RequestAnimationFrame pour les performances
4. Toggle de classe pour plus de propreté

### Prochain Focus (Itération 3)
1. Gestion des cas limites (resize, etc)
2. Nettoyage des listeners
3. Meilleure détection de la hauteur

```html
<!-- Structure HTML avec séparation des responsabilités -->
<header class="header" data-component="sticky-header">
    <div class="header-title" data-sticky="true">
        <!-- Container principal pour le titre -->
        <div class="title-content">
            <h1>Titre Principal</h1>
        </div>
        <!-- Séparateur avec gestion indépendante -->
        <div class="header-separator" data-sticky="true"></div>
    </div>
    <!-- Container pour le reste du contenu -->
    <div class="header-content">
        <!-- Contenu additionnel -->
    </div>
</header>
```

```css
/* Base styles avec custom properties pour la configuration */
.header {
    --header-bg: #1B1F23;
    --header-height: 60px;
    --header-padding: 20px;
    --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
    --transition-duration: 300ms;
    
    position: relative;
    color: #D1D5DA;
}

/* Gestion du sticky avec containment pour les performances */
.header-title {
    position: sticky;
    top: 0;
    z-index: 10;
    contain: layout;
    /* Prévention des artifacts visuels */
    backface-visibility: hidden;
    transform-style: preserve-3d;
    /* Support des anciens navigateurs */
    @supports not (position: sticky) {
        position: fixed;
        width: 100%;
    }
}
```

```javascript
// Classe pour la gestion du header
class StickyHeader {
    constructor(element) {
        this.header = element;
        this.title = element.querySelector('.header-title');
        this.initialized = false;
        
        // Vérification de support
        this.supportsSticky = CSS.supports('position', 'sticky');
        
        // Initialisation sécurisée
        if (this.validateElements()) {
            this.init();
        }
    }
    
    validateElements() {
        return this.header && this.title;
    }
    
    init() {
        if (this.initialized) return;
        
        // Fallback pour les navigateurs sans support sticky
        if (!this.supportsSticky) {
            this.setupFallback();
        }
        
        // Monitoring des changements
        this.setupObservers();
        
        this.initialized = true;
    }
    
    setupObservers() {
        // Intersection Observer pour la détection de sticky
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            { threshold: [0, 1] }
        );
        this.observer.observe(this.title);
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            this.header.classList.toggle(
                'is-sticky',
                entry.intersectionRatio < 1
            );
        });
    }
}

// Initialisation sécurisée
document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('[data-component="sticky-header"]');
    headers.forEach(header => new StickyHeader(header));
});
```

### 2. Effet de réduction intelligent
> "avec effet de réduction sur une ligne max et sinon -20%"

```typescript
// Types pour la configuration et les états
interface HeaderConfig {
    readonly SCALE_SINGLE_LINE: number;      // Échelle pour titre une ligne
    readonly SCALE_MULTI_LINE: number;       // Échelle pour titre multi-lignes
    readonly SCROLL_THRESHOLD: number;       // Seuil de déclenchement
    readonly TRANSITION_DURATION: number;    // Durée transition (ms)
    readonly DEBOUNCE_DELAY: number;        // Délai debounce (ms)
    readonly MEASUREMENT_PRECISION: number;  // Précision mesure ligne
}

interface HeaderState {
    isAnimating: boolean;
    currentScale: number;
    lineCount: number;
    scrollPosition: number;
    hasScrolled: boolean;
}

// Gestionnaire principal du header
class HeaderScaleManager {
    private static instance: HeaderScaleManager;
    private config: HeaderConfig;
    private state: HeaderState;
    private elements: {
        header: HTMLElement;
        title: HTMLElement;
        content: HTMLElement;
    };

    private constructor() {
        this.config = {
            SCALE_SINGLE_LINE: 0.8,
            SCALE_MULTI_LINE: 0.8,
            SCROLL_THRESHOLD: 50,
            TRANSITION_DURATION: 300,
            DEBOUNCE_DELAY: 150,
            MEASUREMENT_PRECISION: 1.2
        };

        this.state = {
            isAnimating: false,
            currentScale: 1,
            lineCount: 0,
            scrollPosition: 0,
            hasScrolled: false
        };
    }

    static getInstance(): HeaderScaleManager {
        if (!HeaderScaleManager.instance) {
            HeaderScaleManager.instance = new HeaderScaleManager();
        }
        return HeaderScaleManager.instance;
    }

    // Initialisation sécurisée
    init(headerSelector: string): void {
        try {
            this.validateAndSetElements(headerSelector);
            this.setupLineDetection();
            this.setupScrollHandling();
            this.setupResizeHandling();
            this.setupMutationObserver();
            
            // État initial
            this.measureLines();
            this.updateScale(true);
        } catch (error) {
            console.error('Header initialization failed:', error);
        }
    }

    // Détection précise du nombre de lignes
    private measureLines(): void {
        const titleElement = this.elements.title;
        
        // Création d'un clone pour mesure précise
        const clone = titleElement.cloneNode(true) as HTMLElement;
        clone.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: normal;
            width: ${titleElement.offsetWidth}px;
        `;
        document.body.appendChild(clone);

        // Mesure précise avec Range
        const range = document.createRange();
        range.selectNodeContents(clone);
        const rects = range.getClientRects();
        
        // Calcul avec précision configurable
        const lineHeight = parseInt(getComputedStyle(clone).lineHeight);
        const totalHeight = clone.offsetHeight;
        const preciseLineCount = totalHeight / lineHeight;
        
        this.state.lineCount = Math.ceil(preciseLineCount / this.config.MEASUREMENT_PRECISION);
        
        // Nettoyage
        document.body.removeChild(clone);
        range.detach();
    }

    // Gestion optimisée du scroll avec RAF
    private handleScroll = (): void => {
        if (this.state.isAnimating) return;

        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset;
            const shouldScale = this.state.lineCount <= 1;
            
            if (shouldScale) {
                const progress = Math.min(scrollTop / this.config.SCROLL_THRESHOLD, 1);
                const targetScale = this.calculateScale(progress);
                this.animateScale(targetScale);
            } else if (!this.state.hasScrolled && scrollTop > 0) {
                this.state.hasScrolled = true;
                this.animateScale(this.config.SCALE_MULTI_LINE);
            }
        });
    };

    // Animation fluide avec gestion des performances
    private animateScale(targetScale: number): void {
        if (this.state.currentScale === targetScale) return;

        this.state.isAnimating = true;
        const startScale = this.state.currentScale;
        const startTime = performance.now();

        const animate = (currentTime: number): void => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.config.TRANSITION_DURATION, 1);

            // Easing cubique pour une animation naturelle
            const easedProgress = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentScale = startScale + (targetScale - startScale) * easedProgress;
            this.applyScale(currentScale);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.state.isAnimating = false;
                this.state.currentScale = targetScale;
            }
        };

        requestAnimationFrame(animate);
    }

    // Application optimisée des transformations
    private applyScale(scale: number): void {
        const transform = `scale(${scale.toFixed(3)})`;
        this.elements.title.style.transform = transform;
        // Force le navigateur à traiter la transformation immédiatement
        void this.elements.title.offsetHeight;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const manager = HeaderScaleManager.getInstance();
    manager.init('.header-title');
});
```

```css
/* Styles optimisés pour les transitions */
.header-title {
    transform-origin: left center;
    will-change: transform;
    transition: transform var(--transition-duration) var(--transition-timing);
}

/* Optimisations de performance */
.header-title.animating {
    contain: layout style;
    isolation: isolate;
}
```
    }
}

// Optimisation des performances avec RAF
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateHeaderScale();
            ticking = false;
        });
        ticking = true;
    }
});
```

## 3. Flux du texte
> "le reste du texte passe dessous"

```css
.header {
    display: flex;
    flex-direction: column;
    /* Assure un flux naturel du contenu */
}

.header > *:not(.header-title) {
    /* Garantit que tout sauf le titre suit le flux normal */
    position: static;
    transform: none;
    /* Évite les problèmes de z-index et de stacking context */
    isolation: isolate;
}
```

## 4. Background avec opacité
> "la partie background sous le texte de la première ligne doit rester à 90% d'opacity"

```css
.header-title::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--header-bg, #1B1F23);
    opacity: 0.9;
    z-index: -1;
    /* Optimisation GPU */
    will-change: opacity;
    transform: translateZ(0);
}
```

## 5. Ligne de séparation sticky
> "la ligne du bas du cadre doit venir se \"sticky\" sous la ligne 1 (avec petite marge du haut normale)"

```css
.header-border {
    position: sticky;
    top: calc(var(--header-height) + 1rem);
    height: 1px;
    background: linear-gradient(
        to right,
        rgba(209, 213, 218, 0.1),
        rgba(209, 213, 218, 0.1)
    );
    /* Optimisation GPU */
    transform: translateZ(0);
    will-change: transform;
}
```

## 6. Uniformité visuelle
> "il ne doit pas y avoir de zone visible différente entre la première ligne et l'ensemble du bloc titre"

```css
.header {
    --header-bg: #1B1F23;
    background: var(--header-bg);
    /* Évite les problèmes de transparence entre les couches */
    isolation: isolate;
}

/* Assure une transition fluide entre les éléments */
.header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(
        to bottom,
        var(--header-bg),
        transparent
    );
    pointer-events: none;
}
```
