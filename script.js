// Aguarda o HTML carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // 1. DADOS DOS SERVIÇOS
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
        { id: 12, descricao: "Pintura resistente à chama no pé de poste", fator: 0.0690, base: 1, unidade: "Por Poste" },
        { id: 13, descricao: "Manobra de Dispositivo CSC", fator: 0.0706, base: 1, unidade: "Por Unidade" },
        { id: 14, descricao: "Manobra Dispositivo COD", fator: 0.0924, base: 1, unidade: "Por Unidade" }
    ];

    // 2. PEGANDO OS ELEMENTOS DO HTML
    const selectServico = document.getElementById('servico');
    const inputQuantidade = document.getElementById('quantidade');
    const labelQuantidade = document.getElementById('label-quantidade');
    const btnCalcular = document.getElementById('btn-calcular');
    const btnLimpar = document.getElementById('btn-limpar');
    const listaCalculos = document.getElementById('lista-calculos');
    const valorTotalSpan = document.getElementById('valor-total');
    const btnSalvarCalculo = document.getElementById('btn-salvar-calculo');
    
    // Elementos do Histórico
    const btnHistorico = document.getElementById('btn-historico');
    const modalHistorico = document.getElementById('modal-historico');
    const closeButton = document.querySelector('.close-button');
    const listaHistorico = document.getElementById('lista-historico');
    const totalGeralHistoricoSpan = document.getElementById('total-geral-historico');
    const btnPeriodoAnterior = document.getElementById('btn-periodo-anterior');
    const btnPeriodoSeguinte = document.getElementById('btn-periodo-seguinte');
    const periodoAtualLabel = document.getElementById('periodo-atual-label');
    const btnExportar = document.getElementById('btn-exportar');
    const btnImportar = document.getElementById('btn-importar');
    const arquivoImportarInput = document.getElementById('arquivo-importar');
    
    let calculoAtual = [];
    let valorTotal = 0;
    let offsetPeriodo = 0;

    // 3. FUNÇÕES DA CALCULADORA PRINCIPAL
    // ... (As funções adicionarCalculo, atualizarListaCalculoAtual, etc., continuam as mesmas da versão anterior)
    function popularServicos() {
        servicos.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.id;
            option.textContent = `${servico.id.toString().padStart(2, '0')} - ${servico.descricao}`;
            selectServico.appendChild(option);
        });
    }

    function atualizarLabelUnidade() {
        const servicoId = parseInt(selectServico.value);
        const servicoSelecionado = servicos.find(s => s.id === servicoId);
        if (servicoSelecionado) {
            labelQuantidade.textContent = `Quantidade (${servicoSelecionado.unidade}):`;
        }
    }

    function adicionarCalculo() {
        const servicoId = parseInt(selectServico.value);
        const quantidade = parseFloat(inputQuantidade.value);
        if (isNaN(quantidade) || quantidade <= 0) {
            alert("Por favor, insira uma quantidade válida.");
            return;
        }
        const servico = servicos.find(s => s.id === servicoId);
        if (!servico) return;
        const resultadoUS = (quantidade / servico.base) * servico.fator;
        const itemCalculado = {
            id: Date.now(),
            descricao: servico.descricao,
            quantidade: quantidade,
            unidade: servico.unidade.split(' ')[0],
            valor: resultadoUS
        };
        calculoAtual.push(itemCalculado);
        atualizarListaCalculoAtual();
        inputQuantidade.value = '';
        inputQuantidade.focus();
    }
    
    function atualizarListaCalculoAtual() {
        listaCalculos.innerHTML = '';
        valorTotal = 0;
        calculoAtual.forEach(item => {
            valorTotal += item.valor;
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.descricao} (${item.quantidade} ${item.unidade})</span>
                <div class="item-info">
                    <strong>+ ${item.valor.toFixed(5)} US</strong>
                    <button class="btn-excluir-item" data-id="${item.id}">&times;</button>
                </div>
            `;
            listaCalculos.appendChild(li);
        });
        valorTotalSpan.textContent = `${valorTotal.toFixed(5)} US`;
        adicionarListenersExcluirItem();
    }

    function adicionarListenersExcluirItem() {
        document.querySelectorAll('.btn-excluir-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                calculoAtual = calculoAtual.filter(item => item.id !== itemId);
                atualizarListaCalculoAtual();
            });
        });
    }

    function limparTudo() {
        calculoAtual = [];
        atualizarListaCalculoAtual();
    }

    // 4. FUNÇÕES DO HISTÓRICO, PERÍODOS E BACKUP

    function salvarCalculo() {
        if (calculoAtual.length === 0) {
            alert("Não há nenhum item no cálculo atual para salvar.");
            return;
        }
        let dataInput = prompt("Digite a data para este cálculo (DD/MM/AAAA):", new Date().toLocaleDateString('pt-BR'));
        if (dataInput === null || dataInput.trim() === '') {
            alert("Salvamento cancelado.");
            return;
        }
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataInput.trim())) {
            alert("Formato de data inválido. Use DD/MM/AAAA.");
            return;
        }
        const historico = JSON.parse(localStorage.getItem('historicoProducao')) || [];
        const novaProducao = {
            id: Date.now(),
            data: dataInput.trim(),
            itens: calculoAtual,
            total: valorTotal
        };
        historico.push(novaProducao);
        localStorage.setItem('historicoProducao', JSON.stringify(historico));
        alert(`Produção de ${valorTotal.toFixed(5)} US salva com sucesso para a data ${dataInput}!`);
        limparTudo();
    }

    function getPeriodo(offset = 0) {
        // ... (código sem alterações)
        let data = new Date();
        data.setMonth(data.getMonth() + offset);
        let anoFim = data.getFullYear();
        let mesFim = data.getMonth();
        if (data.getDate() === 1) {
            mesFim -= 1;
            if (mesFim < 0) { mesFim = 11; anoFim -= 1; }
        }
        let dataFim = new Date(anoFim, mesFim + 1, 1);
        let dataInicio = new Date(anoFim, mesFim, 2);
        if (data.getDate() === 1) {
             dataInicio.setMonth(dataInicio.getMonth() -1);
        }
        return { inicio: dataInicio, fim: dataFim };
    }
    
    function formatarData(dataStr) {
        const [dia, mes, ano] = dataStr.split('/');
        return new Date(`${ano}-${mes}-${dia}T12:00:00`);
    }

    function carregarHistorico() {
        // ... (código sem alterações)
        const periodo = getPeriodo(offsetPeriodo);
        const historico = JSON.parse(localStorage.getItem('historicoProducao')) || [];
        const historicoFiltrado = historico.filter(p => {
            try {
                const dataLancamento = formatarData(p.data);
                return dataLancamento >= periodo.inicio && dataLancamento <= periodo.fim;
            } catch (e) { return false; }
        });
        periodoAtualLabel.textContent = `${periodo.inicio.toLocaleDateString('pt-BR')} - ${periodo.fim.toLocaleDateString('pt-BR')}`;
        btnPeriodoSeguinte.disabled = offsetPeriodo >= 0;
        listaHistorico.innerHTML = '';
        let totalPeriodo = 0;
        if (historicoFiltrado.length === 0) {
            listaHistorico.innerHTML = '<p>Nenhum registro encontrado para este período.</p>';
        }
        historicoFiltrado.sort((a, b) => formatarData(b.data) - formatarData(a.data));
        historicoFiltrado.forEach(producao => {
            totalPeriodo += producao.total;
            const producaoDiv = document.createElement('div');
            producaoDiv.classList.add('producao-dia');
            let itensHtml = producao.itens.map(item => `<li class="item-detalhe"><span>${item.descricao}</span> <strong>${item.valor.toFixed(5)} US</strong></li>`).join('');
            producaoDiv.innerHTML = `
                <div class="producao-header clicavel">
                    <strong>Data: ${producao.data} | Total: ${producao.total.toFixed(5)} US</strong>
                    <button class="btn-excluir-producao" data-id="${producao.id}">&times;</button>
                </div>
                <ul class="detalhes-producao">${itensHtml}</ul>
            `;
            listaHistorico.appendChild(producaoDiv);
        });
        totalGeralHistoricoSpan.textContent = `${totalPeriodo.toFixed(5)} US`;
        adicionarListenersExcluirProducao();
        adicionarListenersDetalhes();
    }

    function adicionarListenersDetalhes() {
        // ... (código sem alterações)
        document.querySelectorAll('.producao-header.clicavel').forEach(header => {
            header.addEventListener('click', function(event) {
                if (event.target.classList.contains('btn-excluir-producao')) return;
                const detalhes = this.nextElementSibling;
                detalhes.style.display = detalhes.style.display === 'block' ? 'none' : 'block';
            });
        });
    }

    function adicionarListenersExcluirProducao() {
        // ... (código sem alterações)
        document.querySelectorAll('.btn-excluir-producao').forEach(button => {
            button.addEventListener('click', function() {
                if (confirm("Tem certeza que deseja excluir este registro?")) {
                    const producaoId = parseInt(this.getAttribute('data-id'));
                    let historico = JSON.parse(localStorage.getItem('historicoProducao')) || [];
                    historico = historico.filter(p => p.id !== producaoId);
                    localStorage.setItem('historicoProducao', JSON.stringify(historico));
                    carregarHistorico();
                }
            });
        });
    }

    // NOVAS FUNÇÕES DE EXPORTAR E IMPORTAR
    function exportarHistorico() {
        const historico = localStorage.getItem('historicoProducao');
        if (!historico || historico === '[]') {
            alert("Não há dados no histórico para exportar.");
            return;
        }
        const blob = new Blob([historico], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const hoje = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        a.download = `backup_calculadora_producao_${hoje}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importarHistorico() {
        const arquivo = arquivoImportarInput.files[0];
        if (!arquivo) {
            alert("Nenhum arquivo selecionado.");
            return;
        }
        if (!confirm("Atenção! Isso irá substituir TODOS os dados do seu histórico atual. Deseja continuar?")) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const novoHistorico = JSON.parse(event.target.result);
                // Validação simples para ver se o arquivo parece correto
                if (Array.isArray(novoHistorico)) {
                    localStorage.setItem('historicoProducao', JSON.stringify(novoHistorico));
                    alert("Histórico importado com sucesso!");
                    carregarHistorico(); // Atualiza a visualização
                } else {
                    throw new Error("O arquivo não contém dados válidos.");
                }
            } catch (e) {
                alert("Erro ao ler o arquivo. Verifique se o arquivo de backup é válido.");
            }
        };
        reader.readAsText(arquivo);
    }

    // 5. EVENT LISTENERS
    
    // Calculadora Principal
    selectServico.addEventListener('change', atualizarLabelUnidade);
    btnCalcular.addEventListener('click', adicionarCalculo);
    btnLimpar.addEventListener('click', limparTudo);
    btnSalvarCalculo.addEventListener('click', salvarCalculo);

    // Modal de Histórico
    btnHistorico.addEventListener('click', () => {
        offsetPeriodo = 0;
        carregarHistorico();
        modalHistorico.style.display = 'block';
    });
    closeButton.addEventListener('click', () => { modalHistorico.style.display = 'none'; });
    window.addEventListener('click', (event) => {
        if (event.target == modalHistorico) { modalHistorico.style.display = 'none'; }
    });

    // Navegação de Períodos
    btnPeriodoAnterior.addEventListener('click', () => { offsetPeriodo--; carregarHistorico(); });
    btnPeriodoSeguinte.addEventListener('click', () => { if (offsetPeriodo < 0) { offsetPeriodo++; carregarHistorico(); } });
    
    // Backup
    btnExportar.addEventListener('click', exportarHistorico);
    btnImportar.addEventListener('click', () => arquivoImportarInput.click()); // Abre a janela de seleção de arquivo
    arquivoImportarInput.addEventListener('change', importarHistorico);

    // 6. INICIALIZAÇÃO
    popularServicos();
    atualizarLabelUnidade();
});