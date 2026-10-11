CREATE TABLE usuarios (
                          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          nome VARCHAR(100) NOT NULL,
                          email VARCHAR(150) NOT NULL UNIQUE,
                          senha_hash VARCHAR(255) NOT NULL,
                          tipo VARCHAR(20) NOT NULL DEFAULT 'CLIENTE',
                          ativo BOOLEAN NOT NULL DEFAULT TRUE,
                          data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT chk_usuario_tipo
                              CHECK (tipo IN ('CLIENTE', 'ADMIN'))
);

