
-- 1. Consultar o estoque de todos os produtos
SELECT
    id,
    nome,
    quantidade_estoque AS estoque
FROM produtos
ORDER BY nome;

-- 2. Encontrar produtos com estoque baixo
SELECT
    id,
    nome,
    quantidade_estoque AS estoque
FROM produtos
WHERE quantidade_estoque <= 5
  AND ativo = TRUE
ORDER BY quantidade_estoque, nome;

-- 3. Consultar produtos com estoque zerado
SELECT
    id,
    nome
FROM produtos
WHERE quantidade_estoque = 0
  AND ativo = TRUE
ORDER BY nome;

-- 4. Consultar o valor estimado do estoque por produto
SELECT
    id,
    nome,
    quantidade_estoque,
    preco,
    quantidade_estoque * preco AS valor_em_estoque
FROM produtos
ORDER BY nome;
