const express = require("express");
const ws = require("ws");
const sqlite = require("sqlite3");

const server = require("http").createServer();

const app = express();
const PORT = 3000;

// add a new group
// boiler plate setting up of server
app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

/** Web socket server */

const WebSocketServer = ws.Server;

const wss = new WebSocketServer({ server: server });

process.on("SIGINT", () => {
  console.log("sigint");
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    console.log("closing server!");
    shutDownDb();
  });
});

wss.on("connection", function (ws) {
  const numClients = wss.clients.size;
  console.log(`Number of clients connected: ${numClients}`);
  wss.broadcast(`${numClients} is the room now!`);

  if (ws.readyState === ws.OPEN) {
    console.log("Someone connected");
    ws.send("Welcome to the sever!");
    wss.broadcast("Folks, an anonymous somebody just joined us");
  }

	db.run(`
		INSERT INTO visitors (count, time)
		VALUES (${numClients}, datetime('now'))
	`)

  ws.on("close", () => {
    console.log("someone disconnected");
    wss.broadcast(`So someone left, we have ${numClients}`);
  });
});

wss.broadcast = function (data) {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

const db = new sqlite.Database(':memory:'); // this can be in memory or a file

db.serialize(() => {
	db.run(`
		CREATE TABLE visitors (
			count INTEGER,
			time TEXT
		)
	`)
});

function getCounts() {
	db.each("SELECT * FROM visitors", (err, row) => {
		console.log(row);
	})
}

function shutDownDb() {
	getCounts();
	console.log("shutting down the DB");
	db.close();
}
