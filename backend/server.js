
const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/status", (req, res) => {
    res.json({
        mensagem: "API do Amigo da Vizinhança funcionando!"
    });
});

app.get("/api/teste-banco", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT NOW() AS horario");

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

app.get("/api/produtos", async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                produtos.id,
                produtos.categoria_id,
                categorias.nome AS categoria,
                produtos.nome,
                produtos.descricao,
                produtos.preco,
                produtos.quantidade_estoque,
                produtos.ativo
            FROM produtos
            INNER JOIN categorias
                ON produtos.categoria_id = categorias.id
            WHERE produtos.ativo = true
            ORDER BY produtos.id
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error("Erro ao buscar produtos:", erro);
        res.status(500).json({
            mensagem: "Erro ao buscar produtos."
        });
    }
});

async function obterOuCriarCarrinho(conexao, usuarioId) {
    const resultado = await conexao.query(`
        SELECT id
        FROM carrinhos
        WHERE usuario_id = $1
          AND status = 'ABERTO'
        ORDER BY id DESC
        LIMIT 1
    `, [usuarioId]);

    if (resultado.rows.length > 0) {
        return resultado.rows[0].id;
    }

    const novoCarrinho = await conexao.query(`
        INSERT INTO carrinhos (usuario_id, status)
        VALUES ($1, 'ABERTO')
        RETURNING id
    `, [usuarioId]);

    return novoCarrinho.rows[0].id;
}

app.get("/api/carrinho/:usuarioId", async (req, res) => {
    try {
        const usuarioId = Number(req.params.usuarioId);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            return res.status(400).json({
                mensagem: "ID de usuário inválido."
            });
        }

        const carrinhoId = await obterOuCriarCarrinho(pool, usuarioId);

        const resultado = await pool.query(`
            SELECT
                itens_carrinho.id AS item_id,
                produtos.id AS produto_id,
                produtos.nome,
                produtos.descricao,
                produtos.preco,
                itens_carrinho.quantidade,
                produtos.quantidade_estoque,
                produtos.preco * itens_carrinho.quantidade AS subtotal
            FROM itens_carrinho
            INNER JOIN produtos
                ON itens_carrinho.produto_id = produtos.id
            WHERE itens_carrinho.carrinho_id = $1
            ORDER BY itens_carrinho.id
        `, [carrinhoId]);

        const total = resultado.rows.reduce(
            (soma, item) => soma + Number(item.subtotal),
            0
        );

        res.json({
            carrinhoId,
            usuarioId,
            itens: resultado.rows,
            total
        });
    } catch (erro) {
        console.error("Erro ao consultar carrinho:", erro);
        res.status(500).json({
            mensagem: "Erro ao consultar carrinho."
        });
    }
});

app.post("/api/carrinho/itens", async (req, res) => {
    const conexao = await pool.connect();

    try {
        const usuarioId = Number(req.body.usuarioId);
        const produtoId = Number(req.body.produtoId);
        const quantidade = Number(req.body.quantidade || 1);

        if (
            !Number.isInteger(usuarioId) || usuarioId <= 0 ||
            !Number.isInteger(produtoId) || produtoId <= 0 ||
            !Number.isInteger(quantidade) || quantidade <= 0
        ) {
            return res.status(400).json({
                mensagem: "Dados do produto ou usuário inválidos."
            });
        }

        await conexao.query("BEGIN");

        const produto = await conexao.query(`
            SELECT id, quantidade_estoque
            FROM produtos
            WHERE id = $1 AND ativo = true
            FOR UPDATE
        `, [produtoId]);

        if (produto.rows.length === 0) {
            await conexao.query("ROLLBACK");
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        const carrinhoId = await obterOuCriarCarrinho(conexao, usuarioId);

        const itemAtual = await conexao.query(`
            SELECT quantidade
            FROM itens_carrinho
            WHERE carrinho_id = $1 AND produto_id = $2
        `, [carrinhoId, produtoId]);

        const quantidadeAtual = itemAtual.rows.length > 0
            ? Number(itemAtual.rows[0].quantidade)
            : 0;

        if (quantidadeAtual + quantidade > produto.rows[0].quantidade_estoque) {
            await conexao.query("ROLLBACK");
            return res.status(400).json({
                mensagem: "Quantidade solicitada maior que o estoque disponível."
            });
        }

        await conexao.query(`
            INSERT INTO itens_carrinho (
                carrinho_id,
                produto_id,
                quantidade
            )
            VALUES ($1, $2, $3)
            ON CONFLICT (carrinho_id, produto_id)
            DO UPDATE SET
                quantidade = itens_carrinho.quantidade + EXCLUDED.quantidade
        `, [carrinhoId, produtoId, quantidade]);

        await conexao.query("COMMIT");

        res.status(201).json({
            mensagem: "Produto adicionado ao carrinho com sucesso."
        });
    } catch (erro) {
        await conexao.query("ROLLBACK");
        console.error("Erro ao adicionar produto:", erro);
        res.status(500).json({
            mensagem: "Erro ao adicionar produto ao carrinho."
        });
    } finally {
        conexao.release();
    }
});

app.put("/api/carrinho/itens/:itemId", async (req, res) => {
    try {
        const itemId = Number(req.params.itemId);
        const usuarioId = Number(req.body.usuarioId);
        const quantidade = Number(req.body.quantidade);

        if (
            !Number.isInteger(itemId) || itemId <= 0 ||
            !Number.isInteger(usuarioId) || usuarioId <= 0 ||
            !Number.isInteger(quantidade) || quantidade <= 0
        ) {
            return res.status(400).json({
                mensagem: "Dados inválidos."
            });
        }

        const resultado = await pool.query(`
            UPDATE itens_carrinho
            SET quantidade = $1
            FROM carrinhos, produtos
            WHERE itens_carrinho.id = $2
              AND itens_carrinho.carrinho_id = carrinhos.id
              AND itens_carrinho.produto_id = produtos.id
              AND carrinhos.usuario_id = $3
              AND carrinhos.status = 'ABERTO'
              AND quantidade <= produtos.quantidade_estoque
            RETURNING itens_carrinho.id
        `, [quantidade, itemId, usuarioId]);

        if (resultado.rows.length === 0) {
            return res.status(400).json({
                mensagem: "Item não encontrado ou quantidade acima do estoque."
            });
        }

        res.json({
            mensagem: "Quantidade atualizada com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao atualizar quantidade:", erro);
        res.status(500).json({
            mensagem: "Erro ao atualizar quantidade."
        });
    }
});

app.delete("/api/carrinho/itens/:itemId", async (req, res) => {
    try {
        const itemId = Number(req.params.itemId);
        const usuarioId = Number(req.query.usuarioId);

        if (
            !Number.isInteger(itemId) || itemId <= 0 ||
            !Number.isInteger(usuarioId) || usuarioId <= 0
        ) {
            return res.status(400).json({
                mensagem: "Dados inválidos."
            });
        }

        const resultado = await pool.query(`
            DELETE FROM itens_carrinho
            USING carrinhos
            WHERE itens_carrinho.id = $1
              AND itens_carrinho.carrinho_id = carrinhos.id
              AND carrinhos.usuario_id = $2
              AND carrinhos.status = 'ABERTO'
            RETURNING itens_carrinho.id
        `, [itemId, usuarioId]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: "Item não encontrado."
            });
        }

        res.json({
            mensagem: "Produto removido do carrinho."
        });
    } catch (erro) {
        console.error("Erro ao remover produto:", erro);
        res.status(500).json({
            mensagem: "Erro ao remover produto."
        });
    }
});

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`Servidor iniciado na porta ${PORTA}`);
});
