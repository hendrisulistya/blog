import fs from "fs-extra";
import path from "path";
import markdownIt from "markdown-it";
import createTemplate from "./createTemplate.js";

const generateIndexHtml = async (postsDir, distDir) => {
  const { readdir, readFile, statSync } = fs; // Destructure methods from 'fs'

  // Read directory and filter for Markdown files
  const files = await readdir(postsDir);
  const mdFiles = files.filter((file) => {
    const filePath = path.join(postsDir, file);
    const isMdFile =
      fs.statSync(filePath).isFile() && file.toLowerCase().endsWith(".md");
    if (!isMdFile) {
      console.log(`Skipped file: ${file}`);
    }
    return isMdFile;
  });

  // Sort Markdown files by modified time (descending)
  const sortedFiles = mdFiles.sort((fileA, fileB) => {
    const statA = statSync(path.join(postsDir, fileA));
    const statB = statSync(path.join(postsDir, fileB));
    return statB.mtime.getTime() - statA.mtime.getTime();
  });

  // Ensure the dist directory exists
  await fs.ensureDir(distDir);

  // Get the last modified file (latest blog post)
  const lastPostFile = sortedFiles[0];
  const lastPostFilePath = path.join(postsDir, lastPostFile);
  const lastPostContent = await readFile(lastPostFilePath, "utf-8");

  const md = new markdownIt(); // Initialize markdown-it
  const lastPostHtmlContent = md.render(lastPostContent); // Render Markdown to HTML

  const lastPostTitle = lastPostFile.replace(".md", "");

  // Generate index.html content
  const indexHtml = `
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
        <section>
          <h2>Last Blog Post: ${lastPostTitle}</h2>
          <div>${lastPostHtmlContent}</div>
        </section>
        <section>
          <h2>All Blog Posts</h2>
          <ul>
            ${sortedFiles
              .map((file) => {
                const title = file.replace(".md", "");
                return `<li><a href="./${title}.html">${title}</a></li>`;
              })
              .join("\n")}
          </ul>
        </section>
      </main>
    </body>
    </html>
  `;

  // Write index.html to dist directory
  const indexPath = path.join(distDir, "index.html");
  await fs.writeFile(indexPath, indexHtml, "utf-8");

  console.log("Successfully generated index.html");

  // Process each Markdown file
  for (const file of sortedFiles) {
    const filePath = path.join(postsDir, file);
    const content = await readFile(filePath, "utf-8");
    const htmlContent = md.render(content);
    const title = file.replace(".md", "");
    const html = createTemplate(title, htmlContent);

    const outputFilePath = path.join(distDir, `${title}.html`);
    await fs.writeFile(outputFilePath, html, "utf-8");

    console.log(`Successfully generated ${title}.html`);
  }

  console.log("Static site generation completed.");
};

export default generateIndexHtml;
