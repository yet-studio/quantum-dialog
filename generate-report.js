const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const markdownIt = require('markdown-it');
const md = new markdownIt();

// Lire la checklist existante
const checklistPath = path.join(__dirname, 'publication-checklist.md');
const reportPath = path.join(__dirname, 'reports');
let checklist = fs.readFileSync(checklistPath, 'utf8');

async function generateReport() {
    // Créer le dossier reports s'il n'existe pas
    if (!fs.existsSync(reportPath)) {
        fs.mkdirSync(reportPath);
    }

    const results = {
        html: runHtmlValidation(),
        css: runCssValidation(),
        a11y: runA11yCheck(),
        performance: runLighthouseCheck()
    };

    // Mettre à jour la checklist avec les résultats
    checklist = updateChecklistWithResults(checklist, results);

    // Générer le rapport final
    const timestamp = new Date().toISOString();
    const reportContent = `
# Rapport de Validation Automatisé
*Généré le : ${timestamp}*

## Résumé des Tests

${generateTestSummary(results)}

## Checklist Mise à Jour

${checklist}

## Détails des Tests

### Validation HTML
\`\`\`
${results.html}
\`\`\`

### Validation CSS
\`\`\`
${results.css}
\`\`\`

### Tests d'Accessibilité
\`\`\`
${results.a11y}
\`\`\`

### Rapport de Performance
\`\`\`
${JSON.stringify(results.performance, null, 2)}
\`\`\`
`;

    // Sauvegarder le rapport
    const reportFile = path.join(reportPath, `validation-report-${Date.now()}.md`);
    fs.writeFileSync(reportFile, reportContent);
    console.log(`Rapport généré : ${reportFile}`);
}

function runHtmlValidation() {
    try {
        return execSync('npm run test:html', { encoding: 'utf8' });
    } catch (error) {
        return error.output.join('\n');
    }
}

function runCssValidation() {
    try {
        return execSync('npm run test:css', { encoding: 'utf8' });
    } catch (error) {
        return error.output.join('\n');
    }
}

function runA11yCheck() {
    try {
        return execSync('npm run test:a11y', { encoding: 'utf8' });
    } catch (error) {
        return error.output.join('\n');
    }
}

function runLighthouseCheck() {
    try {
        // Démarrer le serveur HTTP
        execSync('npm run serve &');
        // Attendre que le serveur démarre
        execSync('sleep 2');
        // Lancer Lighthouse
        execSync('npm run test:performance');
        // Arrêter le serveur
        execSync('pkill -f http-server');
        
        // Lire et parser le rapport Lighthouse
        const lighthouseReport = JSON.parse(
            fs.readFileSync(path.join(reportPath, 'lighthouse.json'), 'utf8')
        );
        return {
            performance: lighthouseReport.categories.performance.score * 100,
            accessibility: lighthouseReport.categories.accessibility.score * 100,
            'best-practices': lighthouseReport.categories['best-practices'].score * 100,
            seo: lighthouseReport.categories.seo.score * 100
        };
    } catch (error) {
        return { error: error.message };
    }
}

function updateChecklistWithResults(checklist, results) {
    // Mettre à jour les cases à cocher en fonction des résultats des tests
    let updatedChecklist = checklist;

    // Exemple de mise à jour basée sur les résultats
    if (results.html && !results.html.includes('error')) {
        updatedChecklist = updatedChecklist.replace('[ ] Validation W3C du HTML', '[x] Validation W3C du HTML');
    }

    if (results.css && !results.css.includes('error')) {
        updatedChecklist = updatedChecklist.replace('[ ] Validation W3C du CSS', '[x] Validation W3C du CSS');
    }

    if (results.performance && results.performance.accessibility > 90) {
        updatedChecklist = updatedChecklist.replace('[ ] Contraste suffisant (WCAG AA)', '[x] Contraste suffisant (WCAG AA)');
    }

    return updatedChecklist;
}

function generateTestSummary(results) {
    let summary = '### Résumé des Tests\n\n';
    
    // Fonction helper pour le formatage des scores
    const formatScore = (score, threshold = 90) => {
        const emoji = score >= threshold ? '✅' : score >= threshold - 10 ? '⚠️' : '❌';
        return `${emoji} ${score.toFixed(1)}%`;
    };

    // Ajouter les scores de performance
    if (results.performance && !results.performance.error) {
        summary += '#### Scores Lighthouse\n\n';
        summary += `| Métrique | Score | Status |\n|----------|--------|---------|\n`;
        summary += `| Performance | ${results.performance.performance}% | ${formatScore(results.performance.performance)} |\n`;
        summary += `| Accessibilité | ${results.performance.accessibility}% | ${formatScore(results.performance.accessibility)} |\n`;
        summary += `| Meilleures pratiques | ${results.performance['best-practices']}% | ${formatScore(results.performance['best-practices'])} |\n`;
        summary += `| SEO | ${results.performance.seo}% | ${formatScore(results.performance.seo)} |\n\n`;
    }

    // Ajouter le statut des validations
    summary += '#### Validations\n\n';
    summary += `| Test | Status |\n|------|--------|\n`;
    summary += `| HTML | ${!results.html.includes('error') ? '✅' : '❌'} |\n`;
    summary += `| CSS | ${!results.css.includes('error') ? '✅' : '❌'} |\n`;
    summary += `| Accessibilité | ${!results.a11y.includes('error') ? '✅' : '❌'} |\n\n`;

    return summary;
}

// Exécuter la génération du rapport
generateReport().catch(console.error);
