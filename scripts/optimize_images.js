const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../assets_em_uso');
const outputDir = path.join(__dirname, '../assets');

async function processImages() {
    try {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const files = fs.readdirSync(inputDir);
        const images = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));

        for (const file of images) {
            const inputPath = path.join(inputDir, file);
            // Change extension to .webp
            const outputFileName = path.parse(file).name + '.webp';
            const outputPath = path.join(outputDir, outputFileName);

            const isHero = file === '_DSC2884.jpg';
            const maxWidth = isHero ? 1920 : 1200;

            console.log(`Processing ${file} (Max width: ${maxWidth}px) -> ${outputFileName}`);

            await sharp(inputPath)
                .rotate() // Auto-rotate based on EXIF orientation
                .resize({ width: maxWidth, withoutEnlargement: true })
                .webp({ quality: 80 }) // Compress to quality 80
                .toFile(outputPath);

            console.log(`Successfully saved: ${outputPath}`);

            // Log file sizes for comparison
            const statsOrig = fs.statSync(inputPath);
            const statsNew = fs.statSync(outputPath);
            console.log(`  Original: ${(statsOrig.size / (1024 * 1024)).toFixed(2)} MB`);
            console.log(`  New WebP: ${(statsNew.size / (1024 * 1024)).toFixed(2)} MB`);
            console.log('----------------------------');
        }

        console.log('All images processed successfully!');

    } catch (error) {
        console.error('Error processing images:', error);
    }
}

processImages();
