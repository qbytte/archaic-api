//Environment variables module
require('dotenv').config();

// Database module
const sqlite3 = require('sqlite3');

// HTTP module
const http = require('http');

// File system module and promises module
const fs = require('fs');
const fsp = require('fs').promises;

// Create a database object
const db = new sqlite3.Database(process.env.DATABASE, (err) => {
    err ? console.error(err.message) : console.log('Connected to the database.');
});

// Create a server object
const server = http.createServer(async (req, res) => {
    switch (req.url) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(await fsp.readFile('./html/index.html'));
            res.end();
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write(await fsp.readFile('./html/404.html'));
            res.end();
            break;
    }
});

// Start the server
server.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}/`);
});