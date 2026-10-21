const fs = require("fs");
const path = require("path");
const { publicPosts } = require("./build-posts");

const root = path.resolve(__dirname, "..");
const outputDir = path.resolve(process.argv[2] || path.join(root, "_site"));

const files = [
  "index.html",
  "style.css",
  "script.js",
  "content/site.json",
];
const assetFiles = [
  "assets/media/raffael-baptista.jpeg",
  "assets/IBMPlexSans-Medium.ttf",
  "assets/IBMPlexSans-Regular.ttf",
  "assets/OFL.txt",
];

function copy(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function prepareSite() {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  for (const relativePath of files) {
    copy(path.join(root, relativePath), path.join(outputDir, relativePath));
  }

  for (const relativePath of assetFiles) {
    copy(path.join(root, relativePath), path.join(outputDir, relativePath));
  }

  const site = JSON.parse(fs.readFileSync(path.join(root, "content/site.json"), "utf8"));
  const referencedImages = new Set([
    site.photo?.src,
    ...site.paths.flatMap((section) => (section.timeline || []).flatMap((entry) => [entry.image, ...(entry.images || []).map((photo) => photo.src)])),
    ...publicPosts().map((post) => post.image),
  ].filter(Boolean));
  for (const imagePath of referencedImages) {
    const relativePath = imagePath.replace(/^\/+/, "");
    if (!relativePath.startsWith("assets/media/")) {
      throw new Error(`Imagem fora de assets/media: ${imagePath}`);
    }
    copy(path.join(root, relativePath), path.join(outputDir, relativePath));
  }

  fs.cpSync(path.join(root, "posts"), path.join(outputDir, "posts"), { recursive: true });

  console.log(`Prepared site artifact in ${outputDir}`);
}

if (require.main === module) prepareSite();

module.exports = { prepareSite };
