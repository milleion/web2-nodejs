var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var template = require("./mod/template.js");

function write(title, description, option, response, flag) {
  var list = template.list(option);
  var print = template.html(
    title,
    list,
    `<h2>${title}</h2><p>${description}</p>`,
    flag
  );
  response.writeHead(200);
  response.end(print);
}

var app = http.createServer((request, response) => {
  var urlParse = url.parse(request.url, true);
  var pathName = urlParse.pathname;
  var id = urlParse.query.id;
  var listOrder = "ol";
  switch (pathName) {
    case "/":
      if (id === undefined)
        write("Welcome", "Hello, Node.js", listOrder, response, [
          true,
          false,
          false,
        ]);
      else
        write(id, fs.readFileSync(`data/${id}`, "utf8"), listOrder, response, [
          true,
          true,
          true,
        ]);
      break;

    case "/create":
      write(
        "Create",
        `<form action="/create_process" method="POST">
          <p><input type="text" name="title" placeholder="title"></input></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit" value='submit'></input></p>
        </form>
        `,
        listOrder,
        response,
        [false, false, false]
      );
      break;

    case "/update":
      write(
        "Update",
        `<form action="/update_process" method="POST">
          <input type='hidden' name='proTitle' value='${id}'></input>
          <p><input type="text" name="title" placeholder="title" value='${id}'></input></p>
          <p><textarea name="description" placeholder="description">${fs.readFileSync(
            `data/${id}`,
            "utf8"
          )}</textarea></p>
          <p><input type="submit" value='submit'></input></p>
        </form>
        `,
        listOrder,
        response,
        [false, false, false]
      );
      break;

    case "/create_process":
      var body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, "utf8", (err) => {});
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
      break;

    case "/update_process":
      var body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        var post = qs.parse(body);
        var proTitle = post.proTitle;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${proTitle}`, `data/${title}`, (err) => {
          fs.writeFile(`data/${title}`, description, (err) => {
            response.writeHead(302, { Location: `/?id=${title}` });
            response.end();
          });
        });
      });
      break;

    case "/delete_process":
      var body = "";
      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        var post = qs.parse(body);
        var title = post.title;
        fs.unlink(`data/${title}`, (err) => {
          response.writeHead(302, { location: "/" });
          response.end();
        });
      });
      break;

    default:
      response.writeHead(404);
      response.end("Not found");
  }
});

app.listen(3000);
