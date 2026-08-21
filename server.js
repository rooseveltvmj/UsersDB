import express from "express";
import mysql from "mysql2/promise";

const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'userdb',
    port: 3306,
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