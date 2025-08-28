// Aguarda o HTML carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // 1. DADOS DOS SERVIÇOS (a sua tabela convertida para código)
    const servicos = [
        { id: 1,  descricao: "Limpeza de faixa", fator: 1.0000, base: 10000, unidade: "Metros Quadrados (m²)" },
        { id: 2,  descricao: "Aceiro", fator: 0.0006, base: 1, unidade: "Metro Quadrado (m²)" },
        { id: 3,  descricao: "Poda ou supressão de árvore isolada em RDR (até 5 por vão)", fator: 0.0500, base: 1, unidade: "Unidades de Árvores" },
        { id: 4,  descricao: "Poda de cerca viva ou vegetação similar", fator: 0.0040, base: 1, unidade: "Metro Linear" },
        { id: 5,  descricao: "Supressão de árvore com DAP > 1,0 m em RDR ou LD", fator: 0.2000, base: 1, unidade: "Unidades de Árvores" },
        { id: 6,  descricao: "Supressão de árvore isolada em LD (até 20 por vão)", fator: 0.0500, base: 1, unidade: "Unidades de Árvores" },
        { id: 7,  descricao: "Supressão de árvore em Área de Silvicultura Comercial", fator: 0.0060, base: 1, unidade: "Unidades de Árvores" },
        { id: 8,  descricao: "Supressão de bambuzal", fator: 0.0070, base: 1, unidade: "Metro Quadrado (m²)" },
        { id: 9,  descricao: "Corte de cipós e trepadeiras", fator: 0.0050, base: 1, unidade: "Por Estrutura" },
        { id: 10, descricao: "Limpeza geral de lotes e terrenos em áreas urbanas", fator: 0.0010, base: 1, unidade: "Metro Quadrado (m²)" },
        { id: 11, descricao: "Reabertura de faixa ou abertura de acesso", fator: 1.5000, base: 10000, unidade: "Metros Quadrados (m²)" },
        { id: 12, descricao: "Pintura resistente à chama no pé de poste", fator: 0.0690, base: 1, unidade: "Por Poste" }
    ];

    // 2. PEGANDO OS ELEMENTOS DO HTML
    const selectServico = document.getElementById('servico');
    const inputQuantidade = document.getElementById('quantidade');
    const labelQuantidade = document.getElementById('label-quantidade');
    const btnCalcular = document.getElementById('btn-calcular');
    const btnLimpar = document.getElementById('btn-limpar');
    const listaCalculos = document.getElementById('lista-calculos');
    const valorTotalSpan = document.getElementById('valor-total');
    
    let valorTotal = 0;

    // 3. FUNÇÕES DA CALCULADORA

    // Preenche o menu <select> com os serviços da lista
    function popularServicos() {
        servicos.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.id;
            option.textContent = `${servico.id.toString().padStart(2, '0')} - ${servico.descricao}`;
            selectServico.appendChild(option);
        });
    }

    // Atualiza o texto da label "Quantidade" para a unidade correta
    function atualizarLabelUnidade() {
        const servicoId = parseInt(selectServico.value);
        const servicoSelecionado = servicos.find(s => s.id === servicoId);
        if (servicoSelecionado) {
            labelQuantidade.textContent = `Quantidade (${servicoSelecionado.unidade}):`;
        }
    }

    // Função principal que calcula e adiciona o item na lista
    function adicionarCalculo() {
        const servicoId = parseInt(selectServico.value);
        const quantidade = parseFloat(inputQuantidade.value);

        // Validação
        if (isNaN(quantidade) || quantidade <= 0) {
            alert("Por favor, insira uma quantidade válida.");
            return;
        }

        const servico = servicos.find(s => s.id === servicoId);
        if (!servico) return;

        // A LÓGICA DO CÁLCULO
        const resultadoUS = (quantidade / servico.base) * servico.fator;

        // Adiciona o resultado à lista na tela
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${servico.descricao} (${quantidade} ${servico.unidade.split(' ')[0]})</span>
            <strong>+ ${resultadoUS.toFixed(5)} US</strong>
        `;
        listaCalculos.appendChild(li);

        // Soma ao total
        valorTotal += resultadoUS;
        valorTotalSpan.textContent = `${valorTotal.toFixed(5)} US`;

        // Limpa o campo de quantidade para o próximo cálculo
        inputQuantidade.value = '';
        inputQuantidade.focus();
    }
    
    // Limpa todos os cálculos e o total
    function limparTudo() {
        listaCalculos.innerHTML = '';
        valorTotal = 0;
        valorTotalSpan.textContent = '0.00000 US';
        inputQuantidade.value = '';
        selectServico.value = '1';
        atualizarLabelUnidade();
    }


    // 4. ADICIONANDO OS "OUVINTES DE EVENTOS"
    
    // Quando o usuário troca o serviço no menu
    selectServico.addEventListener('change', atualizarLabelUnidade);

    // Quando o usuário clica no botão de adicionar
    btnCalcular.addEventListener('click', adicionarCalculo);
    
    // Quando o usuário clica no botão de limpar
    btnLimpar.addEventListener('click', limparTudo);

    // 5. INICIALIZAÇÃO
    popularServicos();
    atualizarLabelUnidade();
});