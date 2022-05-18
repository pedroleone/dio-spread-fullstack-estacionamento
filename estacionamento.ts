
addEventToHeader();

function addEventToHeader() {
    document.getElementsByTagName("header")[0].addEventListener("click", function (e) {
        let element = e.target as HTMLElement;
        if (element.classList.contains('btn-menu')) {
            toggleOpenClass(element);
            let childSectionName = element.getAttribute("data-child-section");
            controlSectionDisplay(childSectionName);
        }
    });
}

function toggleOpenClass (element: Element) {
    if (element.classList.contains('open')) {
        element.classList.remove('open');
    } else {
        element.classList.add('open');
    }
}

function controlSectionDisplay(childSectionName: string) {
    let element = document.getElementsByClassName(childSectionName)[0] as HTMLElement;
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

type corVeiculo = "preto" | "branco" | "prata" | "azul" | "verde" | "vermelho";
type tipoVeiculo = "small-car" | "large-car" | "motorcycle";

class Veiculo {
    readonly nome: string;
    readonly placa: string;
    readonly tipo: tipoVeiculo;
    entrada: Date;
    readonly cor: corVeiculo;
    readonly mensalista?: boolean;
    saida?: Date | string;
    valorPago?: number;
    

    constructor(nome: string, placa: string, tipo: string, entrada: Date, cor: string, mensalista: boolean) {
        this.nome = nome;
        this.placa = placa;
        this.tipo = tipo as tipoVeiculo;
        this.entrada = entrada;
        this.cor = cor as corVeiculo;
    }

    renderizaHtml(): string {
        return `
        <div class="park-item">
            <div class="item-img">
                <img src="./assets/${this.tipo}.svg" alt="${this.tipo}" width="95" height="80">
            </div>
            <div class="item-ident">
                <div class="item-placa-cor">
                    <div class="item-placa">${this.placa}</div>
                    <div class="placa ${this.cor}"></div>
                </div>
                <div class="item-modelo">${this.nome}</div>
                <div class="item-datahora">${this.entrada.toLocaleDateString('pt-BR')} ${this.entrada.toLocaleTimeString('pt-BR') }</div>
            </div>
            <div class="item-botoes">
                <div class="botao"><img src="./assets/delete.svg" class="btn-deletar" data-placa="${this.placa}" width="45" height="45"></div>
                <div class="botao"><img src="./assets/checkout.svg" class="btn-checkout" data-placa="${this.placa}" width="45" height="45"></div>
            </div>
        </div>
        `;
    }
    
    valorAPagar(config: Configuracao): number {
        let configVeiculo: configuracoesVeiculo;
        if (this.tipo === "large-car") configVeiculo = config.carroGrande;
        if (this.tipo === "small-car") configVeiculo = config.carroPequeno;
        if (this.tipo === "motorcycle") configVeiculo = config.motocicleta;
        
        let diffDatesMin = Math.floor((new Date().getTime() - this.entrada.getTime()) /60000);
        let valorCalculado: number = 0;
        
        if (diffDatesMin < 60) return configVeiculo.primeiraHora;
        valorCalculado += configVeiculo.primeiraHora;
        diffDatesMin -= 60; // retira primeira hora
        if (diffDatesMin < 60) return valorCalculado + configVeiculo.segundaHora;
        valorCalculado += configVeiculo.segundaHora;
        diffDatesMin -= 60; // retira segunda hora
        valorCalculado += Math.ceil(diffDatesMin / 60) * configVeiculo.demaisHoras;
        return valorCalculado;

    }
}

const $ = (query: string): HTMLInputElement | null => document.querySelector(query);




type configuracoesVeiculo = {
    primeiraHora: number;
    segundaHora: number;
    demaisHoras: number;
    capacidade: number;
}

class Configuracao {
    carroPequeno: configuracoesVeiculo;
    carroGrande: configuracoesVeiculo;
    motocicleta: configuracoesVeiculo;

    constructor(carroPequeno: configuracoesVeiculo = {
            primeiraHora: 6,
            segundaHora: 4.5,
            demaisHoras: 4,
            capacidade: 50
        }, 
        carroGrande: configuracoesVeiculo = {
            primeiraHora: 12,
            segundaHora: 7,
            demaisHoras: 5,
            capacidade: 10
            },
        motocicleta: configuracoesVeiculo  = {
            primeiraHora: 4,
            segundaHora: 2.5,
            demaisHoras: 2.5,
            capacidade: 25
            }) {
        this.carroPequeno = carroPequeno;
        this.carroGrande = carroGrande;
        this.motocicleta = motocicleta;
    }

    renderizarControles() {
        $("#primeirahora-peq").value = this.carroPequeno.primeiraHora.toLocaleString('pt-BR');
        $("#segundahora-peq").value = this.carroPequeno.segundaHora.toLocaleString('pt-BR');
        $("#demaishoras-peq").value = this.carroPequeno.demaisHoras.toLocaleString('pt-BR');
        $("#capacidade-peq").value = this.carroPequeno.capacidade.toString();

        $("#primeirahora-gde").value = this.carroGrande.primeiraHora.toLocaleString('pt-BR');
        $("#segundahora-gde").value = this.carroGrande.segundaHora.toLocaleString('pt-BR');
        $("#demaishoras-gde").value = this.carroGrande.demaisHoras.toLocaleString('pt-BR');
        $("#capacidade-gde").value = this.carroGrande.capacidade.toString();

        $("#primeirahora-moto").value = this.motocicleta.primeiraHora.toLocaleString('pt-BR');
        $("#segundahora-moto").value = this.motocicleta.segundaHora.toLocaleString('pt-BR');
        $("#demaishoras-moto").value = this.motocicleta.demaisHoras.toLocaleString('pt-BR');
        $("#capacidade-moto").value = this.motocicleta.capacidade.toString();
    }
}

class Patio {

    configuracao: Configuracao;
    veiculosPatio: Array<Veiculo>;
    ocupacao: {
        carroPequeno: number,
        carroGrande: number,
        motocicleta: number
    }
    veiculosFaturados: Array<Veiculo>;

    constructor() {
        this.ocupacao = {
            carroPequeno: 0,
            carroGrande: 0,
            motocicleta: 0
        }

        if (localStorage.config) {
            const configData = JSON.parse(localStorage.config) as Configuracao;
            this.configuracao = new Configuracao(configData.carroPequeno, configData.carroGrande, configData.motocicleta);
        } else {
            this.configuracao = new Configuracao();
        }
        this.veiculosPatio = [];
        this.veiculosFaturados = [];

        if (localStorage.veiculosPatio) {
            const veiculosPatioGravados = JSON.parse(localStorage.veiculosPatio);
            veiculosPatioGravados.forEach((veiculo) => {
                this.veiculosPatio.push(new Veiculo(veiculo.nome, veiculo.placa, veiculo.tipo, new Date(veiculo.entrada), veiculo.cor, veiculo.mensalista));
            });
            this.renderizaPatio();
        } 

        this.configuracao.renderizarControles();
        this.calcularOcupacao();
        this.atualizaDados();

    }

    adicionaVeiculo(veiculo: Veiculo) {
        if (this.veiculosPatio.filter(veiculoExistente => veiculoExistente.placa == veiculo.placa).length > 0) {
            alert("Placa já cadastrada! Revise o cadastro e tente novamente");
            return;
        }
        this.veiculosPatio.push(veiculo);
        localStorage.setItem("veiculosPatio", JSON.stringify(this.veiculosPatio));
        this.calcularOcupacao();
        this.atualizaDados();
        this.renderizaPatio();
    }

    renderizaPatio() {
        let listaVeiculosHTML: string = "";
        this.veiculosPatio.forEach((veiculo) => listaVeiculosHTML += veiculo.renderizaHtml());
        const container = document.querySelector(".park-container")
        container.innerHTML= listaVeiculosHTML;        
    }

    calcularOcupacao() {
        this.ocupacao.carroPequeno = 0;
        this.ocupacao.carroGrande = 0;
        this.ocupacao.motocicleta = 0;
        this.veiculosPatio.forEach((veiculo) => {
            if (veiculo.tipo === 'small-car') this.ocupacao.carroPequeno++;
            if (veiculo.tipo === 'large-car') this.ocupacao.carroGrande++;
            if (veiculo.tipo === 'motorcycle') this.ocupacao.motocicleta++;
        })

    }

    calcularFaturamentoEstimado (): number {
        let valorFaturamentoEstimado: number = 0;
        this.veiculosPatio.forEach((veiculo) => valorFaturamentoEstimado += veiculo.valorAPagar(this.configuracao))
        return valorFaturamentoEstimado;
    }

    calcularFaturamentoRealizado (): number {
        let valorFaturamentoRealizado: number = 0;
        this.veiculosFaturados.forEach((veiculo) => valorFaturamentoRealizado += veiculo.valorPago)
        return valorFaturamentoRealizado;
    }    

    atualizaFaturamento() {
        console.log("Atualizando Faturamento...");
        $("#faturamento-estimado").value = this.calcularFaturamentoEstimado().toLocaleString();
        $("#faturamento-realizado").value = this.calcularFaturamentoRealizado().toLocaleString();
    }

    atualizarConfiguracao(configVeiculoPequeno: configuracoesVeiculo, configVeiculoGrande: configuracoesVeiculo, configVeiculoMoto: configuracoesVeiculo) {
        this.configuracao = new Configuracao(configVeiculoPequeno, configVeiculoGrande, configVeiculoMoto);
        localStorage.setItem("config", JSON.stringify(this.configuracao));
        this.atualizaDados();
    }

    atualizaDados() {
        $("#ocupacao-peq").value = this.ocupacao.carroPequeno.toString();
        $("#ocupacao-gde").value = this.ocupacao.carroGrande.toString();
        $("#ocupacao-moto").value = this.ocupacao.motocicleta.toString();

        $("#vagas-peq").value = (this.configuracao.carroPequeno.capacidade - this.ocupacao.carroPequeno).toString();
        $("#vagas-gde").value = (this.configuracao.carroGrande.capacidade - this.ocupacao.carroGrande).toString();
        $("#vagas-moto").value = (this.configuracao.motocicleta.capacidade - this.ocupacao.motocicleta).toString();

        this.atualizaFaturamento();
        $("#faturamento-realizado").value = "0";

    }

    removerVeiculo(placa: string) {
        console.log("Deletar veiculo");
        
        localStorage.setItem("veiculosPatio", JSON.stringify(this.veiculosPatio));
        this.renderizaPatio();
        this.atualizaFaturamento();
    }

    checkoutVeiculo(placa: string) {
        const veiculo = this.veiculosPatio.filter(veiculo => veiculo.placa === placa)[0]
        const valor = veiculo.valorAPagar(this.configuracao);
        if (confirm(`Deseja fazer a saída do veículo placa ${veiculo.placa} com valor total de ${valor.toString()}?`)) {
            veiculo.valorPago = valor;
            this.veiculosFaturados.push(veiculo);
            this.veiculosPatio = this.veiculosPatio.filter(veiculo => veiculo.placa !== placa);
        }
        this.renderizaPatio();
        this.atualizaFaturamento();

    }
}


const patio = new Patio();


document.querySelector("#btn-cadastrar").addEventListener("click", function (e) {
    e.preventDefault();
    const nome = $("#modelo").value;
    const placa = $("#placa").value.toUpperCase();
    const tipo = $("input[name='cartype']:checked").value;
    const entrada = new Date;
    const corOption = document.querySelector("#cor") as HTMLSelectElement;
    const cor = corOption.value;
    const mensalista = $("#mensalista").checked;
    const veiculo = new Veiculo(nome, placa, tipo, entrada, cor, mensalista);
    
    patio.adicionaVeiculo(veiculo);
    
});

document.querySelector("#btn-salvar-config").addEventListener("click", function(e) {
    e.preventDefault();
    const configVeiculoPequeno: configuracoesVeiculo = {
        primeiraHora: Number($("#primeirahora-peq").value.replace(',','.')),
        segundaHora: Number($("#segundahora-peq").value.replace(',','.')),
        demaisHoras: Number($("#demaishoras-peq").value.replace(',','.')),
        capacidade: Number($("#capacidade-peq").value)
    }

    const configVeiculoGrande: configuracoesVeiculo = {
        primeiraHora: Number($("#primeirahora-gde").value.replace(',','.')),
        segundaHora: Number($("#segundahora-gde").value.replace(',','.')),
        demaisHoras: Number($("#demaishoras-gde").value.replace(',','.')),
        capacidade: Number($("#capacidade-gde").value)
    }
    
    const configVeiculoMoto: configuracoesVeiculo = {
        primeiraHora: Number($("#primeirahora-moto").value.replace(',','.')),
        segundaHora: Number($("#segundahora-moto").value.replace(',','.')),
        demaisHoras: Number($("#demaishoras-moto").value.replace(',','.')),
        capacidade: Number($("#capacidade-moto").value)
    }    

    patio.atualizarConfiguracao(configVeiculoPequeno, configVeiculoGrande, configVeiculoMoto);

})

document.querySelector(".park-container").addEventListener("click", function(e){
    const element = e.target as HTMLElement;
    if (!element.classList.contains('btn-deletar')) return;
    const placa = element.getAttribute("data-placa");
    if (confirm(`Deseja excluir o veículo de placa ${placa}?`)) patio.removerVeiculo(placa);
});

document.querySelector(".park-container").addEventListener("click", function(e){
    const element = e.target as HTMLElement;
    if (!element.classList.contains('btn-checkout')) return;
    const placa = element.getAttribute("data-placa");
    patio.checkoutVeiculo(placa);
});


patio.atualizaFaturamento();
setInterval(patio.atualizaFaturamento, 60*1000);