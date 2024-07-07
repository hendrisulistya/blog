import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import markdownIt from "markdown-it";
import createTemplate from "./src/utils/createTemplate.js";
import generateIndexHtml from "./src/utils/indexHtmlContent.js";

const { readdir, readFile, writeFile, mkdir, rm } = fs.promises;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, "src/posts");
const DIST_DIR = path.join(__dirname, "dist");

const md = new markdownIt();

const cleanDist = async () => {
  try {
    await rm(DIST_DIR, { recursive: true, force: true });
    console.log(`Removed build directory (dist)`);
  } catch (err) {
    console.error(`Error removing build directory (dist):`, err.message);
    throw err;
  }
};

const build = async () => {
  try {
    await cleanDist();
    await mkdir(DIST_DIR, { recursive: true });

    const mdFiles = await readdir(POSTS_DIR);

    const indexHtmlContent = await generateIndexHtml(POSTS_DIR, DIST_DIR);
    const indexFilePath = path.join(DIST_DIR, "index.html");
    await writeFile(indexFilePath, indexHtmlContent, "utf-8");

    for (const file of mdFiles) {
      try {
        if (file.endsWith(".md")) {
          const filePath = path.join(POSTS_DIR, file);
          const content = await readFile(filePath, "utf-8");

          if (!content) {
            console.warn(`File ${file} is empty or could not be read.`);
            continue;
          }

          const htmlContent = md.render(content);

          if (!htmlContent) {
            console.warn(`Markdown rendering failed for file ${file}.`);
            continue;
          }

          const title = file.replace(".md", "");
          const html = createTemplate(title, htmlContent);

          if (!html) {
            console.warn(`Template creation failed for file ${file}.`);
            continue;
          }

          const outputFilePath = path.join(DIST_DIR, `${title}.html`);
          await writeFile(outputFilePath, html, "utf-8");
        } else {
          console.log(`Skipped file: ${file} (not a Markdown file)`);
        }
      } catch (err) {
        console.error(`Error processing file ${file}:`, err.message);
      }
    }

    console.log("Static site successfully built!");
  } catch (err) {
    console.error("Error during static site generation:", err.message);
  }
};

build().catch(console.error);
