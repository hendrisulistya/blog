const createTemplate = (title, content) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        h1 {
          color: #333;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
  </html>
`;

export default createTemplate;
