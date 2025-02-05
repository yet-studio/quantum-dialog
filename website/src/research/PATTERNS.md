# Patterns de Design et Composants

## Composants Communs
1. **En-tête de Rapport**
   ```html
   <header class="paper-header">
     <div class="paper-meta">
       <span class="tag">[Type]</span>
       <time datetime="">[Date]</time>
     </div>
     <h1>[Titre]</h1>
     <p class="lead">[Description]</p>
   </header>
   ```

2. **Cartes d'Information**
   ```html
   <div class="[type]-card">
     <h3>[Titre]</h3>
     <p>[Contenu]</p>
     [Contenu Spécifique]
   </div>
   ```

## Styles CSS par Type

### Meta (`meta.css`)
```css
.insight {
    margin: var(--space-6) 0;
    padding: var(--space-6);
    background: var(--color-background-alt);
    border-left: 4px solid var(--color-accent);
}
```

### Technique (`technical.css`)
```css
.code-example {
    margin-top: var(--space-4);
    background: var(--color-background);
    border-radius: var(--border-radius);
    padding: var(--space-4);
}
```

### Comportemental (`behavioral.css`)
```css
.interaction-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
}
```

## Grilles Responsives
```css
.grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-6);
}

@media (max-width: 768px) {
    .grid-layout {
        grid-template-columns: 1fr;
    }
}
```

## Variables Communes
- `--color-accent`
- `--color-background-alt`
- `--space-4`, `--space-6`
- `--border-radius`
- `--shadow`

*Note: Ces patterns sont réutilisés à travers tous les rapports pour maintenir la cohérence.*
