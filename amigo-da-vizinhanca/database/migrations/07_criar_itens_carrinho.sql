CREATE TABLE itens_carrinho (
                                id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                carrinho_id BIGINT NOT NULL,
                                produto_id BIGINT NOT NULL,
                                quantidade INTEGER NOT NULL DEFAULT 1,

                                CONSTRAINT fk_item_carrinho
                                    FOREIGN KEY (carrinho_id)
                                        REFERENCES carrinhos(id),

                                CONSTRAINT fk_item_carrinho_produto
                                    FOREIGN KEY (produto_id)
                                        REFERENCES produtos(id),

                                CONSTRAINT uq_carrinho_produto
                                    UNIQUE (carrinho_id, produto_id),

                                CONSTRAINT chk_item_carrinho_quantidade
                                    CHECK (quantidade > 0)
);

