CREATE TABLE produtos (
                          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          categoria_id BIGINT NOT NULL,
                          nome VARCHAR(120) NOT NULL,
                          descricao TEXT,
                          preco NUMERIC(10, 2) NOT NULL,
                          quantidade_estoque INTEGER NOT NULL DEFAULT 0,
                          ativo BOOLEAN NOT NULL DEFAULT TRUE,
                          data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_produto_categoria
                              FOREIGN KEY (categoria_id)
                                  REFERENCES categorias(id),

                          CONSTRAINT chk_produto_preco
                              CHECK (preco >= 0),

                          CONSTRAINT chk_produto_estoque
                              CHECK (quantidade_estoque >= 0)
);