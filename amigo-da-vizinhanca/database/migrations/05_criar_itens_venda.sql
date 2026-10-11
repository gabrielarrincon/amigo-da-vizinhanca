CREATE TABLE itens_venda (
                             id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                             venda_id BIGINT NOT NULL,
                             produto_id BIGINT NOT NULL,
                             quantidade INTEGER NOT NULL,
                             preco_unitario NUMERIC(10, 2) NOT NULL,

                             CONSTRAINT fk_item_venda
                                 FOREIGN KEY (venda_id)
                                     REFERENCES vendas(id),

                             CONSTRAINT fk_item_produto
                                 FOREIGN KEY (produto_id)
                                     REFERENCES produtos(id),

                             CONSTRAINT chk_item_quantidade
                                 CHECK (quantidade > 0),

                             CONSTRAINT chk_item_preco
                                 CHECK (preco_unitario >= 0)
);