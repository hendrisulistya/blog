// src/utils/createTemplate.js

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

export default createTemplate;
