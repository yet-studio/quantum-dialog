const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Configuration
const baseDir = path.resolve(__dirname, '..');
const baseUrl = 'https://yet-studio.github.io/quantum-dialog';

// Couleurs pour la console
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

// Liste des extensions de fichiers à vérifier
const validExtensions = new Set(['.html', '.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg', '.ico']);

// Fonction pour trouver tous les fichiers HTML
function findHtmlFiles(dir) {
    const results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            results.push(...findHtmlFiles(fullPath));
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    
    return results;
}

// Fonction pour vérifier si un fichier existe
function checkFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        return false;
    }
}

// Fonction pour vérifier un lien
function checkLink(href, currentFile) {
    if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#') || href.startsWith('mailto:')) {
        return { valid: true, type: 'external' };
    }

    // Nettoyer le href
    href = href.split('#')[0]; // Enlever les ancres
    if (!href) return { valid: true, type: 'anchor' };

    // Construire le chemin complet
    const currentDir = path.dirname(currentFile);
    const targetPath = path.resolve(currentDir, href);
    
    // Vérifier si c'est un dossier (ajouter index.html)
    let finalPath = targetPath;
    if (!path.extname(targetPath)) {
        finalPath = path.join(targetPath, 'index.html');
    }

    // Vérifier si le fichier existe
    const exists = checkFileExists(finalPath);
    const ext = path.extname(finalPath).toLowerCase();
    const isValidExt = validExtensions.has(ext);

    return {
        valid: exists && isValidExt,
        type: 'internal',
        targetPath: finalPath,
        originalHref: href
    };
}

// Fonction principale
function checkAllLinks() {
    const htmlFiles = findHtmlFiles(baseDir);
    let totalLinks = 0;
    let validLinks = 0;
    let brokenLinks = [];

    console.log(`\n${colors.blue}Vérification des liens dans ${htmlFiles.length} fichiers HTML...${colors.reset}\n`);

    htmlFiles.forEach(file => {
        const html = fs.readFileSync(file, 'utf-8');
        const $ = cheerio.load(html);
        const relativeFilePath = path.relative(baseDir, file);

        console.log(`${colors.blue}Fichier: ${relativeFilePath}${colors.reset}`);

        // Vérifier tous les liens
        $('a[href], link[href], script[src], img[src]').each((i, el) => {
            const href = $(el).attr('href') || $(el).attr('src');
            totalLinks++;

            const result = checkLink(href, file);

            if (result.valid) {
                validLinks++;
                if (result.type === 'internal') {
                    console.log(`  ${colors.green}✓${colors.reset} ${href}`);
                }
            } else {
                console.log(`  ${colors.red}✗${colors.reset} ${href}`);
                brokenLinks.push({
                    file: relativeFilePath,
                    href,
                    element: el.tagName,
                    targetPath: result.targetPath
                });
            }
        });

        console.log(''); // Ligne vide pour la lisibilité
    });

    // Afficher le résumé
    console.log(`${colors.blue}Résumé:${colors.reset}`);
    console.log(`Total des liens vérifiés: ${totalLinks}`);
    console.log(`Liens valides: ${colors.green}${validLinks}${colors.reset}`);
    console.log(`Liens cassés: ${colors.red}${brokenLinks.length}${colors.reset}\n`);

    if (brokenLinks.length > 0) {
        console.log(`${colors.red}Liens cassés détectés:${colors.reset}`);
        brokenLinks.forEach(link => {
            console.log(`\nFichier: ${colors.yellow}${link.file}${colors.reset}`);
            console.log(`Élément: <${link.element}>`);
            console.log(`Lien: ${link.href}`);
            console.log(`Chemin cible: ${link.targetPath}`);
        });
    }
}

// Exécuter la vérification
checkAllLinks();
