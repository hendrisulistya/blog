import fs from "fs-extra";
import path from "path";
import showdown from "showdown";
import ejs from "ejs";
import { JSDOM } from "jsdom";

const { readdir, readFile, writeFile, ensureDir, remove, copy } = fs;

const converter = new showdown.Converter();

const extractSummary = (html, limit) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Remove the first header (assuming it is the title)
  const firstHeader = document.querySelector("h1");
  if (firstHeader) {
    firstHeader.remove();
  }

  // Remove the line containing "Last Updated"
  const lastUpdatedLine = document.querySelector("em");
  if (lastUpdatedLine) {
    lastUpdatedLine.remove();
  }

  const textContent = document.body.textContent || "";
  return textContent.substring(0, limit);
};

export const cleanDist = async (distDir) => {
  try {
    await remove(distDir);
    console.log("Removed build directory (dist)");
  } catch (err) {
    console.error("Error removing build directory (dist)", err.message);
    throw err;
  }
};

export const copyDirectory = async (srcDir, destDir) => {
  try {
    await ensureDir(destDir);
    await copy(srcDir, destDir);
    console.log(`Copied from src to dist`);
  } catch (err) {
    console.error(`Error copying ${srcDir} to ${destDir}`, err.message);
    throw err;
  }
};

export const generateIndexHtml = async (postsDir, distDir) => {
  try {
    const files = await readdir(postsDir);
    const mdFiles = files.filter(
      (file) => file.endsWith(".md") && file !== "README.md"
    );

    const sortedFiles = mdFiles.sort((fileA, fileB) => {
      const statA = fs.statSync(path.join(postsDir, fileA));
      const statB = fs.statSync(path.join(postsDir, fileB));
      return statB.mtime.getTime() - statA.mtime.getTime();
    });

    await ensureDir(distDir);

    if (sortedFiles.length === 0) {
      console.log("No Markdown files found in posts directory.");
      return;
    }

    const postDetails = await Promise.all(
      sortedFiles.slice(0, 9).map(async (file) => {
        const filePath = path.join(postsDir, file);
        const content = await readFile(filePath, "utf-8");
        const htmlContent = converter.makeHtml(content); // Convert Markdown to HTML
        const title = file.replace(".md", "");
        return { title, content: htmlContent };
      })
    );

    const indexHtml = await ejs.renderFile(
      path.join(path.dirname(postsDir), "templates/index.ejs"),
      {
        posts: postDetails,
        extractSummary, // Pass the function here
      }
    );

    const indexPath = path.join(distDir, "index.html");
    await writeFile(indexPath, indexHtml, "utf-8");

    console.log("Successfully generated index.html");

    for (const { title, content } of postDetails) {
      const otherPostsHtml = postDetails
        .filter((post) => post.title !== title)
        .map(
          (post) => `<li><a href="./${post.title}.html">${post.title}</a></li>`
        )
        .join("\n");

      const html = await ejs.renderFile(
        path.join(path.dirname(postsDir), "templates/posts.ejs"),
        {
          title,
          header: title,
          content, // Ensure content is passed as HTML
          otherPostsHtml,
        }
      );

      const outputFilePath = path.join(distDir, `${title}.html`);
      await writeFile(outputFilePath, html, "utf-8");

      console.log(`Successfully generated ${title}.html`);
    }

    console.log("Static site generation completed.");
  } catch (err) {
    console.error("Error during static site generation:", err.message);
    throw err;
  }
};
