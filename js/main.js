/* ==================================================
   NAVBAR AO ROLAR A PÁGINA
================================================== */

const navbar = document.querySelector(".navbar-site");

function alterarNavbar() {
    if (window.scrollY > 40) {
        navbar.classList.add("navbar-rolagem");
    } else {
        navbar.classList.remove("navbar-rolagem");
    }
}

window.addEventListener("scroll", alterarNavbar);
alterarNavbar();


/* ==================================================
   FECHAR MENU MOBILE DEPOIS DO CLIQUE
================================================== */

const linksMenu = document.querySelectorAll(
    "#menuPrincipal .nav-link"
);

const menuPrincipal = document.querySelector(
    "#menuPrincipal"
);

linksMenu.forEach(function(link) {
    link.addEventListener("click", function() {

        if (menuPrincipal.classList.contains("show")) {
            const menuBootstrap =
                bootstrap.Collapse.getOrCreateInstance(menuPrincipal);

            menuBootstrap.hide();
        }

    });
});


/* ==================================================
   CALCULADORA DE ORÇAMENTO
================================================== */

document.addEventListener("DOMContentLoaded", function() {

    /* ==================================================
       CONFIGURAÇÕES
    ================================================== */

    const numeroWhatsApp = "5513996722543";

    /*
     * Depois vamos colocar aqui a URL do novo Apps Script.
     * Por enquanto, deixe vazio.
     */
    const URL_APPS_SCRIPT_ORCAMENTO =
        "https://script.google.com/macros/s/AKfycbwLUXAKC1GFXVp5dgHQa6LMGJ97dJWN5xicnVrzLnmyCm7IYCQjPsCkNkLcetDKjcnX/exec";


    /* ==================================================
       ELEMENTOS DA CALCULADORA
    ================================================== */

    const etapas =
        document.querySelectorAll(".calculadora-etapa");

    const progressoItens =
        document.querySelectorAll(".progresso-item");

    const barraProgresso =
        document.getElementById("barraProgresso");

    const botoesProximo =
        document.querySelectorAll(".btn-proximo");

    const botoesVoltar =
        document.querySelectorAll(".btn-voltar");

    const botaoReiniciar =
        document.getElementById("reiniciarCalculadora");


    /* ==================================================
       CAMPOS DE CONTATO
    ================================================== */

    const nomeOrcamento =
        document.getElementById("nomeOrcamento");

    const whatsappOrcamento =
        document.getElementById("whatsappOrcamento");

    const emailOrcamento =
        document.getElementById("emailOrcamento");

    const siteOrcamento =
        document.getElementById("siteOrcamento");


    /* ==================================================
       CAMPOS DO EVENTO
    ================================================== */

    const cidadeEvento =
        document.getElementById("cidadeEvento");

    const campoOutraCidade =
        document.getElementById("campoOutraCidade");

    const outraCidade =
        document.getElementById("outraCidade");


    let assinaturaUltimoEnvio = "";

    /*
     * Guarda os dados mais recentes da estimativa.
     * Eles serão usados para montar o PDF.
     */
    let ultimoDadosOrcamento = null;

    const botaoBaixarPdf =
        document.getElementById("baixarPdfOrcamento");


    /* ==================================================
       MÁSCARA DO WHATSAPP
    ================================================== */

    if (whatsappOrcamento) {

        whatsappOrcamento.addEventListener(
            "input",
            function() {

                let numero =
                    whatsappOrcamento.value.replace(/\D/g, "");

                numero = numero.slice(0, 11);

                if (numero.length > 10) {

                    numero = numero.replace(
                        /^(\d{2})(\d{5})(\d{4})$/,
                        "($1) $2-$3"
                    );

                } else if (numero.length > 6) {

                    numero = numero.replace(
                        /^(\d{2})(\d{4})(\d{0,4})$/,
                        "($1) $2-$3"
                    );

                } else if (numero.length > 2) {

                    numero = numero.replace(
                        /^(\d{2})(\d{0,5})$/,
                        "($1) $2"
                    );

                } else if (numero.length > 0) {

                    numero = numero.replace(
                        /^(\d{0,2})$/,
                        "($1"
                    );

                }

                whatsappOrcamento.value = numero;

            }
        );

    }


    /* ==================================================
       CAMPO OUTRA CIDADE
    ================================================== */

    if (cidadeEvento) {

        cidadeEvento.addEventListener(
            "change",
            function() {

                if (cidadeEvento.value === "Outra cidade") {

                    campoOutraCidade.classList.remove("d-none");
                    outraCidade.focus();

                } else {

                    campoOutraCidade.classList.add("d-none");
                    outraCidade.value = "";

                }

            }
        );

    }


    /* ==================================================
       NAVEGAÇÃO ENTRE AS ETAPAS
    ================================================== */

    function mostrarEtapa(numeroEtapa) {

        etapas.forEach(function(etapa) {
            etapa.classList.remove("ativa");
        });

        const etapaAtual = document.querySelector(
            `.calculadora-etapa[data-step="${numeroEtapa}"]`
        );

        if (etapaAtual) {
            etapaAtual.classList.add("ativa");
        }

        progressoItens.forEach(function(item) {

            const numeroItem = Number(item.dataset.step);

            if (numeroItem <= numeroEtapa) {
                item.classList.add("ativo");
            } else {
                item.classList.remove("ativo");
            }

        });

        if (barraProgresso) {
            barraProgresso.style.width =
                `${numeroEtapa * 25}%`;
        }

    }


    /* ==================================================
       VALIDAÇÃO DAS ETAPAS
    ================================================== */

    function validarEtapa(numeroEtapa) {

        /* ETAPA 1 */
        if (numeroEtapa === 1) {

            const nome =
                nomeOrcamento.value.trim();

            const numeroWhatsapp =
                whatsappOrcamento.value.replace(/\D/g, "");

            const email =
                emailOrcamento.value.trim();

            const eventoSelecionado =
                document.querySelector(
                    'input[name="tipoEvento"]:checked'
                );

            if (nome.length < 2) {

                alert("Digite seu nome para continuar.");

                nomeOrcamento.focus();

                return false;

            }

            if (numeroWhatsapp.length < 10) {

                alert(
                    "Digite um número de WhatsApp válido com DDD."
                );

                whatsappOrcamento.focus();

                return false;

            }

            /*
             * O e-mail não é obrigatório.
             * Porém, se a pessoa preencher, precisa ser válido.
             */
            if (
                email &&
                !emailOrcamento.validity.valid
            ) {

                alert("Digite um endereço de e-mail válido.");

                emailOrcamento.focus();

                return false;

            }

            if (!eventoSelecionado) {

                alert(
                    "Escolha o tipo do evento para continuar."
                );

                return false;

            }

        }


        /* ETAPA 2 */
        if (numeroEtapa === 2) {

            const cidade =
                cidadeEvento.value;

            const local =
                document
                .getElementById("localEvento")
                .value
                .trim();

            const data =
                document.getElementById("dataEvento").value;

            if (!cidade) {

                alert("Selecione a cidade do evento.");

                cidadeEvento.focus();

                return false;

            }

            if (
                cidade === "Outra cidade" &&
                !outraCidade.value.trim()
            ) {

                alert("Digite o nome da cidade.");

                outraCidade.focus();

                return false;

            }

            if (!local) {

                alert(
                    "Informe o local ou endereço do evento."
                );

                document
                    .getElementById("localEvento")
                    .focus();

                return false;

            }

            if (!data) {

                alert(
                    "Informe a data aproximada do evento."
                );

                document
                    .getElementById("dataEvento")
                    .focus();

                return false;

            }

        }


        /* ETAPA 3 */
        if (numeroEtapa === 3) {

            const duracao =
                document.querySelector(
                    'input[name="duracaoEvento"]:checked'
                );

            const equipamento =
                document.querySelector(
                    'input[name="equipamentoSom"]:checked'
                );

            if (!duracao) {

                alert(
                    "Escolha a duração aproximada da apresentação."
                );

                return false;

            }

            if (!equipamento) {

                alert(
                    "Informe se será necessário levar equipamento de som."
                );

                return false;

            }

        }

        return true;

    }


    /* ==================================================
       FORMATAÇÃO
    ================================================== */

    function formatarData(dataOriginal) {

        if (!dataOriginal) {
            return "Não informada";
        }

        const partes = dataOriginal.split("-");

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    function formatarValor(valor) {

        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    }


    /* ==================================================
       GERAR RESUMO E CALCULAR VALOR
    ================================================== */

    function gerarResumo() {

        const evento =
            document.querySelector(
                'input[name="tipoEvento"]:checked'
            );

        const duracao =
            document.querySelector(
                'input[name="duracaoEvento"]:checked'
            );

        const equipamento =
            document.querySelector(
                'input[name="equipamentoSom"]:checked'
            );

        const cidadeSelect =
            document.getElementById("cidadeEvento");

        const cidadeOption =
            cidadeSelect.options[cidadeSelect.selectedIndex];

        let cidade = cidadeSelect.value;

        if (cidade === "Outra cidade") {
            cidade = outraCidade.value.trim();
        }

        const nome =
            nomeOrcamento.value.trim();

        const whatsapp =
            whatsappOrcamento.value.trim();

        const email =
            emailOrcamento.value.trim();

        const bairro =
            document
            .getElementById("bairroEvento")
            .value
            .trim();

        const local =
            document
            .getElementById("localEvento")
            .value
            .trim();

        const data =
            document.getElementById("dataEvento").value;

        const horario =
            document.getElementById("horarioEvento").value;

        const valorEvento =
            Number(evento.dataset.valor);

        const valorDuracao =
            Number(duracao.dataset.valor);

        const valorEquipamento =
            Number(equipamento.dataset.valor);

        const valorDeslocamento =
            Number(
                cidadeOption.dataset.deslocamento || 0
            );

        const valorTotal =
            valorEvento +
            valorDuracao +
            valorEquipamento +
            valorDeslocamento;

        const cidadePersonalizada =
            cidadeSelect.value === "Outra cidade";

        const avisoDeslocamento =
            document.getElementById(
                "avisoDeslocamento"
            );

        if (cidadePersonalizada) {

            avisoDeslocamento.classList.remove("d-none");

        } else {

            avisoDeslocamento.classList.add("d-none");

        }

        const localCompleto = bairro ?
            `${cidade} — ${bairro} — ${local}` :
            `${cidade} — ${local}`;

        const dataCompleta = horario ?
            `${formatarData(data)} às ${horario}` :
            formatarData(data);


        /* RESUMO VISÍVEL */

        document.getElementById(
            "resumoEvento"
        ).textContent = evento.value;

        document.getElementById(
            "resumoLocal"
        ).textContent = localCompleto;

        document.getElementById(
            "resumoData"
        ).textContent = dataCompleta;

        document.getElementById(
            "resumoDuracao"
        ).textContent = duracao.value;

        document.getElementById(
            "resumoSom"
        ).textContent = equipamento.value;

        document.getElementById(
            "valorEstimado"
        ).textContent = formatarValor(valorTotal);


        /* MENSAGEM DO WHATSAPP */

        const observacaoDeslocamento =
            cidadePersonalizada ?
            "\nObservação: deslocamento e hospedagem ficam por conta do contratante." :
            "";

        const linhaEmail = email ?
            `\nE-mail: ${email}` :
            "";

        const mensagemWhatsApp = `
Olá, Nicolas! Meu nome é ${nome}. Fiz uma estimativa pelo seu site e gostaria de confirmar um orçamento.

WhatsApp: ${whatsapp}${linhaEmail}

Tipo de evento: ${evento.value}
Cidade e local: ${localCompleto}
Data e horário: ${dataCompleta}
Duração: ${duracao.value}
Equipamento de som: ${equipamento.value}

Estimativa apresentada no site: ${formatarValor(valorTotal)}${observacaoDeslocamento}

Gostaria de verificar a disponibilidade e confirmar os detalhes.
        `.trim();

        const linkWhatsApp =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
                mensagemWhatsApp
            )}`;

        document.getElementById(
            "botaoWhatsAppOrcamento"
        ).href = linkWhatsApp;


        const dadosResumo = {
            nome: nome,
            whatsapp: whatsapp,
            email: email,
            tipoEvento: evento.value,
            cidade: cidade,
            bairro: bairro,
            local: local,
            dataEvento: formatarData(data),
            dataEventoOriginal: data,
            horario: horario || "Não informado",
            duracao: duracao.value,
            equipamento: equipamento.value,
            estimativa: formatarValor(valorTotal),
            estimativaNumero: valorTotal,
            cidadePersonalizada: cidadePersonalizada ?
                "SIM" : "NÃO",
            site: siteOrcamento ?
                siteOrcamento.value : ""
        };

        ultimoDadosOrcamento = dadosResumo;

        return dadosResumo;

    }

    /* ==================================================
   GERAR PROPOSTA EM PDF A4
================================================== */

    function carregarImagemComoDataURL(caminhoImagem) {

        return new Promise(function(resolve, reject) {

            const imagem = new Image();

            imagem.onload = function() {

                const canvas = document.createElement("canvas");

                canvas.width = imagem.naturalWidth;
                canvas.height = imagem.naturalHeight;

                const contexto = canvas.getContext("2d");

                contexto.drawImage(imagem, 0, 0);

                resolve(canvas.toDataURL("image/png"));

            };

            imagem.onerror = function() {

                reject(
                    new Error("Não foi possível carregar o logo.")
                );

            };

            imagem.src = caminhoImagem;

        });

    }


    function limparNomeArquivo(texto) {

        return String(texto || "Cliente")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }


    async function gerarPdfOrcamento(dados) {

        if (!window.jspdf || !window.jspdf.jsPDF) {

            alert(
                "A biblioteca do PDF não carregou. Atualize a página e tente novamente."
            );

            return;

        }

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const larguraPagina = 210;
        const alturaPagina = 297;
        const margem = 18;

        const larguraConteudo =
            larguraPagina - (margem * 2);


        /* ==================================================
           CABEÇALHO ESCURO
        ================================================== */

        pdf.setFillColor(11, 11, 15);

        pdf.rect(
            0,
            0,
            larguraPagina,
            50,
            "F"
        );


        /* ==================================================
           LOGO
        ================================================== */

        try {

            const logo =
                await carregarImagemComoDataURL(
                    "img/logo/LOGO-NC-2025-W.png"
                );

            pdf.addImage(
                logo,
                "PNG",
                margem,
                10,
                62,
                23
            );

        } catch (erro) {

            console.warn(
                "Logo não carregado no PDF:",
                erro
            );

            pdf.setTextColor(255, 255, 255);

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(18);

            pdf.text(
                "NICOLAS CARELI",
                margem,
                25
            );

        }


        /* ==================================================
           TÍTULO
        ================================================== */

        pdf.setTextColor(255, 255, 255);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(16);

        pdf.text(
            "PROPOSTA DE APRESENTAÇÃO MUSICAL",
            margem,
            42
        );


        /* ==================================================
           IDENTIFICAÇÃO
        ================================================== */

        let y = 65;

        pdf.setTextColor(0, 0, 0);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(15);

        pdf.text(
            "Olá, " + dados.nome + "!",
            margem,
            y
        );

        y += 9;

        pdf.setTextColor(55, 55, 55);

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(10.5);

        const introducao = pdf.splitTextToSize(
            "Esta proposta apresenta uma estimativa inicial para a realização de uma apresentação musical de Nicolas Careli. Os detalhes finais serão confirmados após o alinhamento das necessidades do evento e da disponibilidade da data.",
            larguraConteudo
        );

        pdf.text(
            introducao,
            margem,
            y
        );

        y += introducao.length * 5.2 + 7;


        /* ==================================================
           CAIXA DOS DADOS DO EVENTO
        ================================================== */

        pdf.setFillColor(247, 247, 249);

        pdf.roundedRect(
            margem,
            y,
            larguraConteudo,
            83,
            3,
            3,
            "F"
        );

        y += 9;

        pdf.setTextColor(20, 20, 24);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(12);

        pdf.text(
            "DETALHES DO EVENTO",
            margem + 7,
            y
        );

        y += 9;


        /* ==================================================
           LINHAS DOS DADOS
        ================================================== */

        const linhas = [
            ["Cliente", dados.nome],
            ["Tipo de evento", dados.tipoEvento],
            ["Cidade", dados.cidade],
            [
                "Bairro",
                dados.bairro || "Não informado"
            ],
            ["Local", dados.local],
            ["Data", dados.dataEvento],
            ["Horário", dados.horario],
            ["Duração", dados.duracao],
            [
                "Equipamento de som",
                dados.equipamento
            ]
        ];


        linhas.forEach(function(linha) {

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(9.5);

            pdf.setTextColor(80, 80, 86);

            pdf.text(
                linha[0] + ":",
                margem + 7,
                y
            );

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setTextColor(20, 20, 24);

            const valor = pdf.splitTextToSize(
                String(
                    linha[1] || "Não informado"
                ),
                108
            );

            pdf.text(
                valor,
                margem + 52,
                y
            );

            y += Math.max(
                7,
                valor.length * 4.3
            );

        });

        y += 7;


        /* ==================================================
           VALOR DA ESTIMATIVA
        ================================================== */

        pdf.setFillColor(0, 0, 0);

        pdf.roundedRect(
            margem,
            y,
            larguraConteudo,
            35,
            3,
            3,
            "F"
        );

        pdf.setTextColor(255, 255, 255);

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(10);

        pdf.text(
            "ESTIMATIVA INICIAL",
            margem + 8,
            y + 11
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(24);

        pdf.text(
            dados.estimativa,
            margem + 8,
            y + 26
        );

        y += 46;


        /* ==================================================
           INFORMAÇÕES IMPORTANTES
        ================================================== */

        pdf.setTextColor(35, 35, 40);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(11);

        pdf.text(
            "INFORMAÇÕES IMPORTANTES",
            margem,
            y
        );

        y += 8;

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(9.5);

        const observacoes = [
            "O valor apresentado é uma estimativa inicial e não representa reserva automática da data.",
            "O valor final poderá variar conforme distância, estrutura, repertório, duração e características específicas do evento.",
            "A contratação será confirmada somente após alinhamento dos detalhes e aceite das condições combinadas."
        ];

        if (
            dados.cidadePersonalizada === "SIM"
        ) {

            observacoes.push(
                "Para cidades fora da lista, deslocamento e hospedagem ficam por conta do contratante."
            );

        }

        observacoes.forEach(
            function(textoObservacao) {

                const texto =
                    pdf.splitTextToSize(
                        "• " + textoObservacao,
                        larguraConteudo
                    );

                pdf.text(
                    texto,
                    margem,
                    y
                );

                y += texto.length * 4.8 + 2;

            }
        );


        /* ==================================================
           RODAPÉ
        ================================================== */

        pdf.setDrawColor(220, 220, 225);

        pdf.line(
            margem,
            alturaPagina - 28,
            larguraPagina - margem,
            alturaPagina - 28
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(9.5);

        pdf.setTextColor(0, 0, 0);

        pdf.text(
            "NICOLAS CARELI — MÚSICA AO VIVO",
            margem,
            alturaPagina - 20
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setTextColor(70, 70, 75);

        pdf.setFontSize(8.5);

        pdf.text(
            "WhatsApp: (13) 99672-2543  |  Instagram: @nicolascarelioficial",
            margem,
            alturaPagina - 14
        );

        pdf.text(
            "E-mail: contato.nicolascareli@gmail.com  |  Itanhaém - SP",
            margem,
            alturaPagina - 9
        );


        /* ==================================================
           NOME DO ARQUIVO
        ================================================== */

        const nomeArquivo =
            "Proposta-Nicolas-Careli-" +
            limparNomeArquivo(dados.nome) +
            ".pdf";

        pdf.save(nomeArquivo);

    }


    /* ==================================================
       CLIQUE NO BOTÃO DE PDF
    ================================================== */

    if (botaoBaixarPdf) {

        botaoBaixarPdf.addEventListener(
            "click",
            async function() {

                if (!ultimoDadosOrcamento) {

                    alert(
                        "Gere a estimativa antes de baixar a proposta."
                    );

                    return;

                }

                const textoOriginal =
                    botaoBaixarPdf.innerHTML;

                botaoBaixarPdf.disabled = true;

                botaoBaixarPdf.innerHTML =
                    '<i class="bi bi-hourglass-split"></i> Gerando PDF...';

                try {

                    await gerarPdfOrcamento(
                        ultimoDadosOrcamento
                    );

                } catch (erro) {

                    console.error(
                        "Erro ao gerar PDF:",
                        erro
                    );

                    alert(
                        "Não foi possível gerar o PDF. Tente novamente."
                    );

                } finally {

                    botaoBaixarPdf.disabled = false;

                    botaoBaixarPdf.innerHTML =
                        textoOriginal;

                }

            }
        );

    }


    /* ==================================================
       ENVIAR PARA O GOOGLE SHEETS
    ================================================== */

    async function enviarOrcamento(dados) {

        /*
         * Enquanto a URL estiver vazia,
         * a calculadora funciona normalmente,
         * mas ainda não envia para a planilha.
         */
        if (!URL_APPS_SCRIPT_ORCAMENTO) {

            console.log(
                "Orçamento gerado. A URL do Apps Script ainda não foi configurada.",
                dados
            );

            return;

        }

        const assinaturaEnvio = JSON.stringify(dados);

        /*
         * Impede o envio duplicado do mesmo orçamento.
         */
        if (assinaturaEnvio === assinaturaUltimoEnvio) {
            return;
        }

        assinaturaUltimoEnvio = assinaturaEnvio;

        const dadosFormulario = new FormData();

        Object.entries(dados).forEach(
            function([campo, valor]) {

                dadosFormulario.append(campo, valor);

            }
        );

        try {

            await fetch(
                URL_APPS_SCRIPT_ORCAMENTO, {
                    method: "POST",
                    body: dadosFormulario,
                    mode: "no-cors"
                }
            );

            console.log(
                "Orçamento enviado para o Google Sheets."
            );

        } catch (erro) {

            /*
             * Mesmo que o envio falhe,
             * a estimativa continua aparecendo.
             */
            assinaturaUltimoEnvio = "";

            console.error(
                "Erro ao enviar orçamento:",
                erro
            );

        }

    }


    /* ==================================================
       BOTÕES CONTINUAR
    ================================================== */

    botoesProximo.forEach(function(botao) {

        botao.addEventListener(
            "click",
            function() {

                const etapaAtual = Number(
                    botao
                    .closest(".calculadora-etapa")
                    .dataset
                    .step
                );

                const proximaEtapa =
                    Number(botao.dataset.next);

                if (!validarEtapa(etapaAtual)) {
                    return;
                }

                if (proximaEtapa === 4) {

                    /*
                     * Primeiro mostra a estimativa.
                     * Depois envia os dados em segundo plano.
                     */
                    const dadosOrcamento =
                        gerarResumo();

                    mostrarEtapa(proximaEtapa);

                    enviarOrcamento(dadosOrcamento);

                    return;

                }

                mostrarEtapa(proximaEtapa);

            }
        );

    });


    /* ==================================================
       BOTÕES VOLTAR
    ================================================== */

    botoesVoltar.forEach(function(botao) {

        botao.addEventListener(
            "click",
            function() {

                const etapaAnterior =
                    Number(botao.dataset.prev);

                mostrarEtapa(etapaAnterior);

            }
        );

    });


    /* ==================================================
       REINICIAR CALCULADORA
    ================================================== */

    if (botaoReiniciar) {

        botaoReiniciar.addEventListener(
            "click",
            function() {

                document.querySelectorAll(
                    '.calculadora-orcamento input[type="radio"]'
                ).forEach(function(input) {

                    input.checked = false;

                });

                document.querySelectorAll(
                    ".calculadora-orcamento input[type='text'], " +
                    ".calculadora-orcamento input[type='email'], " +
                    ".calculadora-orcamento input[type='tel'], " +
                    ".calculadora-orcamento input[type='date'], " +
                    ".calculadora-orcamento input[type='time']"
                ).forEach(function(input) {

                    input.value = "";

                });

                document.getElementById(
                    "cidadeEvento"
                ).value = "";

                outraCidade.value = "";

                campoOutraCidade.classList.add("d-none");

                assinaturaUltimoEnvio = "";
                ultimoDadosOrcamento = null;

                mostrarEtapa(1);

            }
        );

    }

});


/* ==================================================
   ANO AUTOMÁTICO DO RODAPÉ
================================================== */

const anoAtual = document.getElementById("anoAtual");

if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
}


/* ==================================================
   ANIMAÇÕES AO ROLAR
================================================== */

const elementosAnimados = document.querySelectorAll(
    ".animar, .animar-esquerda, .animar-direita"
);

const observadorAnimacoes = new IntersectionObserver(
    (entradas, observador) => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("animado");

                observador.unobserve(entrada.target);

            }

        });

    }, {
        threshold: 0.12
    }
);

elementosAnimados.forEach(elemento => {
    observadorAnimacoes.observe(elemento);
});