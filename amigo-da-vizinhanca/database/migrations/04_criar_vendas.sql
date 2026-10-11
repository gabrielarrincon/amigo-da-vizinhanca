CREATE TABLE vendas (
                        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                        usuario_id BIGINT,
                        data_venda TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        valor_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
                        status VARCHAR(20) NOT NULL DEFAULT 'CONCLUIDA',

                        CONSTRAINT fk_venda_usuario
                            FOREIGN KEY (usuario_id)
                                REFERENCES usuarios(id),

                        CONSTRAINT chk_venda_valor
                            CHECK (valor_total >= 0),

                        CONSTRAINT chk_venda_status
                            CHECK (
                                status IN (
                                           'PENDENTE',
                                           'CONCLUIDA',
                                           'CANCELADA'
                                    )
                                )
);

