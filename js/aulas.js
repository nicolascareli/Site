/* ==================================================
   AULAS.JS — NICOLAS CARELI
================================================== */

document.addEventListener("DOMContentLoaded", function() {

    /* ==================================================
       ANO AUTOMÁTICO DO RODAPÉ
    ================================================== */

    const campoAno = document.getElementById("anoAtual");

    if (campoAno) {
        campoAno.textContent = new Date().getFullYear();
    }


    /* ==================================================
       ELEMENTOS DO FORMULÁRIO
    ================================================== */

    const formularioAulas =
        document.getElementById("formularioAulas");

    const retornoFormulario =
        document.getElementById("retornoFormularioAulas");

    if (!formularioAulas || !retornoFormulario) {
        return;
    }

    const botaoFormulario =
        formularioAulas.querySelector(".btn-enviar-formulario");

    const campoWhatsapp =
        document.getElementById("whatsappAulas");

    const URL_APPS_SCRIPT =
        "https://script.google.com/macros/s/AKfycbwPLIC--y-O0FTrLUfRaIMeXW4ze71voFN7AKFhRJRp62idNpKiKuNjgSf_MFBZ8ZqoKQ/exec";


    /* ==================================================
       MÁSCARA DO WHATSAPP
    ================================================== */

    if (campoWhatsapp) {
        campoWhatsapp.addEventListener("input", function() {

            let numero = campoWhatsapp.value.replace(/\D/g, "");

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

            campoWhatsapp.value = numero;

        });
    }


    /* ==================================================
       FUNÇÕES DE RETORNO
    ================================================== */

    function mostrarMensagem(tipo, mensagem) {

        retornoFormulario.className =
            "formulario-retorno " + tipo;

        retornoFormulario.textContent = mensagem;

        retornoFormulario.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }

    function restaurarBotao() {

        if (!botaoFormulario) {
            return;
        }

        botaoFormulario.disabled = false;

        botaoFormulario.innerHTML = `
            Receber informações
            <i class="bi bi-arrow-right"></i>
        `;

    }

    function mostrarCarregamento() {

        if (!botaoFormulario) {
            return;
        }

        botaoFormulario.disabled = true;

        botaoFormulario.innerHTML = `
            Enviando...
            <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
            ></span>
        `;

    }


    /* ==================================================
       ENVIO DO FORMULÁRIO
    ================================================== */

    formularioAulas.addEventListener(
        "submit",
        async function(evento) {

            evento.preventDefault();

            retornoFormulario.className =
                "formulario-retorno";

            retornoFormulario.textContent = "";

            if (!formularioAulas.checkValidity()) {

                formularioAulas.reportValidity();

                mostrarMensagem(
                    "erro",
                    "Preencha corretamente os campos obrigatórios."
                );

                return;
            }

            mostrarCarregamento();

            const dadosFormulario =
                new FormData(formularioAulas);

            if (!dadosFormulario.has("aceiteMarketing")) {
                dadosFormulario.append(
                    "aceiteMarketing",
                    "NÃO"
                );
            }

            try {

                await fetch(URL_APPS_SCRIPT, {
                    method: "POST",
                    body: dadosFormulario,
                    mode: "no-cors"
                });

                mostrarMensagem(
                    "sucesso",
                    "Recebi suas informações! Entrarei em contato em breve."
                );

                formularioAulas.reset();

            } catch (erro) {

                console.error(
                    "Erro ao enviar o formulário:",
                    erro
                );

                mostrarMensagem(
                    "erro",
                    "Não foi possível enviar agora. Tente novamente ou fale comigo pelo WhatsApp."
                );

            } finally {

                restaurarBotao();

            }

        }
    );

});