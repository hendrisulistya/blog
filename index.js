import fs from "fs-extra";
import { fileURLToPath } from "url";
import path from "path";
import markdownIt from "markdown-it";

const { readdir, readFile, outputFile, ensureDir } = fs; // Destructure methods from 'fs'

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, "src/posts");
const DIST_DIR = path.join(__dirname, "dist");

const md = new markdownIt(); // Initialize markdown-it

// Define a simple createTemplate function
const createTemplate = (title, content) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body>
      <header>
        <h1>${title}</h1>
      </header>
      <main>
        ${content}
      </main>
      <footer>
        <a href="./index.html">Back to Index</a>
      </footer>
    </body>
    </html>
  `;
};

const build = async () => {
  await ensureDir(DIST_DIR); // Ensure the dist directory exists

  const files = await readdir(POSTS_DIR);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const indexHtmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Index</title>
    </head>
    <body>
      <header>
        <h1>Index</h1>
      </header>
      <main>
        <ul>
          ${mdFiles
            .map((file) => {
              const title = file.replace(".md", "");
              return `<li><a href="./${title}.html">${title}</a></li>`;
            })
            .join("\n")}
        </ul>
      </main>
    </body>
    </html>
  `;

  const indexFilePath = path.join(DIST_DIR, "index.html");
  await outputFile(indexFilePath, indexHtmlContent);

  for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const content = await readFile(filePath, "utf-8");
    const htmlContent = md.render(content); // Render Markdown to HTML
    const title = file.replace(".md", "");
    const html = createTemplate(title, htmlContent);

    const outputFilePath = path.join(DIST_DIR, `${title}.html`);
    await outputFile(outputFilePath, html);
  }
};

build().catch(console.error);
