const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

class TestIssueIntegrator {
    constructor(token, owner, repo) {
        this.octokit = new Octokit({ auth: token });
        this.owner = owner;
        this.repo = repo;
    }

    async processTestResults(testResults) {
        const issues = this.parseTestResults(testResults);
        for (const issue of issues) {
            await this.createGitHubIssue(issue);
        }
    }

    parseTestResults(results) {
        const issues = [];

        // HTML Validation
        if (results.html?.errors?.length > 0) {
            issues.push({
                title: '🎨 Problèmes de validation HTML détectés',
                body: this.formatHtmlIssue(results.html.errors),
                labels: ['interface', 'enhancement'],
                category: 'Interface Visuelle',
                impact_level: 'Moyen'
            });
        }

        // Accessibilité
        if (results.a11y?.issues?.length > 0) {
            issues.push({
                title: '♿️ Améliorations d\'accessibilité requises',
                body: this.formatA11yIssue(results.a11y.issues),
                labels: ['accessibility', 'enhancement'],
                category: 'Interface Visuelle',
                impact_level: 'Élevé'
            });
        }

        // Performance
        if (results.lighthouse?.scores) {
            const perfIssues = this.analyzeLighthouseScores(results.lighthouse.scores);
            issues.push(...perfIssues);
        }

        return issues;
    }

    formatHtmlIssue(errors) {
        return `## Problèmes de Validation HTML

${errors.map(error => `- 🔍 ${error.message} (${error.file}:${error.line})`).join('\n')}

### Impact sur l'Analyse
Ces problèmes peuvent affecter la fiabilité de nos observations sur les interactions IA-Humain.

### Notes d'Implémentation
1. Corriger les erreurs de validation
2. Vérifier l'impact sur l'accessibilité
3. Tester sur différents navigateurs`;
    }

    formatA11yIssue(issues) {
        return `## Améliorations d'Accessibilité

${issues.map(issue => `### ${issue.type}
- 🎯 Impact: ${issue.impact}
- 📍 Localisation: ${issue.selector}
- 💡 Solution: ${issue.solution}`).join('\n\n')}

### Impact sur l'Analyse
L'accessibilité est cruciale pour une étude inclusive des interactions IA-Humain.

### Recommandations
1. Prioriser les problèmes à fort impact
2. Tester avec des lecteurs d'écran
3. Valider avec des utilisateurs réels`;
    }

    analyzeLighthouseScores(scores) {
        const issues = [];
        const thresholds = {
            performance: 90,
            accessibility: 95,
            'best-practices': 90,
            seo: 90
        };

        for (const [metric, score] of Object.entries(scores)) {
            if (score < thresholds[metric]) {
                issues.push({
                    title: `📊 Optimisation ${metric} nécessaire`,
                    body: this.formatPerformanceIssue(metric, score, thresholds[metric]),
                    labels: ['performance', 'enhancement'],
                    category: 'Visualisation de Données',
                    impact_level: score < thresholds[metric] - 20 ? 'Élevé' : 'Moyen'
                });
            }
        }

        return issues;
    }

    formatPerformanceIssue(metric, score, threshold) {
        return `## Optimisation ${metric}

🎯 Score actuel: ${score}
🎯 Objectif: ${threshold}

### Impact sur l'Analyse
La performance est essentielle pour maintenir une expérience fluide lors de l'étude des interactions.

### Pistes d'Amélioration
1. Analyser les métriques détaillées
2. Identifier les goulots d'étranglement
3. Optimiser les ressources critiques`;
    }

    async createGitHubIssue(issue) {
        try {
            const response = await this.octokit.issues.create({
                owner: this.owner,
                repo: this.repo,
                title: issue.title,
                body: issue.body,
                labels: issue.labels
            });

            console.log(`✅ Issue créée: ${response.data.html_url}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Erreur lors de la création de l'issue:`, error);
            throw error;
        }
    }
}

module.exports = TestIssueIntegrator;
