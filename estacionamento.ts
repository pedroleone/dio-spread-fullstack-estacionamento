
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
    readonly entrada: Date;
    readonly cor: corVeiculo;
    readonly mensalista?: boolean;
    saida?: Date | string;
    valorPago?: number ;
    

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
}

let listaVeiculos: Array<Veiculo> = [];

const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

document.querySelector("#btn-cadastrar").addEventListener("click", function (e) {
    e.preventDefault();
    const nome = $("#modelo").value;
    const placa = $("#placa").value;
    const tipo = $("input[name='cartype']:checked").value;
    const entrada = new Date;
    const corOption = document.querySelector("#cor") as HTMLSelectElement;
    const cor = corOption.value;
    const mensalista = $("#mensalista").checked;
    const veiculo = new Veiculo(nome, placa, tipo, entrada, cor, mensalista);
    
    listaVeiculos.push(veiculo);
    renderizaListaVeiculos(listaVeiculos);
});



function renderizaListaVeiculos (listaVeiculos: Veiculo[]) {
    let listaVeiculosHTML: string = "";
    listaVeiculos.forEach((veiculo) => listaVeiculosHTML += veiculo.renderizaHtml());
    const container = document.querySelector(".park-container")
    container.innerHTML= listaVeiculosHTML;
}