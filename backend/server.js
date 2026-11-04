
const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

// Testar se o servidor está funcionando
app.get("/api/status", (req, res) => {
    res.json({
        mensagem: "API do Amigo da Vizinhança funcionando!"
    });
});

// Testar conexão com PostgreSQL
app.get("/api/teste-banco", async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT NOW() AS horario"
        );

        res.json({
            mensagem: "Conexão com PostgreSQL realizada com sucesso!",
            horario: resultado.rows[0].horario
        });

    } catch (erro) {
        console.error("Erro ao consultar banco:", erro);

        res.status(500).json({
            mensagem: "Erro ao conectar com o banco de dados."
        });
    }
});

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`Servidor iniciado na porta ${PORTA}`);
});
