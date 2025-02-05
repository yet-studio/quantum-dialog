const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const QUALITY = 85;

async function findImages(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    let images = [];

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory() && !file.name.startsWith('.')) {
            images = images.concat(await findImages(fullPath));
        } else if (file.isFile() && EXTENSIONS.includes(path.extname(file.name).toLowerCase())) {
            images.push(fullPath);
        }
    }

    return images;
}

async function optimizeImage(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const optimizedPath = imagePath.replace(ext, `${ext}`);
    const webpPath = imagePath.replace(ext, '.webp');
    
    console.log(`🎨 Optimisation de ${path.basename(imagePath)}...`);

    try {
        // Optimiser l'image originale
        await sharp(imagePath)
            .jpeg({ quality: QUALITY })
            .png({ quality: QUALITY })
            .toFile(optimizedPath + '.tmp');

        // Créer version WebP
        await sharp(imagePath)
            .webp({ quality: QUALITY })
            .toFile(webpPath);

        // Remplacer l'original
        await fs.rename(optimizedPath + '.tmp', optimizedPath);
        
        console.log(`✓ ${path.basename(imagePath)} optimisé`);
        console.log(`✓ Version WebP créée`);
    } catch (error) {
        console.error(`❌ Erreur avec ${imagePath}:`, error);
    }
}

async function main() {
    try {
        console.log('🔍 Recherche des images...\n');
        const images = await findImages('src');
        
        console.log(`📸 ${images.length} images trouvées.\n`);
        
        for (const image of images) {
            await optimizeImage(image);
        }
        
        console.log('\n✨ Optimisation terminée !');
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

main();
