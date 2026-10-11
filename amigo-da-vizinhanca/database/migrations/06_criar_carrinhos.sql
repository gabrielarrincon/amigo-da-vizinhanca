CREATE TABLE carrinhos (
                           id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           usuario_id BIGINT NOT NULL,
                           status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
                           data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT fk_carrinho_usuario
                               FOREIGN KEY (usuario_id)
                                   REFERENCES usuarios(id),

                           CONSTRAINT chk_carrinho_status
                               CHECK (
                                   status IN ('ABERTO', 'FINALIZADO', 'CANCELADO')
                                   )
);