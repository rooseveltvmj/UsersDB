import 'dotenv/config.js';
import express from "express";
import mysql from "mysql2/promise";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with {type: 'json'};

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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


//BUSCA OS USUARIOS
app.get("/users", async (req, res) => {
    try{
        const [rows] = await pool.query("SELECT * FROM users");
        return res.json({"result": rows});
    }
    catch(error){
        console.error("Erro, tente novamente :(", error);
        return res.status(500).json({"msg": "Algo deu errado!"});
    }
});


//CADASTRO DE USUARIOS
app.post("/users", async (req, res) => {
    try {
        const {nome, sexo} = req.body;
        // let nome = req.body;
        // // let sexo = req.body;

        /*if(nome == "senai") {
            throw new Error("Nome invalido");
         } */

        if (!nome || !sexo) {
            return res.status(400).json ({"msg": "Nome e sexo são obrigatorios."});
        }

        const [result] = await pool.query(
            "INSERT INTO users VALUES(null, ?, ?);",
            [nome, sexo]
        );

        return res.status(201).json({
            msg: "Deu certo."
        });

        }
        catch (error) {
            console.error("Erro ao cadastrar usuário", error);
            return res.status(500).json({"msg": "Algo deu errado ao cadastrar o usuario" });
        }
});


//DELETAR OS USUARIOS - PASSAR O VALOR POR PARAMETROS
app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [result] = await pool.query
        ("DELETE FROM users WHERE id = ?;",
        [id]
    );
    
    if (result === -1) {
        return res.status(404).json({ result: "Usuário não encontrado!" });
    }
    
    return res.status(200).json({ result: "Usuário removido com sucesso" });
}
    catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(500).json({ "msg": "Algo deu errado ao remover o usuário!" });
    }
});


//ATUALIZA OS USUARIOS - PASSAR O VALOR POR PARAMETROS E BODY
app.patch('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let nome = req.body;
        let sexo = req.body;
    
        const [result] = await pool.query(
            "UPDATE users SET nome = ?, sexo = ? WHERE id = ?;",
            [nome, sexo, id]
            );
            
            if (result === 0) {
                return res.status(404).json({ result: "Usuário não encontrado!" });
            }
            
            return res.status(200).json({ result: "Sucesso ao atualizar!" });
        }
        catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            return res.status(500).json({ "msg": "Algo deu errado ao atualizar o usuário!" });
    }
});


app.listen(port, () => {
    console.log("Servidor na porta: " + port);
});