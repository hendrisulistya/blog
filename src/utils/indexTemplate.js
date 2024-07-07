const indexTemplate = (lastPostTitle, lastPostHtmlContent, sortedFiles) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Index</title>
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
      </style>
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
};

export default indexTemplate;
