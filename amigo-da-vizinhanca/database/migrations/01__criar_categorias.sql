CREATE TABLE categorias (
                            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                            nome VARCHAR(80) NOT NULL UNIQUE,
                            descricao VARCHAR(255),
                            ativa BOOLEAN NOT NULL DEFAULT TRUE,
                            data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

