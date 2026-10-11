# Banco de Dados — Amigo da Vizinhança

## 1. Sobre o banco de dados

O banco de dados do projeto Amigo da Vizinhança foi desenvolvido em PostgreSQL para armazenar e organizar as informações de uma aplicação de gerenciamento de um pequeno comércio de bairro.

A modelagem contempla o cadastro de categorias, produtos, usuários, carrinhos de compras e vendas, incluindo os respectivos itens.

## 2. Tecnologias utilizadas

- PostgreSQL
- SQL
- pgAdmin para administração e execução de consultas

## 3. Estrutura do banco

O banco é composto pelas seguintes tabelas:

| Tabela | Descrição |
|---|---|
| `categorias` | Armazena as categorias dos produtos. |
| `produtos` | Armazena informações dos produtos, preços e estoque. |
| `usuarios` | Registra clientes e administradores. |
| `carrinhos` | Armazena os carrinhos de compras dos usuários. |
| `itens_carrinho` | Relaciona os produtos adicionados aos carrinhos. |
| `vendas` | Registra as vendas, seus valores, status e controle de baixa de estoque. |
| `itens_venda` | Armazena os produtos e as quantidades de cada venda. |

## 4. Organização dos arquivos

- `migrations/`: scripts SQL para criação das tabelas e suas restrições.
- `seeds/`: scripts para inserir os dados iniciais de categorias e produtos.
- `consultas/`: consultas para visualizar produtos, estoque e vendas.
- `testes/`: consultas para validar a estrutura e a consistência dos dados.

## 5. Relacionamentos

- Cada produto pertence a uma categoria.
- Um usuário pode possuir carrinhos de compras e estar associado a vendas.
- Um carrinho pode conter vários itens.
- Cada item de carrinho referencia um produto.
- Uma venda pode conter vários itens.
- Cada item de venda referencia um produto.

Os relacionamentos são implementados por meio de chaves estrangeiras.

## 6. Regras de integridade

O banco possui restrições para garantir a consistência dos dados, incluindo:

- Preços e valores não negativos.
- Quantidades de estoque não negativas.
- Quantidades de itens maiores que zero.
- Tipos de usuário limitados a `CLIENTE` e `ADMIN`.
- Status de carrinhos e vendas limitados a valores definidos.
- E-mail único para cada usuário.
- Um mesmo produto não pode aparecer duplicado no mesmo carrinho.

A tabela `vendas` também possui o campo `estoque_baixado`, utilizado para registrar se a baixa de estoque referente à venda já foi realizada.

## 7. Como preparar o banco de dados

1. Crie um banco de dados chamado `amigo_da_vizinhanca` no PostgreSQL.
2. Execute os scripts da pasta `migrations` na ordem numérica, respeitando as dependências entre as tabelas.
3. Execute o script `seeds/01_dados_iniciais.sql` para inserir as categorias e os produtos iniciais.
4. Utilize os scripts da pasta `consultas` para consultar as informações.
5. Execute os scripts da pasta `testes` para verificar a estrutura e a consistência dos dados.

Os scripts de criação e de inserção inicial devem ser executados em um banco novo e vazio. Não execute novamente esses scripts no banco já populado.

## 8. Observações

Os dados de teste devem ser utilizados apenas para desenvolvimento. Credenciais e senhas reais não devem ser armazenadas em scripts SQL ou publicadas no repositório.

Este diretório documenta a camada de banco de dados do projeto Amigo da Vizinhança.