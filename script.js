
document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:3000/api";
    const USUARIO_ID = 1;

    const campoBusca = document.getElementById("busca");
    const botaoPesquisar = document.getElementById("botaoPesquisar");
    const botoesCategoria = document.querySelectorAll(".categoria");
    const mensagemCarrinho = document.getElementById("mensagemCarrinho");
    const listaProdutos = document.querySelector(".lista-produtos");
    const itensCarrinho = document.getElementById("itensCarrinho");
    const totalCarrinho = document.getElementById("totalCarrinho");

    const detalheImagem = document.getElementById("detalheImagem");
    const detalheNome = document.getElementById("detalheNome");
    const detalheCategoria = document.getElementById("detalheCategoria");
    const detalheDescricao = document.getElementById("detalheDescricao");
    const detalhePreco = document.getElementById("detalhePreco");
    const quantidadeDetalhe = document.getElementById("quantidadeDetalhe");
    const diminuirQuantidade = document.getElementById("diminuirQuantidade");
    const aumentarQuantidade = document.getElementById("aumentarQuantidade");
    const adicionarDetalhe = document.getElementById("adicionarDetalhe");
    const mensagemDetalhe = document.getElementById("mensagemDetalhe");

    let carrinho = [];
    let produtos = [];
    let categoriaSelecionada = "todas";
    let produtoSelecionado = null;
    let quantidadeAtual = 1;

    function formatarPreco(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function normalizarTexto(texto) {
        return String(texto)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function obterImagem(nome) {
        const imagens = {
            "arroz 5kg": "imagens/arroz.jpg",
            "feijao 1kg": "imagens/feijao.jpg",
            "refrigerante 2l": "imagens/refrigerante.jpg",
            "sabonete": "imagens/sabonete.jpg",
            "detergente": "imagens/detergente.jpg"
        };

        return imagens[normalizarTexto(nome)] || "";
    }

    function obterCategoriaSlug(categoria) {
        return normalizarTexto(categoria).replace(/\s+/g, "-");
    }

    async function carregarCarrinho() {
        try {
            const resposta = await fetch(
                API_URL + "/carrinho/" + USUARIO_ID
            );

            if (!resposta.ok) {
                throw new Error("Não foi possível carregar o carrinho.");
            }

            const dados = await resposta.json();

            carrinho = dados.itens.map(function (item) {
                return {
                    id: item.item_id,
                    produtoId: item.produto_id,
                    nome: item.nome,
                    preco: Number(item.preco),
                    quantidade: Number(item.quantidade),
                    imagem: obterImagem(item.nome),
                    estoque: Number(item.quantidade_estoque)
                };
            });

            atualizarCarrinho();

        } catch (erro) {
            console.error("Erro ao carregar carrinho:", erro);

            if (itensCarrinho) {
                itensCarrinho.textContent =
                    "Não foi possível carregar o carrinho.";
            }
        }
    }

    async function adicionarAoCarrinho(produto, quantidadeAdicionar) {
        try {
            const resposta = await fetch(API_URL + "/carrinho/itens", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuarioId: USUARIO_ID,
                    produtoId: produto.id,
                    quantidade: quantidadeAdicionar
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.mensagem || "Não foi possível adicionar o produto.");
            }

            await carregarCarrinho();

            return true;

        } catch (erro) {
            console.error("Erro ao adicionar produto:", erro);

            alert(erro.message);

            return false;
        }
    }

    async function atualizarQuantidade(item, novaQuantidade) {
        try {
            const resposta = await fetch(
                API_URL + "/carrinho/itens/" + item.id,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuarioId: USUARIO_ID,
                        quantidade: novaQuantidade
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.mensagem || "Não foi possível atualizar a quantidade.");
            }

            await carregarCarrinho();

        } catch (erro) {
            console.error("Erro ao atualizar quantidade:", erro);
            alert(erro.message);
        }
    }

    async function removerDoCarrinho(item) {
        try {
            const resposta = await fetch(
                API_URL + "/carrinho/itens/" + item.id +
                "?usuarioId=" + USUARIO_ID,
                {
                    method: "DELETE"
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.mensagem || "Não foi possível remover o produto.");
            }

            await carregarCarrinho();

        } catch (erro) {
            console.error("Erro ao remover produto:", erro);
            alert(erro.message);
        }
    }

    function filtrarProdutos() {
        const textoBusca = campoBusca
            ? normalizarTexto(campoBusca.value.trim())
            : "";

        document.querySelectorAll(".produto").forEach(function (elemento) {
            const nome = normalizarTexto(elemento.dataset.nome || "");
            const categoria = elemento.dataset.categoria || "";

            const correspondeNome = nome.includes(textoBusca);

            const correspondeCategoria =
                categoriaSelecionada === "todas" ||
                categoria === categoriaSelecionada;

            elemento.style.display =
                correspondeNome && correspondeCategoria ? "" : "none";
        });
    }

    function abrirDetalhes(produto) {
        window.location.href =
            "detalhes.html?produtoId=" + encodeURIComponent(produto.id);
    }

    function criarCardProduto(produto) {
        const artigo = document.createElement("article");
        artigo.className = "produto";
        artigo.dataset.categoria = obterCategoriaSlug(produto.categoria);
        artigo.dataset.nome = produto.nome;

        const imagem = document.createElement("img");
        imagem.src = obterImagem(produto.nome);
        imagem.alt = produto.nome;
        imagem.className = "imagem-produto";

        const detalhes = document.createElement("div");
        detalhes.className = "detalhes-produto";

        const titulo = document.createElement("h3");
        titulo.textContent = produto.nome;

        const descricao = document.createElement("p");
        descricao.textContent = produto.descricao;

        const preco = document.createElement("p");
        preco.className = "preco";
        preco.textContent = formatarPreco(produto.preco);

        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = "Adicionar ao carrinho";

        imagem.style.cursor = "pointer";
        titulo.style.cursor = "pointer";

        imagem.title = "Ver detalhes do produto";
        titulo.title = "Ver detalhes do produto";

        imagem.addEventListener("click", function () {
            abrirDetalhes(produto);
        });

        titulo.addEventListener("click", function () {
            abrirDetalhes(produto);
        });

        botao.addEventListener("click", async function () {
            botao.disabled = true;

            const adicionado = await adicionarAoCarrinho(produto, 1);

            botao.disabled = false;

            if (adicionado && mensagemCarrinho) {
                mensagemCarrinho.textContent =
                    produto.nome + " adicionado ao carrinho!";
            }
        });

        imagem.addEventListener("error", function () {
            imagem.style.display = "none";
        });

        detalhes.appendChild(titulo);
        detalhes.appendChild(descricao);
        detalhes.appendChild(preco);
        detalhes.appendChild(botao);

        artigo.appendChild(imagem);
        artigo.appendChild(detalhes);

        return artigo;
    }

    async function carregarProdutos() {
        try {
            const resposta = await fetch(API_URL + "/produtos");

            if (!resposta.ok) {
                throw new Error("Não foi possível carregar os produtos.");
            }

            produtos = await resposta.json();

            if (listaProdutos) {
                listaProdutos.innerHTML = "";

                produtos.forEach(function (produto) {
                    listaProdutos.appendChild(criarCardProduto(produto));
                });

                filtrarProdutos();
            }

            if (detalheImagem && detalheNome && adicionarDetalhe) {
                carregarDetalhes();
            }

        } catch (erro) {
            console.error("Erro ao carregar produtos:", erro);

            if (listaProdutos) {
                listaProdutos.textContent =
                    "Não foi possível carregar os produtos. Verifique se o servidor está funcionando.";
            }

            if (detalheNome) {
                detalheNome.textContent = "Erro ao carregar produto";
                detalheDescricao.textContent =
                    "Não foi possível conectar à loja. Tente novamente.";
                adicionarDetalhe.disabled = true;
            }
        }
    }

    if (botaoPesquisar) {
        botaoPesquisar.addEventListener("click", filtrarProdutos);
    }

    if (campoBusca) {
        campoBusca.addEventListener("input", filtrarProdutos);
    }

    botoesCategoria.forEach(function (botao) {
        botao.addEventListener("click", function () {
            categoriaSelecionada = botao.dataset.categoria || "todas";

            filtrarProdutos();

            const secaoProdutos = document.getElementById("produtos");

            if (secaoProdutos) {
                secaoProdutos.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    function carregarDetalhes() {
        const parametros = new URLSearchParams(window.location.search);
        const idSelecionado = parametros.get("produtoId");
        const nomeSelecionado = parametros.get("produto");

        produtoSelecionado = produtos.find(function (produto) {
            return idSelecionado
                ? String(produto.id) === String(idSelecionado)
                : produto.nome === nomeSelecionado;
        });

        if (!produtoSelecionado) {
            detalheNome.textContent = "Produto não encontrado";
            detalheDescricao.textContent =
                "Volte para a loja e escolha um produto disponível.";
            detalheImagem.style.display = "none";
            detalhePreco.textContent = "";
            detalheCategoria.textContent = "";
            adicionarDetalhe.disabled = true;
            return;
        }

        detalheImagem.src = obterImagem(produtoSelecionado.nome);
        detalheImagem.alt = produtoSelecionado.nome;
        detalheImagem.style.display = "";

        detalheNome.textContent = produtoSelecionado.nome;
        detalheCategoria.textContent = produtoSelecionado.categoria;
        detalheDescricao.textContent = produtoSelecionado.descricao;
        detalhePreco.textContent = formatarPreco(produtoSelecionado.preco);

        document.title =
            produtoSelecionado.nome + " - Amigo da Vizinhança";

        detalheImagem.addEventListener("error", function () {
            detalheImagem.style.display = "none";
        });

        quantidadeAtual = 1;
        quantidadeDetalhe.textContent = "1";
        adicionarDetalhe.disabled = false;
    }

    if (diminuirQuantidade) {
        diminuirQuantidade.addEventListener("click", function () {
            if (quantidadeAtual > 1) {
                quantidadeAtual--;
                quantidadeDetalhe.textContent = String(quantidadeAtual);
            }
        });
    }

    if (aumentarQuantidade) {
        aumentarQuantidade.addEventListener("click", function () {
            if (!produtoSelecionado) return;

            const estoque = Number(produtoSelecionado.quantidade_estoque);

            if (quantidadeAtual < estoque) {
                quantidadeAtual++;
                quantidadeDetalhe.textContent = String(quantidadeAtual);
            } else if (mensagemDetalhe) {
                mensagemDetalhe.textContent =
                    "Quantidade máxima disponível em estoque: " + estoque;
            }
        });
    }

    if (adicionarDetalhe) {
        adicionarDetalhe.addEventListener("click", async function () {
            if (!produtoSelecionado) return;

            adicionarDetalhe.disabled = true;

            const adicionado = await adicionarAoCarrinho(
                produtoSelecionado,
                quantidadeAtual
            );

            adicionarDetalhe.disabled = false;

            if (adicionado && mensagemDetalhe) {
                mensagemDetalhe.textContent =
                    quantidadeAtual + " unidade(s) de " +
                    produtoSelecionado.nome +
                    " adicionada(s) ao carrinho!";
            }
        });
    }

    function atualizarCarrinho() {
        if (!itensCarrinho || !totalCarrinho) return;

        itensCarrinho.innerHTML = "";

        let total = 0;
        let quantidadeTotal = 0;

        if (carrinho.length === 0) {
            itensCarrinho.textContent = "Seu carrinho está vazio.";
        }

        carrinho.forEach(function (item) {
            const subtotal = Number(item.preco) * Number(item.quantidade);

            total += subtotal;
            quantidadeTotal += Number(item.quantidade);

            const linha = document.createElement("div");
            linha.className = "item-carrinho";

            const imagem = document.createElement("img");
            imagem.className = "imagem-item-carrinho";
            imagem.alt = item.nome;
            imagem.src = item.imagem || "";

            imagem.addEventListener("error", function () {
                imagem.style.display = "none";
            });

            const descricao = document.createElement("p");
            descricao.className = "descricao-item-carrinho";
            descricao.textContent =
                item.nome + " — " + formatarPreco(item.preco) + " cada";

            const controles = document.createElement("div");
            controles.className = "controles-quantidade";

            const diminuir = document.createElement("button");
            diminuir.type = "button";
            diminuir.textContent = "−";

            const quantidade = document.createElement("span");
            quantidade.className = "quantidade-item";
            quantidade.textContent = item.quantidade;

            const aumentar = document.createElement("button");
            aumentar.type = "button";
            aumentar.textContent = "+";

            diminuir.addEventListener("click", async function () {
                diminuir.disabled = true;

                if (item.quantidade <= 1) {
                    await removerDoCarrinho(item);
                } else {
                    await atualizarQuantidade(item, item.quantidade - 1);
                }

                diminuir.disabled = false;
            });

            aumentar.addEventListener("click", async function () {
                if (item.quantidade < item.estoque) {
                    aumentar.disabled = true;
                    await atualizarQuantidade(item, item.quantidade + 1);
                    aumentar.disabled = false;
                } else {
                    alert(
                        "Quantidade máxima disponível em estoque: " +
                        item.estoque
                    );
                }
            });

            controles.appendChild(diminuir);
            controles.appendChild(quantidade);
            controles.appendChild(aumentar);

            const valorSubtotal = document.createElement("p");
            valorSubtotal.className = "subtotal-item";
            valorSubtotal.textContent = formatarPreco(subtotal);

            const remover = document.createElement("button");
            remover.type = "button";
            remover.className = "botao-remover";
            remover.textContent = "Remover";

            remover.addEventListener("click", async function () {
                remover.disabled = true;
                await removerDoCarrinho(item);
                remover.disabled = false;
            });

            linha.appendChild(imagem);
            linha.appendChild(descricao);
            linha.appendChild(controles);
            linha.appendChild(valorSubtotal);
            linha.appendChild(remover);

            itensCarrinho.appendChild(linha);
        });

        totalCarrinho.textContent =
            "Total (" + quantidadeTotal + " itens): " +
            formatarPreco(total);
    }

    carregarCarrinho();
    carregarProdutos();
});
