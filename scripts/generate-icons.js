const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [
    72, 96, 128, 144, 152, 192, 384, 512
];

async function generateIcons() {
    const sourceIcon = path.join(__dirname, '../src/assets/icons/favicon.svg');
    const targetDir = path.join(__dirname, '../src/assets/icons');
    
    console.log('🎨 Génération des icônes...\n');

    try {
        // Création du dossier cible si nécessaire
        await fs.mkdir(targetDir, { recursive: true });

        // Génération de chaque taille
        for (const size of sizes) {
            const targetPath = path.join(targetDir, `icon-${size}x${size}.png`);
            
            await sharp(sourceIcon)
                .resize(size, size)
                .png({ quality: 90 })
                .toFile(targetPath);
            
            console.log(`✓ Icône ${size}x${size} générée`);
        }

        // Génération de l'icône Apple spéciale
        await sharp(sourceIcon)
            .resize(180, 180)
            .png({ quality: 90 })
            .toFile(path.join(targetDir, 'apple-touch-icon.png'));
        
        console.log('✓ Icône Apple Touch générée');

        // Génération du favicon.png
        await sharp(sourceIcon)
            .resize(32, 32)
            .png({ quality: 90 })
            .toFile(path.join(targetDir, 'favicon.png'));
        
        console.log('✓ Favicon.png généré\n');
        
        console.log('✨ Toutes les icônes ont été générées avec succès !');
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

generateIcons();
