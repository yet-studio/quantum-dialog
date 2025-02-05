# Guide de Contribution

## 🌟 Standards de Qualité

### Code
- Indentation cohérente
- Nommage explicite
- Documentation inline
- Tests unitaires

### Style
- BEM pour le CSS
- Variables CSS
- Animations optimisées
- Responsive first

### Performance
- Score Lighthouse > 95
- Temps de chargement < 2s
- FCP < 1s
- TTI < 3s

## 🔄 Workflow Git

### Branches
- `main`: Production
- `develop`: Développement
- `feature/*`: Nouvelles fonctionnalités
- `fix/*`: Corrections
- `docs/*`: Documentation

### Commits
```bash
type(scope): description

# Types:
# feat: Nouvelle fonctionnalité
# fix: Correction de bug
# docs: Documentation
# style: Formatage
# refactor: Refactoring
# perf: Performance
# test: Tests
```

## 🧪 Tests

### Prérequis
```bash
npm install
```

### Lancer les Tests
```bash
# Tous les tests
npm test

# HTML uniquement
npm run test:html

# CSS uniquement
npm run test:css

# Accessibilité
npm run test:a11y

# Performance
npm run test:performance
```

## 📝 Pull Requests

1. Fork du projet
2. Création de branche
3. Commits atomiques
4. Tests passants
5. Documentation à jour
6. Pull Request avec:
   - Description claire
   - Références aux issues
   - Screenshots si UI
   - Rapport de tests

## 🎨 Design

### Principes
- Minimalisme
- Clarté
- Cohérence
- Accessibilité

### Composants
- Atomic Design
- Réutilisabilité
- Documentation
- Tests visuels

## 📚 Documentation

### Types
- Code inline
- README
- Guides techniques
- Exemples pratiques

### Format
- Markdown
- Screenshots
- Diagrammes
- Code examples
