/* ==================================================
   AGENDA AUTOMÁTICA — NICOLAS CARELI
================================================== */

const AGENDA_URL =
    "https://script.google.com/macros/s/AKfycbzPTuPWY4A76l6f18RqQdP7XM9y_RcpXK8Ptkzlk63GjiANxU7c5Si5m791CsVt9dOc/exec";

const agendaHome = document.getElementById("agendaHome");
const agendaCompleta = document.getElementById("agendaCompleta");

/* ==================================================
   NOMES DOS MESES
================================================== */

const mesesCurtos = [
    "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
    "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
];

const mesesCompletos = [
    "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL",
    "MAIO", "JUNHO", "JULHO", "AGOSTO",
    "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

const diasSemana = [
    "DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA",
    "QUARTA-FEIRA", "QUINTA-FEIRA",
    "SEXTA-FEIRA", "SÁBADO"
];

/* ==================================================
   CONVERTER DATA SEM PROBLEMA DE FUSO HORÁRIO
================================================== */

function criarData(dataTexto, horaTexto = "00:00") {

    const [ano, mes, dia] = dataTexto.split("-").map(Number);
    const [hora, minuto] = horaTexto.split(":").map(Number);

    return new Date(
        ano,
        mes - 1,
        dia,
        hora || 0,
        minuto || 0,
        0
    );

}

/* ==================================================
   FORMATAÇÃO DA HORA
================================================== */

function formatarHora(hora) {

    if (!hora) {
        return "";
    }

    const [horas, minutos] = hora.split(":");

    if (minutos === "00") {
        return `${Number(horas)}h`;
    }

    return `${Number(horas)}h${minutos}`;

}

/* ==================================================
   CRIAR LINK DO GOOGLE MAPS
================================================== */

function criarLinkMaps(evento) {

    const destino = [
            evento.LOCAL,
            evento.ENDEREÇO,
            evento.CIDADE
        ]
        .filter(Boolean)
        .join(", ");

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destino)}`;

}

/* ==================================================
   VERIFICAR SE É EVENTO PÚBLICO
================================================== */

function eventoEhPublico(evento) {

    return String(evento["PÚBLICO"] || "")
        .trim()
        .toUpperCase() === "SIM";

}

/* ==================================================
   CARD DA HOME
================================================== */

function criarCardHome(evento) {

    const data = criarData(evento.DATA, evento.HORA);
    const publico = eventoEhPublico(evento);
    const linkMaps = criarLinkMaps(evento);

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = mesesCurtos[data.getMonth()];
    const diaSemana = diasSemana[data.getDay()];
    const hora = formatarHora(evento.HORA);

    const nomeLocal = publico ?
        evento.LOCAL :
        "Evento particular";

    const localizacao = evento.CIDADE || "Local a confirmar";

    const acao = publico ?
        `
            <a
                href="${linkMaps}"
                target="_blank"
                rel="noopener noreferrer"
                class="evento-link"
                aria-label="Ver localização de ${nomeLocal}"
            >
                <i class="bi bi-arrow-up-right"></i>
            </a>
        ` :
        `
            <span class="evento-privado" title="Evento particular">
                <i class="bi bi-lock"></i>
            </span>
        `;

    return `
        <article class="card-evento">

            <div class="evento-data">
                <span class="evento-dia">${dia}</span>
                <span class="evento-mes">${mes}</span>
            </div>

            <div class="evento-informacoes">

                <span class="evento-semana">
                    ${diaSemana}
                </span>

                <span class="evento-tipo">
                    ${evento.TIPO || "Música ao vivo"}
                </span>

                <h3>${nomeLocal}</h3>

                <p>
                    <i class="bi bi-geo-alt"></i>
                    ${localizacao}
                </p>

                <p>
                    <i class="bi bi-clock"></i>
                    A partir das ${hora}
                </p>

            </div>

            ${acao}

        </article>
    `;

}

/* ==================================================
   EVENTO DO MODAL
================================================== */

function criarEventoModal(evento) {

    const data = criarData(evento.DATA, evento.HORA);
    const publico = eventoEhPublico(evento);
    const linkMaps = criarLinkMaps(evento);

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = mesesCompletos[data.getMonth()];
    const semana = diasSemana[data.getDay()];
    const hora = formatarHora(evento.HORA);

    const nomeLocal = publico ?
        evento.LOCAL :
        "Evento particular";

    const localizacao = evento.CIDADE || "Local a confirmar";

    const acao = publico ?
        `
            <a
                href="${linkMaps}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-agenda"
            >
                Como chegar
                <i class="bi bi-arrow-up-right ms-2"></i>
            </a>
        ` :
        `
            <span class="evento-particular">
                <i class="bi bi-lock me-2"></i>
                Evento fechado
            </span>
        `;

    return `
        <div class="evento-modal">

            <div class="evento-modal-data">
                <strong>${dia}</strong>
                <span>${mes}</span>
            </div>

            <div class="evento-modal-info">

                <span>
                    ${semana} • ${hora}
                </span>

                <h3>${nomeLocal}</h3>

                <p>${localizacao}</p>

            </div>

            ${acao}

        </div>
    `;

}

/* ==================================================
   MENSAGEM SEM EVENTOS
================================================== */

function criarMensagemSemEventos() {

    return `
        <div class="agenda-vazia">

            <i class="bi bi-calendar-x"></i>

            <h3>Nenhuma apresentação agendada</h3>

            <p>
                Novas datas serão divulgadas em breve.
            </p>

            <a
                href="https://wa.me/5513996722543"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-agenda"
            >
                Contratar uma apresentação
                <i class="bi bi-whatsapp ms-2"></i>
            </a>

        </div>
    `;

}

/* ==================================================
   CARREGAR A PLANILHA
================================================== */

async function carregarAgenda() {

    try {

        const resposta = await fetch(AGENDA_URL);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar a agenda.");
        }

        const dados = await resposta.json();

        console.table(dados);

        const agora = new Date();

        const eventos = dados
            .filter(evento => {

                if (!evento.DATA) {
                    return false;
                }

                const dataEvento = criarData(
                    evento.DATA,
                    evento.HORA || "23:59"
                );

                return dataEvento >= agora;

            })
            .sort((eventoA, eventoB) => {

                const dataA = criarData(
                    eventoA.DATA,
                    eventoA.HORA
                );

                const dataB = criarData(
                    eventoB.DATA,
                    eventoB.HORA
                );

                return dataA - dataB;

            });

        if (eventos.length === 0) {

            const mensagem = criarMensagemSemEventos();

            if (agendaHome) {
                agendaHome.innerHTML = mensagem;
            }

            if (agendaCompleta) {
                agendaCompleta.innerHTML = mensagem;
            }

            return;

        }

        if (agendaHome) {

            const proximosEventos = eventos.slice(0, 4);

            agendaHome.innerHTML = proximosEventos
                .map(criarCardHome)
                .join("");

        }

        if (agendaCompleta) {

            agendaCompleta.innerHTML = eventos
                .map(criarEventoModal)
                .join("");

        }

    } catch (erro) {

        console.error("Erro ao carregar a agenda:", erro);

        const mensagemErro = `
            <div class="agenda-vazia">
                <i class="bi bi-exclamation-circle"></i>

                <h3>Não foi possível carregar a agenda</h3>

                <p>
                    Tente novamente em alguns instantes.
                </p>
            </div>
        `;

        if (agendaHome) {
            agendaHome.innerHTML = mensagemErro;
        }

        if (agendaCompleta) {
            agendaCompleta.innerHTML = mensagemErro;
        }

    }

}

carregarAgenda();