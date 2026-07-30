/* ==================================================
   CONFIGURAÇÕES
================================================== */

const URL_API_REPERTORIO =
    "https://script.google.com/macros/s/AKfycbwBjY_GPtKl_gZp-N0rHHR0WQTI_dZ2sWroyJJI1U2toAwfasi1bWdUtvfnO88M7jUqhA/exec";


/* ==================================================
   ESTADO
================================================== */

let todasMusicas = [];

let termoPesquisa = "";

let categoriaAtual = "Todas";


/* ==================================================
   ELEMENTOS
================================================== */

const totalMusicas =
    document.getElementById("totalMusicas");

const totalCategorias =
    document.getElementById("totalCategorias");

const pesquisaRepertorio =
    document.getElementById("pesquisaRepertorio");

const filtrosCategorias =
    document.getElementById("filtrosCategorias");

const quantidadeExibida =
    document.getElementById("quantidadeExibida");

const carregandoRepertorio =
    document.getElementById("carregandoRepertorio");

const erroRepertorio =
    document.getElementById("erroRepertorio");

const nenhumResultado =
    document.getElementById("nenhumResultado");

const cardsCategorias =
    document.getElementById("cardsCategorias");

const tentarNovamente =
    document.getElementById("tentarNovamente");


/* ==================================================
   INICIALIZAÇÃO
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        configurarEventos();

        carregarRepertorio();

    }
);


/* ==================================================
   EVENTOS
================================================== */

function configurarEventos() {

    pesquisaRepertorio.addEventListener(
        "input",
        function() {

            termoPesquisa =
                normalizarTexto(
                    pesquisaRepertorio.value
                );

            renderizarRepertorio();

        }
    );


    tentarNovamente.addEventListener(
        "click",
        carregarRepertorio
    );

}


/* ==================================================
   CARREGAR REPERTÓRIO
================================================== */

async function carregarRepertorio() {

    mostrarCarregamento();

    try {

        const resposta = await fetch(
            URL_API_REPERTORIO, {
                method: "GET",
                cache: "no-store"
            }
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );

        }


        const dados =
            await resposta.json();


        if (!dados.sucesso) {

            throw new Error(
                dados.mensagem ||
                "A API não retornou sucesso."
            );

        }


        todasMusicas =
            Array.isArray(dados.musicas) ?
            dados.musicas : [];



        atualizarTotais();

        criarFiltros();

        renderizarRepertorio();

    } catch (erro) {

        console.error(
            "Erro ao carregar repertório:",
            erro
        );

        mostrarErro();

    }

}



/* ==================================================
   TOTAIS
================================================== */

function atualizarTotais() {

    const categorias =
        obterCategorias();


    totalMusicas.textContent =
        todasMusicas.length;


    totalCategorias.textContent =
        categorias.length;

}


/* ==================================================
   OBTER CATEGORIAS
================================================== */

function obterCategorias() {

    return [
        ...new Set(
            todasMusicas.map(
                function(musica) {

                    return musica.categoria ||
                        "Outros";

                }
            )
        )
    ].sort(
        function(a, b) {

            return a.localeCompare(
                b,
                "pt-BR", {
                    sensitivity: "base"
                }
            );

        }
    );

}


/* ==================================================
   CRIAR FILTROS
================================================== */

function criarFiltros() {

    const categorias = [
        "Todas",
        ...obterCategorias()
    ];


    filtrosCategorias.innerHTML = "";


    categorias.forEach(
        function(categoria) {

            const botao =
                document.createElement("button");


            botao.type = "button";

            botao.className =
                "botao-filtro";

            botao.textContent =
                categoria;


            if (categoria === categoriaAtual) {

                botao.classList.add(
                    "ativo"
                );

            }


            botao.addEventListener(
                "click",
                function() {

                    categoriaAtual =
                        categoria;


                    document
                        .querySelectorAll(
                            ".botao-filtro"
                        )
                        .forEach(
                            function(item) {

                                item.classList.remove(
                                    "ativo"
                                );

                            }
                        );


                    botao.classList.add(
                        "ativo"
                    );


                    renderizarRepertorio();

                }
            );


            filtrosCategorias.appendChild(
                botao
            );

        }
    );

}


/* ==================================================
   FILTRAR MÚSICAS
================================================== */

function obterMusicasFiltradas() {

    return todasMusicas.filter(
        function(musica) {

            const categoria =
                musica.categoria ||
                "Outros";


            const correspondeCategoria =
                categoriaAtual === "Todas" ||
                categoria === categoriaAtual;


            const textoCompleto =
                normalizarTexto(
                    musica.musica +
                    " " +
                    musica.artista +
                    " " +
                    categoria
                );


            const correspondePesquisa = !termoPesquisa ||
                textoCompleto.includes(
                    termoPesquisa
                );


            return (
                correspondeCategoria &&
                correspondePesquisa
            );

        }
    );

}


/* ==================================================
   RENDERIZAR REPERTÓRIO
================================================== */

function renderizarRepertorio() {

    const musicas =
        obterMusicasFiltradas();


    cardsCategorias.innerHTML = "";


    carregandoRepertorio.classList.add(
        "d-none"
    );

    erroRepertorio.classList.add(
        "d-none"
    );


    atualizarQuantidadeExibida(
        musicas.length
    );


    if (musicas.length === 0) {

        nenhumResultado.classList.remove(
            "d-none"
        );

        return;

    }


    nenhumResultado.classList.add(
        "d-none"
    );


    musicas.forEach(
        function(musica, indice) {

            const card =
                criarCardMusica(
                    musica,
                    indice
                );


            cardsCategorias.appendChild(
                card
            );

        }
    );

}


/* ==================================================
   CRIAR CARD
================================================== */

/* ==================================================
   CRIAR ITEM DA LISTA
================================================== */

function criarCardMusica(musica, indice) {

    const item =
        document.createElement("article");

    item.className =
        "item-musica-repertorio animar-card";

    item.style.animationDelay =
        Math.min(indice * 0.015, 0.25) + "s";

    item.innerHTML = `
        <strong class="item-musica-nome">
            ${escaparHtml(musica.musica)}
        </strong>

        <div class="item-musica-informacoes">

            <span class="item-musica-artista">
                ${escaparHtml(musica.artista)}
            </span>

            <span class="item-musica-separador">
                •
            </span>

            <em class="item-musica-ritmo">
                ${escaparHtml(
                    musica.categoria || "Outros"
                )}
            </em>

        </div>
    `;

    return item;
}


/* ==================================================
   QUANTIDADE EXIBIDA
================================================== */

function atualizarQuantidadeExibida(
    quantidade
) {

    let texto;


    if (categoriaAtual === "Todas") {

        texto =
            quantidade === 1 ?
            "Exibindo 1 música" :
            "Exibindo " +
            quantidade +
            " músicas/seleções";

    } else {

        texto =
            quantidade === 1 ?
            "Exibindo 1 música de " +
            categoriaAtual :
            "Exibindo " +
            quantidade +
            " músicas/seleções de " +
            categoriaAtual;

    }


    if (termoPesquisa) {

        texto +=
            ' para a pesquisa "' +
            pesquisaRepertorio.value.trim() +
            '"';

    }


    quantidadeExibida.textContent =
        texto;

}


/* ==================================================
   ESTADOS
================================================== */

function mostrarCarregamento() {

    carregandoRepertorio.classList.remove(
        "d-none"
    );

    erroRepertorio.classList.add(
        "d-none"
    );

    nenhumResultado.classList.add(
        "d-none"
    );

    cardsCategorias.innerHTML = "";

}


function mostrarErro() {

    carregandoRepertorio.classList.add(
        "d-none"
    );

    erroRepertorio.classList.remove(
        "d-none"
    );

    nenhumResultado.classList.add(
        "d-none"
    );

    cardsCategorias.innerHTML = "";

    quantidadeExibida.textContent =
        "Não foi possível carregar as músicas.";

}


/* ==================================================
   UTILITÁRIOS
================================================== */

function normalizarTexto(texto) {

    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


function escaparHtml(texto) {

    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}