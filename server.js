import 'dotenv/config.js';
import express from "express";
import mysql from "mysql2/promise";

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get("/users", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json({"result": rows});
});

app.listen(port, () => {
    console.log("Servidor na porta: " + port);
});