//Environment variables module
require("dotenv").config();

// Database module
const sqlite3 = require("sqlite3");

// HTTP module
const http = require("http");

// File system module and promises module
const fs = require("fs");
const fsp = require("fs").promises;

// Utils module
const utils = require("./utils");

// Create a database object
const db = new sqlite3.Database(process.env.DATABASE, (err) => {
  err ? console.error(err.message) : console.log("Connected to the database.");
});

const createTables = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS people
    (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  VARCHAR(50) NOT NULL,
      age   INTEGER NOT NULL
    );
  `);
  console.log("Tables created.");
};

// Create a server object
const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case "/":
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(await fsp.readFile("./html/index.html"));
      res.end();
      break;
    case "/people":
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(await fsp.readFile("./html/people.html"));
      res.end();
      break;
    case "/people/add":
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(await fsp.readFile("./html/add.html"));
      res.end();
      break;
    case "/people/update":
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(await fsp.readFile("./html/update.html"));
      res.end();
      break;
    case "/people/delete":
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(await fsp.readFile("./html/delete.html"));
      res.end();
      break;
    case "/api/people":
      switch (req.method) {
        case "GET":
          db.all("SELECT * FROM people", (err, rows) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.write(JSON.stringify({ error: err.message }));
              res.end();
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(JSON.stringify(rows));
              res.end();
            }
          });
          break;
        case "POST":
          utils.bodyParser(req, res, async () => {
            db.run(
              "INSERT INTO people (name, age) VALUES (?, ?)",
              [req.body.name, req.body.age],
              (err) => {
                if (err) {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.write(JSON.stringify({ error: err.message }));
                  res.end();
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.write(JSON.stringify({ message: "Person added." }));
                  res.end();
                }
              }
            );
          });
          break;
        case "PUT":
          utils.bodyParser(req, res, async () => {
            db.run(
              "UPDATE people SET name = ?, age = ? WHERE name = ?",
              [req.body.newName, req.body.age, req.body.name],
              (err) => {
                if (err) {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.write(JSON.stringify({ error: err.message }));
                  res.end();
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.write(JSON.stringify({ message: "Person updated." }));
                  res.end();
                }
              }
            );
          });
          break;
        case "DELETE":
          utils.bodyParser(req, res, async () => {
            db.run(
              "DELETE FROM people WHERE name = ?",
              [req.body.name],
              (err) => {
                if (err) {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.write(JSON.stringify({ error: err.message }));
                  res.end();
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.write(JSON.stringify({ message: "Person deleted." }));
                  res.end();
                }
              }
            );
          });
          break;
        default:
          res.writeHead(500, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ error: "Invalid method." }));
          res.end();
          break;
      }
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/html" });
      res.write(await fsp.readFile("./html/404.html"));
      res.end();
      break;
  }
});

// Start the server
server.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `Server running at http://${process.env.HOST}:${process.env.PORT}/`
  );
  createTables(db);
});
