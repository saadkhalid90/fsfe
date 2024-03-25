const express = require("express");
const server = require("http").createServer();
const PORT = 3000;

const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(PORT, () => console.log(`app listening on ${PORT}`));

process.on("SIGINT", () => {
  console.log("sigint");

  server.close(() => {
    console.log("closed!");
  });

});
