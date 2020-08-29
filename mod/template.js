var fs = require("fs");
module.exports = {
  html: function (title, list, body, flag) {
    return `<!doctype html>
            <html>
            <head>
              <title>WEB2 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              ${flag[0] ? `<a href="/create">create</a>` : ""} 
              ${flag[1] ? `<a href="/update?id=${title}">update</a>` : ""}
              ${
                flag[2]
                  ? `<p>
                  <form action='/delete_process' method='POST'>
                    <input type='hidden' name='title' value='${title}'>
                    <input type='submit' value='delete'>
                  </form>
                  </p>`
                  : ""
              }
              ${body}
            </body>
            </html>
            `;
  },

  list: function (option) {
    var fileList = fs.readdirSync("data", "utf8");
    var list = `<${option}>`;
    for (var i = 0; i < fileList.length; i++)
      list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    list += `</${option}>`;
    return list;
  },
};
