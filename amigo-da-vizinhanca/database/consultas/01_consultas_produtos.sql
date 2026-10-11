SELECT * FROM produtos ORDER BY id;

SELECT
    p.nome AS produto,
    c.nome AS categoria,
    p.preco,
    p.quantidade_estoque
FROM produtos p
         JOIN categorias c ON c.id = p.categoria_id
ORDER BY c.nome, p.nome;