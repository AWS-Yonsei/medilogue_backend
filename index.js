const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const v4 = require("uuid").v4;
const ioc = require("socket.io-client");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const User = require("./model/user");
const Room = require("./model/chatRoom");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json({ extended: false }));
const connect = require("./db");
connect();

const api = require("./routes/index.js");
app.use("/", api);

const port = 8080;

//Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, { explorer: true })
);



app.get("/", (req, res) => res.send("Hi Claire Welcome to Node.js"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
