const fs = require("fs");
const http = require("http");
const url = require("url");

//////////////////////////
////// FILES /////////////

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// // console.log(textIn);
// const today = new Date();

// const textOut = `This is what we know about the avacodo: ${textIn}.\Created on date ${today.getDate()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// // console.log("file has been written");

// // non-blocking, asynchronous way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("error");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("File has been written");
//       });
//     });
//   });
// });

//////////////////////////
////// SERVER ////////////

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const overview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf8"
);
const card = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8"
);

const server = http.createServer((req, res) => {
  console.log(req.url);

  const { query, pathname } = url.parse(req.url, true);
  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cards = dataObj.map((el) => replaceTemplate(card, el)).join("");
    const output = overview.replace("{%PRODUCT_CARDS%}", cards);
    res.end(output);
  }
  // Product Page
  else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>This page could not be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
