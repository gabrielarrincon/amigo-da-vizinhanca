
-- 1. Contar registros de cada tabela
SELECT 'categorias' AS tabela, COUNT(*) AS total FROM categorias
UNION ALL
SELECT 'produtos', COUNT(*) FROM produtos
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'carrinhos', COUNT(*) FROM carrinhos
UNION ALL
SELECT 'itens_carrinho', COUNT(*) FROM itens_carrinho
UNION ALL
SELECT 'vendas', COUNT(*) FROM vendas
UNION ALL
SELECT 'itens_venda', COUNT(*) FROM itens_venda
ORDER BY tabela;

-- 2. Identificar produtos sem categoria válida
SELECT p.id, p.nome, p.categoria_id
FROM produtos p
         LEFT JOIN categorias c ON c.id = p.categoria_id
WHERE c.id IS NULL;

-- 3. Identificar itens de venda sem venda válida
SELECT iv.id, iv.venda_id
FROM itens_venda iv
         LEFT JOIN vendas v ON v.id = iv.venda_id
WHERE v.id IS NULL;

-- 4. Conferir se o total dos itens corresponde ao total da venda
SELECT
    v.id AS venda_id,
    v.valor_total AS total_registrado,
    COALESCE(
            SUM(iv.quantidade * iv.preco_unitario), 0
    ) AS total_calculado
FROM vendas v
         LEFT JOIN itens_venda iv ON iv.venda_id = v.id
GROUP BY v.id, v.valor_total
HAVING v.valor_total <> COALESCE(
        SUM(iv.quantidade * iv.preco_unitario), 0
                        );
