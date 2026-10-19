const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputDir = path.resolve(process.argv[2] || path.join(root, "_site"));

const files = [
  "index.html",
  "style.css",
  "script.js",
  "content/site.json",
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

  fs.cpSync(path.join(root, "assets"), path.join(outputDir, "assets"), { recursive: true });
  fs.cpSync(path.join(root, "posts"), path.join(outputDir, "posts"), { recursive: true });

  console.log(`Prepared site artifact in ${outputDir}`);
}

if (require.main === module) prepareSite();

module.exports = { prepareSite };
