import path from "path";
import { fileURLToPath } from "url";
import {
  cleanDist,
  generateIndexHtml,
  copyDirectory,
} from "./src/utils/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, "src/posts");
const DIST_DIR = path.join(__dirname, "dist");
const ASSETS_DIR = path.join(__dirname, "src/templates/assets");

const build = async () => {
  try {
    console.log("Starting static site build...");
    await cleanDist(DIST_DIR);
    console.log("Cleaned build directory");

    await copyDirectory(
      path.join(ASSETS_DIR, "css"),
      path.join(DIST_DIR, "assets/css")
    );
    console.log("Copied CSS directory");

    await copyDirectory(
      path.join(ASSETS_DIR, "script"),
      path.join(DIST_DIR, "assets/script")
    );
    console.log("Copied script directory");

    await generateIndexHtml(POSTS_DIR, DIST_DIR);
  } catch (err) {
    console.error("Error during static site generation:", err.message);
  }
};

build().catch(console.error);
