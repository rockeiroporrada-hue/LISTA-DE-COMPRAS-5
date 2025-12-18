// ===== ESTADO =====
let itens = [];
let orcamento = 0;

// ===== INICIAR =====
document.addEventListener("DOMContentLoaded", () => {
  carregar();
});

// ===== CARREGAR =====
function carregar() {
  itens = JSON.parse(localStorage.getItem("itens")) || [];
  orcamento = Number(localStorage.getItem("orcamento")) || 0;
  atualizar();
}

// ===== SALVAR ORÇAMENTO =====
function salvarOrcamento() {
  const campo = document.getElementById("orcamento");
  orcamento = Number(campo.value) || 0;
  localStorage.setItem("orcamento", orcamento);
  atualizar();
}

// ===== ADICIONAR ITEM =====
function adicionarItem() {
  const produto = document.getElementById("produto").value.trim();
  const qtd = Number(document.getElementById("qtd").value);
  const valorCampo = document.getElementById("valor").value;
  const categoria = document.getElementById("categoria").value;

  if (!produto || !qtd) {
    alert("Informe produto e quantidade");
    return;
  }

  itens.push({
    produto,
    qtd,
    valor: valorCampo === "" ? null : Number(valorCampo),
    categoria,
    comprado: false
  });

  salvarItens();

  document.getElementById("produto").value = "";
  document.getElementById("qtd").value = "";
  document.getElementById("valor").value = "";
}

// ===== DEFINIR VALOR DEPOIS =====
function definirValor(index, input) {
  const v = Number(input.value);
  if (isNaN(v)) return;

  itens[index].valor = v;
  salvarItens();
}

// ===== MARCAR =====
function marcar(index) {
  itens[index].comprado = !itens[index].comprado;
  salvarItens();
}

// ===== EXCLUIR =====
function excluir(index) {
  itens.splice(index, 1);
  salvarItens();
}

// ===== SALVAR =====
function salvarItens() {
  localStorage.setItem("itens", JSON.stringify(itens));
  atualizar();
}

// ===== ATUALIZAR TELA =====
function atualizar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  let total = 0;

  itens.forEach((i, idx) => {
    const subtotal = i.valor !== null ? i.qtd * i.valor : 0;
    if (i.valor !== null) total += subtotal;

    const li = document.createElement("li");
    if (i.comprado) li.classList.add("comprado");

    const valorHTML = i.valor === null
      ? `<input type="number" step="0.01" placeholder="Informar valor" onchange="definirValor(${idx}, this)">`
      : `${i.qtd} x R$ ${i.valor.toFixed(2)} = R$ ${subtotal.toFixed(2)}`;

    li.innerHTML = `
      <span>
        <input type="checkbox" ${i.comprado ? "checked" : ""} onchange="marcar(${idx})">
        [${i.categoria}] ${i.produto} - ${valorHTML}
      </span>
      <span class="excluir" onclick="excluir(${idx})">❌</span>
    `;

    lista.appendChild(li);
  });

  document.getElementById("total").innerText = total.toFixed(2);
  document.getElementById("totalFooter").innerText = total.toFixed(2);
  document.getElementById("saldo").innerText = (orcamento - total).toFixed(2);
  document.getElementById("orcamento").value = orcamento || "";
}
