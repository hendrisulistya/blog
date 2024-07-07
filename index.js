import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import showdown from "showdown";
import postTemplate from "./src/utils/postTemplate.js";
import indexTemplate from "./src/utils/indexTemplate.js"; // Import indexTemplate

const { readdir, readFile, writeFile, ensureDir, remove } = fs;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, "src/posts");
const DIST_DIR = path.join(__dirname, "dist");

console.log("__filename:", __filename);
console.log("__dirname:", __dirname);
console.log("postsDir:", POSTS_DIR);
console.log("distDir:", DIST_DIR);

const converter = new showdown.Converter();

const cleanDist = async () => {
  try {
    await remove(DIST_DIR);
    console.log(`Removed build directory (dist)`);
  } catch (err) {
    console.error(`Error removing build directory (dist)`, err.message);
    throw err;
  }
};

const generateIndexHtml = async (postsDir, distDir) => {
  const files = await readdir(postsDir);
  const mdFiles = files.filter((file) => {
    return file.endsWith(".md") && file.toLowerCase() !== "readme.md";
  });

  const sortedFiles = mdFiles.sort((fileA, fileB) => {
    const statA = fs.statSync(path.join(postsDir, fileA));
    const statB = fs.statSync(path.join(postsDir, fileB));
    return statB.mtime.getTime() - statA.mtime.getTime();
  });

  await ensureDir(distDir);

  const lastPostFile = sortedFiles[0];
  const lastPostFilePath = path.join(postsDir, lastPostFile);
  const lastPostContent = await readFile(lastPostFilePath, "utf-8");

  const lastPostHtmlContent = converter.makeHtml(lastPostContent);
  const lastPostTitle = lastPostFile.replace(".md", "");

  const indexHtml = indexTemplate(
    lastPostTitle,
    lastPostHtmlContent,
    sortedFiles
  );

  const indexPath = path.join(distDir, "index.html");
  await writeFile(indexPath, indexHtml, "utf-8");

  console.log("Successfully generated index.html");

  for (const file of sortedFiles) {
    const filePath = path.join(postsDir, file);
    const content = await readFile(filePath, "utf-8");
    const htmlContent = converter.makeHtml(content);
    const title = file.replace(".md", "");
    const otherPostsHtml = sortedFiles
      .filter((otherFile) => otherFile !== file)
      .map((otherFile) => {
        const otherTitle = otherFile.replace(".md", "");
        return `<li><a href="./${otherTitle}.html">${otherTitle}</a></li>`;
      })
      .join("\n");
    const html = postTemplate(title, htmlContent, otherPostsHtml);

    const outputFilePath = path.join(distDir, `${title}.html`);
    await writeFile(outputFilePath, html, "utf-8");

    console.log(`Successfully generated ${title}.html`);
  }

  console.log("Static site generation completed.");
};

const build = async () => {
  try {
    console.log("Starting static site build...");
    await cleanDist();
    console.log("Cleaned build directory");

    await ensureDir(DIST_DIR);
    console.log("Created build directory");

    await generateIndexHtml(POSTS_DIR, DIST_DIR);
  } catch (err) {
    console.error("Error during static site generation:", err.message);
  }
};

build().catch(console.error);
