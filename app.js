const http = require('http');
const PORT = 3000;

// boiler plate setting up of server
http.createServer((req, res) => {
	res.write("<h1 style='font-family: sans-serif; color: purple;'>My attempt to be half a fool stack engnnr!!</h1>");
	res.end();
}).listen(PORT);

console.log(`The server is listening to requests on port ${PORT}`);
