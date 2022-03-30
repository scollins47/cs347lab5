const express = require('express');
const pg = require('pg');
const http = require("http");
const app = express();
const port = 3000;
app.use(express.static(__dirname + '/public'));
app.use(express.json());

// brew services start postgres
const config = {
    host: 'localhost',
    user: 'postgres',
    databse: 'lab5',
    password: 'Orange123',
    port: 5432,
}
const conString = 'postgres://newuser:Orange123@localhost/accounts';
const pool = new pg.Pool(config);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.get('/', async (req, res) => {
    root = __dirname
    res.sendFile(`${root}/index.html`);
    let resp = await pool.query("SELECT * FROM lab5");
    console.log(resp.rows);
});
app.get("/hello", (req, res) => {
    res.sendFile(`${__dirname}/hello.html`);
});
app.get("/signup", (req, res) => {
    res.sendFile(`${__dirname}/signup.html`);
});
app.get("/loadDB", async (req, res) => {
    let resp = await pool.query("SELECT * from lab5");
    res.json(resp.rows);
});
// not the safest but i forgot my sql knowledge <(* * <)
app.post("/login", async (req, res) => {
    user = req.body?.username;
    password = req.body?.password;
    console.log({ user, password });
    if (user != undefined && password != undefined) {
        let resp = await pool.query(`SELECT * FROM lab5`);
        for (entry of resp.rows) {
            console.log(entry);
            if (user == entry.username && password == entry.password) {
                return res.sendStatus(200);
            }
        }
        res.sendStatus(201);
    }
});
app.post("/signup", async (req, res) => {
    user = req.body?.username;
    password = req.body?.password;
    let resp = await pool.query(`SELECT * from lab5`);
    for (entry of resp.rows) {
        if (user == entry.username) {
            res.sendStatus(203);
            return;
        }
    }
    await pool.query(`INSERT INTO lab5 (username, password) VALUES ('${user}', '${password}');`);
    res.sendStatus(201);
});