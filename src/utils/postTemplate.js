const postTemplate = (title, content, otherPostsHtml) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f7f7f7;
          color: #333;
        }
        header {
          background-color: #fff;
          padding: 20px 0;
          border-bottom: 1px solid #e1e1e1;
          text-align: center;
        }
        header h1 {
          margin: 0;
          font-size: 2.5em;
          font-weight: 700;
          color: #333;
        }
        main {
          max-width: 800px;
          margin: 40px auto;
          padding: 0 20px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        footer {
          max-width: 800px;
          margin: 20px auto;
          padding: 0 20px;
          text-align: center;
        }
        footer a {
          color: #1a73e8;
          text-decoration: none;
        }
        footer a:hover {
          text-decoration: underline;
        }
        footer h2 {
          margin-top: 40px;
          font-size: 1.5em;
        }
        footer ul {
          list-style: none;
          padding: 0;
        }
        footer ul li {
          margin: 5px 0;
        }
        footer ul li a {
          color: #1a73e8;
          text-decoration: none;
        }
        footer ul li a:hover {
          text-decoration: underline;
        }
        pre {
          background-color: #f7f7f7;
          padding: 10px;
          border-radius: 5px;
          overflow: auto;
          font-family: 'Courier New', Courier, monospace;
        }
        code {
          background-color: #f7f7f7;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', Courier, monospace;
        }
      </style>
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
        <h2>Other Posts:</h2>
        <ul>${otherPostsHtml}</ul>
      </footer>
    </body>
    </html>
  `;
};

export default postTemplate;