import express from 'express';
import dotenv from "dotenv"
import mysql from 'mysql2/promise'

dotenv.config();
const app = express();

app.get('/', (req, res) => {
    res.json({msg: 'Hello world'})
})

app.get('/characters', async(req, res) => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);    
    try {
        const query = "SELECT * FROM hp_character";
        const [rows] = await connection.query(query)
        res.send(rows);        
    } catch(err) {
        console.error(err)
    }
})

app.get('/characters/:id', async (req, res) => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);    

    let status = 200;
    let retVal = {};
    const {id} = req.params;

    try {
        const query = "SELECT * FROM hp_character WHERE hp_character.id=?"
        const [rows] = await connection.query(query, [id])
        retVal.data = rows
    } catch(err) {
        console.error(err)
        status = 500;
        retVal = err;
    } finally {
        res.status(status).json(retVal)
    }
})

app.listen(3001, () => {
    console.log("App is listening")
})