const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targets = [
  { input: 'assets/Kerly.jpg',           output: 'assets/Kerly.webp',           width: 800,  quality: 82 },
  { input: 'assets/Marina.jpg',          output: 'assets/Marina.webp',          width: 800,  quality: 82 },
  { input: 'assets/ambiente/_DSC4966.jpg', output: 'assets/ambiente/_DSC4966.webp', width: 1600, quality: 78 },
  { input: 'assets/ambiente/_DSC4970.jpg', output: 'assets/ambiente/_DSC4970.webp', width: 1600, quality: 78 },
  { input: 'assets/ambiente/_DSC4972.jpg', output: 'assets/ambiente/_DSC4972.webp', width: 1600, quality: 78 },
  { input: 'assets/ambiente/_DSC4976.jpg', output: 'assets/ambiente/_DSC4976.webp', width: 1600, quality: 78 },
  { input: 'assets/ambiente/_DSC4981.jpg', output: 'assets/ambiente/_DSC4981.webp', width: 1600, quality: 78 },
  { input: 'assets/ambiente/_DSC4982.jpg', output: 'assets/ambiente/_DSC4982.webp', width: 1600, quality: 78 },
];

const root = path.resolve(__dirname, '..');

(async () => {
  for (const t of targets) {
    const inputPath = path.join(root, t.input);
    const outputPath = path.join(root, t.output);
    if (!fs.existsSync(inputPath)) {
      console.warn(`SKIP (missing): ${t.input}`);
      continue;
    }
    const before = fs.statSync(inputPath).size;
    await sharp(inputPath)
      .rotate() // auto-orient based on EXIF before further ops
      .resize({ width: t.width, withoutEnlargement: true })
      .webp({ quality: t.quality })
      .toFile(outputPath);
    const after = fs.statSync(outputPath).size;
    const pct = Math.round((1 - after / before) * 100);
    console.log(`${t.input} (${(before/1024).toFixed(0)}KB) -> ${t.output} (${(after/1024).toFixed(0)}KB) -${pct}%`);
  }
})();
