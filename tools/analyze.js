const { Octokit } = require('@octokit/rest');

async function analyzeDialog() {
    console.log('🧠 Analyse du dialogue IA-Humain...\n');

    const observations = {
        interface: {
            points: [
                'Clarté de la présentation',
                'Distinction IA/Humain',
                'Fluidité des transitions'
            ],
            impact: 'Structure visuelle facilitant l\'étude des échanges'
        },
        patterns: [
            {
                type: 'Question-Réflexion',
                observations: [
                    'Questions de clarification',
                    'Développement des réponses',
                    'Adaptation au contexte'
                ]
            }
        ]
    };

    // Création d'une issue d'analyse
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    
    try {
        await octokit.issues.create({
            owner: 'yet-studio',
            repo: 'quantum-dialog',
            title: '🔍 Analyse - Session de dialogue',
            body: formatAnalysis(observations),
            labels: ['analysis', 'observation']
        });
        
        console.log('✅ Analyse enregistrée\n');
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

function formatAnalysis(data) {
    return `## Analyse de l'Interface

${data.interface.points.map(p => `- ${p}`).join('\n')}

### Impact
${data.interface.impact}

## Patterns Observés

${data.patterns.map(p => `### ${p.type}
${p.observations.map(o => `- ${o}`).join('\n')}`).join('\n\n')}`;
}

if (require.main === module) {
    analyzeDialog().catch(console.error);
}
