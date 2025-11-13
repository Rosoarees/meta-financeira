// script.js

// ... (código anterior do script.js) ...

// Função para obter variáveis CSS (já existe, apenas para referência)
function varColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
}

// Adiciona interatividade aos radio buttons e também ao focar/pressionar Enter
document.querySelectorAll('.radio-option').forEach(option => {
    option.addEventListener('click', function() {
        selectRadioOption(this);
    });

    // Adiciona suporte a teclado para acessibilidade (Enter)
    option.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault(); // Impede o envio do formulário, se houver
            selectRadioOption(this);
        }
    });
});

function selectRadioOption(selectedOption) {
    document.querySelectorAll('.radio-option').forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('input').checked = false; // Desmarca outros radios
    });
    selectedOption.classList.add('selected');
    selectedOption.querySelector('input').checked = true; // Marca o radio selecionado
}

// Marca o primeiro radio como selecionado por padrão ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const firstRadioOption = document.querySelector('.radio-option');
    if (firstRadioOption) {
        selectRadioOption(firstRadioOption);
    }

    // Adiciona evento de clique para o botão de rolar
    document.querySelectorAll('.scroll-to-calc').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Função para formatar números nos inputs
    const formatNumberInput = (inputElement) => {
        inputElement.addEventListener('input', (event) => {
            let value = event.target.value;
            // Remove tudo que não for dígito
            value = value.replace(/\D/g, '');
            
            if (value.length > 0) {
                // Converte para número e formata para moeda brasileira
                value = (parseInt(value, 10) / 100).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } else {
                value = '';
            }
            event.target.value = value;
        });
    };

    formatNumberInput(document.getElementById("meta_financeira"));
    formatNumberInput(document.getElementById("economia_mensal"));
});


function calcular() {
    // Remove a formatação para fazer o cálculo
    let meta_financeira_str = document.getElementById("meta_financeira").value;
    let economia_mensal_str = document.getElementById("economia_mensal").value;

    meta_financeira_str = meta_financeira_str.replace(/\./g, '').replace(',', '.');
    economia_mensal_str = economia_mensal_str.replace(/\./g, '').replace(',', '.');

    const meta_financeira = parseFloat(meta_financeira_str);
    const economia_mensal = parseFloat(economia_mensal_str);
    const finalidade = document.querySelector('input[name="finalidade"]:checked').value;

    // ----- NOVA VARIÁVEL: TAXA DE JUROS -----
    const taxa_juros_mensal = 0.03; // 3% ao mês (0.03)

    // Validação aprimorada
    if (isNaN(meta_financeira) || isNaN(economia_mensal) || meta_financeira <= 0 || economia_mensal <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Ops...',
            text: 'Por favor, preencha valores válidos e positivos para sua meta e economia mensal!',
            confirmButtonColor: varColor('primary-color')
        });
        return;
    }

    // ----- LÓGICA DE CÁLCULO COM JUROS COMPOSTOS -----
    let capital_acumulado = 0;
    let meses_totais = 0;
    const MAX_MESES = 1200; // Limite de 100 anos para evitar loops infinitos caso a meta seja inatingível

    while (capital_acumulado < meta_financeira && meses_totais < MAX_MESES) {
        capital_acumulado += economia_mensal; // Adiciona a economia do mês
        capital_acumulado *= (1 + taxa_juros_mensal); // Aplica os juros sobre o novo total
        meses_totais++;
    }

    let anos_necessarios = Math.floor(meses_totais / 12);
    let meses_adicionais = meses_totais % 12;

    // Mensagens de validação e aviso
    if (meses_totais >= MAX_MESES) {
        Swal.fire({
            icon: 'warning',
            title: 'Meta Muito Ambiociosa!',
            text: 'Com seus dados atuais e juros de 3% ao mês, levaria mais de 100 anos para atingir esta meta. Considere ajustar sua economia mensal ou a meta!',
            confirmButtonColor: varColor('primary-color')
        });
        document.getElementById("result-content").innerHTML = `
            <p>Sua meta financeira é de <span class="highlight">R$ ${meta_financeira.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>.</p>
            <p>Com uma economia mensal de <span class="highlight">R$ ${economia_mensal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span> e juros de <span class="highlight">3% ao mês</span>, sua meta parece muito distante.</p>
            <p>Considere aumentar sua economia mensal ou reduzir o valor da meta para alcançá-la em um tempo razoável.</p>
            <div class="motivation">
                Grandes objetivos exigem grandes esforços. Revise seu plano para ter sucesso!
            </div>
        `;
         document.getElementById("resultado").classList.add("show");
         document.getElementById("resultado").scrollIntoView({ behavior: 'smooth', block: 'center' });
         return;
    }

    if (economia_mensal >= meta_financeira) {
        Swal.fire({
            icon: 'info',
            title: 'Parabéns!',
            text: 'Você já alcança sua meta com sua economia mensal!',
            confirmButtonColor: varColor('primary-color')
        });
        document.getElementById("result-content").innerHTML = `
            <p>Sua meta financeira é de <span class="highlight">R$ ${meta_financeira.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>.</p>
            <p>Com sua economia mensal de <span class="highlight">R$ ${economia_mensal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>, você já pode realizar seu objetivo!</p>
            <div class="motivation">
                Que tal definir uma meta ainda maior? O céu é o limite para seus sonhos!
            </div>
        `;
        document.getElementById("resultado").classList.add('show');
        document.getElementById("resultado").scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    // ----- FIM DA LÓGICA COM JUROS COMPOSTOS -----


    // Mensagens motivacionais baseadas na finalidade
    const mensagens = {
        "Aposentadoria": "Sua jornada rumo a uma aposentadoria tranquila está no caminho certo! Continue firme!",
        "Compra do Carro": "Em pouco tempo, você estará com as chaves do seu novo carro em mãos! Mantenha o foco!",
        "Compra da Casa": "Cada real economizado é um tijolo na construção da sua casa dos sonhos! Persista!",
        "Liberdade Financeira": "A liberdade financeira não é um sonho distante. Com disciplina, ela é uma realidade ao seu alcance!",
        "Viagem": "O passaporte para sua aventura dos sonhos está sendo carimbado a cada economia! Prepare-se!",
        "Estudo": "Invista no seu conhecimento! Cada economia te aproxima do seu futuro acadêmico brilhante!",
        "Empreendimento": "Seu próximo grande projeto está tomando forma! Acredite no seu potencial empreendedor!"
    };

    const resultadoHTML = `
        <p>Sua meta financeira é de <span class="highlight">R$ ${meta_financeira.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>.</p>
        <p>Com uma economia mensal de <span class="highlight">R$ ${economia_mensal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
           e um investimento que rende <span class="highlight">${(taxa_juros_mensal * 100).toFixed(0)}% ao mês</span>, você vai precisar de:</p>
        <p class="final-time"><span class="highlight">${anos_necessarios} anos</span> e <span class="highlight">${meses_adicionais} meses</span></p>
        <p>Você vai alcançar sua meta de <span class="highlight">${finalidade}</span> mantendo essa disciplina financeira mensalmente.</p>
        <div class="motivation">
            ${mensagens[finalidade]}
        </div>
        <p style="margin-top: 15px;">Continue economizando com sabedoria! O futuro que você deseja está mais próximo do que imagina.</p>
    `;

    document.getElementById("result-content").innerHTML = resultadoHTML;
    document.getElementById("resultado").classList.add("show");
    
    document.getElementById("resultado").scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function novaSimulacao() {
    document.getElementById("meta_financeira").value = "";
    document.getElementById("economia_mensal").value = "";
    document.getElementById("resultado").classList.remove("show");
    document.getElementById("result-content").innerHTML = "";
    
    document.getElementById("meta_financeira").focus();
}