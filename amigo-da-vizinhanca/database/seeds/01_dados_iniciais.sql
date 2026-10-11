INSERT INTO categorias (nome, descricao)
VALUES
    ('Mercearia', 'Alimentos e produtos básicos'),
    ('Bebidas', 'Bebidas variadas'),
    ('Higiene', 'Produtos de higiene pessoal'),
    ('Limpeza', 'Produtos para limpeza doméstica');

INSERT INTO produtos
(categoria_id, nome, descricao, preco, quantidade_estoque)
VALUES
    (1, 'Arroz 5kg', 'Arroz camil', 28.90, 20),
    (1, 'Feijão 1kg', 'Feijão carioca', 8.50, 30),
    (2, 'Refrigerante 2L', 'Coca Cola', 9.99, 15),
    (3, 'Sabonete', 'Dove', 3.50, 40),
    (4, 'Detergente', 'Ype', 2.99, 25);
