# Architecture du Site AI Meta Dialog

## Structure Simple

```
website/
├── src/
│   ├── index.html           # Page d'accueil
│   ├── styles/             
│   │   ├── variables.css    # Variables globales
│   │   ├── base.css        # Styles de base
│   │   └── components.css   # Composants réutilisables
│   │
│   ├── js/
│   │   ├── i18n.js         # Internationalisation
│   │   └── components/     
│   │       └── language-selector.js
│   │
│   ├── dialogue/           # Section Dialogue
│   │   ├── index.html
│   │   ├── dialogue.css
│   │   └── dialogue.js
│   │
│   ├── insights/           # Section Observations
│   │   ├── index.html
│   │   └── insights.css
│   │
│   └── research/           # Section Recherche
│       ├── index.html      # Hub de recherche
│       ├── research.css    # Styles communs recherche
│       │
│       ├── meta/          
│       │   ├── flexibility-paradigm.html
│       │   └── meta.css
│       │
│       ├── technical/
│       │   ├── focus-loss-analysis.html
│       │   ├── focus-recovery-mechanism.html
│       │   └── technical.css
│       │
│       └── behavioral/
│           ├── focus-engagement-patterns.html
│           └── behavioral.css
```

## Navigation Simple

1. **Accueil** → Vue d'ensemble
2. **Dialogue** → Exemples concrets
3. **Insights** → Observations clés
4. **Recherche** → Analyses détaillées

## Principes

- Un fichier = une responsabilité
- CSS modulaire par section
- JavaScript minimal
- Internationalisation FR/EN
- Navigation intuitive

## À Faire

1. [ ] Page d'accueil
2. [x] Section dialogue
3. [x] Section insights
4. [x] Section recherche
   - [x] Rapport méta
   - [x] Rapports techniques
   - [x] Rapport comportemental

*Note: Structure volontairement simple pour faciliter la maintenance et l'évolution.*
