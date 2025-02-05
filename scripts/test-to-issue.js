const { Octokit } = require('@octokit/rest');

// Intégrateur simplifié focalisé sur l'étude des interactions
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

        // Validation de l'expérience utilisateur
        if (results.userExperience?.issues) {
            issues.push({
                title: '🔍 Point d\'observation - Interface',
                body: this.formatUserExperienceIssue(results.userExperience),
                labels: ['observation', 'interface'],
            });
        }

        // Analyse des interactions
        if (results.interactions?.patterns) {
            issues.push({
                title: '🧠 Analyse - Patterns d\'interaction',
                body: this.formatInteractionIssue(results.interactions),
                labels: ['analysis', 'patterns'],
            });
        }

        return issues;
    }

    formatUserExperienceIssue(data) {
        return `## Observation de l'Interface

${data.observations.map(obs => `- 👁️ ${obs}`).join('\n')}

### Impact sur l'Étude
${data.impact}

### Points d'Attention
${data.points.join('\n')}`;
    }

    formatInteractionIssue(data) {
        return `## Patterns d'Interaction Observés

${data.patterns.map(p => `### ${p.name}
${p.description}

**Observations:**
${p.observations.join('\n')}`).join('\n\n')}

### Implications
${data.implications}`;
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
