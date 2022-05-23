const baseUrl = "https://el-geladon-backend-by-ip.herokuapp.com/paletas";

const findAllPalletas = async () => {
  const response = await fetch(`${baseUrl}/find-paletas`);

  const paletas = await response.json();

  paletas.forEach((paleta) => {
    let isEdit = true;
    document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",
      `<div class="PaletaListaItem" id="PaletaListaItem_'${paleta._id}'"><div>
            <div>
                <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
                <div class="PaletaListaItem__preco">R$ ${paleta.preco}</div>
                <div class="PaletaListaItem__descricao">${
                  paleta.descricao
                }</div>

              <div class="PaletaListaItem__acoes Acoes">
              <div class="Acoes__editar "id=${
                paleta._id
              } onclick="abrirModal(${isEdit})">Editar</div>
                <button class="Acoes__deletar" onclick="deletePaleta('${
                  paleta._id
                }')">deletar</button>
            </div>
              </div>
                <img class="PaletaListaItem__foto" src=${
                  paleta.foto
                } alt=${`Paleta de ${paleta.sabor}`} />
            </div>`
    );
  });
};

findAllPalletas();

let idToSearch = "";

const catchPaletaById = (event) => {
  idToSearch = event.target.value;
};

const findPaletaById = async () => {
  const id = idToSearch;
  if (id !== "") {
    const response = await fetch(`${baseUrl}/find-paleta/${id}`);
    const paleta = await response.json();

    const paletaEscolhidaDiv = document.getElementById("paletaEscolhida");

    paletaEscolhidaDiv.innerHTML = `<div class="PaletaCardItem" id="PaletaListaItem_'${
      paleta._id
    }'">
              <div>
                <div class="PaletaCardItem__sabor">${paleta.sabor}</div>
                <div class="PaletaCardItem__preco">R$ ${paleta.preco}</div>
                <div class="PaletaCardItem__descricao">${paleta.descricao}</div>

                <div class="PaletaListaItem__acoes Acoes">
                <button class="Acoes__editar btn" onclick="abrirModal('${
                  paleta._id
                }')">editar</button>
                <button class="Acoes__deletar" onclick="deletePaleta('${
                  paleta._id
                }')">deletar</button>
                </div>
              </div>
                <img class="PaletaCardItem__foto" src=${
                  paleta.foto
                } alt=${`Paleta de ${paleta.sabor}`} />
            </div>`;
  }
};

async function abrirModal(isEdit = false) {
  if (isEdit) {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar uma Paleta";
    document.querySelector("#submit-modal-button").innerText = "Atualizar";

    const id = event.target.id;

    const response = await fetch(`${baseUrl}/find-paleta/${id}`);
    const paleta = await response.json();

    document.querySelector("#id").value = paleta._id;
    document.querySelector("#sabor").value = paleta.sabor;
    document.querySelector("#preco").value = paleta.preco;
    document.querySelector("#descricao").value = paleta.descricao;
    document.querySelector("#foto").value = paleta.foto;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma Paleta";
    document.querySelector("#submit-modal-button").innerText = "Cadastrar";
  }

  document.querySelector(".modal-overlay").style.display = "flex";
}

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";
  document.querySelector("#sabor").value = "";
  document.querySelector("#preco").value = 0;
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

async function submitPaleta() {
  const id = document.getElementById("id").value;
  const sabor = document.querySelector("#sabor").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;

  const paleta = {
    id,
    sabor,
    preco,
    descricao,
    foto,
  };

  const modoEdicaoAtivado = !!id;

  const endpoint = baseUrl + (modoEdicaoAtivado ? `/update/${id}` : `/create`);

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const novaPaleta = await response.json();

  let isEdit = true;
  const html = `
    <div class="PaletaListaItem" id="PaletaListaItem_'${paleta._id}'">
        <div>
            <div class="PaletaListaItem__sabor">${novaPaleta.sabor}</div>
            <div class="PaletaListaItem__preco">R$ ${novaPaleta.preco}</div>
            <div class="PaletaListaItem__descricao">${
              novaPaleta.descricao
            }</div>
            <div class="PaletaListaItem__acoes Acoes">
            <div class="Acoes__editar "id=${
              paleta._id
            } onclick="abrirModal(${isEdit})">Editar</div>
                <button class="Acoes__deletar" onclick="deletePaleta('${
                  paleta._id
                }')">deletar</button>
            </div>
        </div>
            <img class="PaletaListaItem__foto" src=${
              novaPaleta.foto
            } alt=${`Paleta de ${novaPaleta.sabor}`} />
    </div>`;

  if (modoEdicaoAtivado) {
    document.querySelector(`#PaletaListaItem_${id}`).outerHTML = html;
  } else {
    document.getElementById("paletaList").insertAdjacentHTML("beforeend", html);
  }

  document.getElementById("id").value = "";

  fecharModal();
  document.location.reload(true);
}

const deletePaleta = async (id) => {
  const response = await fetch(`${baseUrl}/delete/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  const result = await response.json();
  alert(result.message);
  document.getElementById("paletaList").innerHTML = "";
  findAllPalletas();
};
