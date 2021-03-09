let $ = (ele) => {
  return document.querySelector(ele);
};

const getSession = () => {
  axios.get("http://localhost:4000/session").then((res) => {
    let userId = res.data.ID;
    if (userId) {
      axios.get("http://localhost:4000/User/" + userId).then((res) => {
        $("#userName").innerText = res.data.NOM_PRENOM;
        if (res.data.TYPE == "ADMIN") {
          $(
            "#stockageNav"
          ).innerHTML += `                            <a class="collapse-item" href="../stockage/forum.html">
              Ajouter medicaments
            </a>`;
        }
      });
    } else {
      window.location = "./login.html";
    }
  });
};

const tableheader = `<thead>
                        <tr>
                          <th>ID de commande</th>
                          <th>Nom d'employee</th>
                          <th>date de commande</th>
                          <th>Prix Totale</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead><tbody>`;

const tablevide = `<tbody><tr>
                          <td>...</td>
                          <td>...</td>
                          <td>...</td>
                          <td>...</td>
                          <td>...</td>
                          <td>...</td>
                        </tr></tbody>`;

function emptyTable() {
  $("#medTable").innerHTML = tableheader;
  $("#medTable").innerHTML += tablevide;
}

let round = (num) => {
  return Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
};

function Supprimer(id) {
  axios.delete("http://localhost:4000/Commande/delete/" + id);
  window.location.reload();
}

function fillMedTable() {
  $("#medTable").innerHTML = tableheader;

  axios.get("http://localhost:4000/Commande").then((res) => {
    res.data.forEach((ele) => {
      $("#medTable").innerHTML += `<tr>
                                  <td>${ele.ID_COMMANDE}</td>
                                  <td>${ele.NOM_PRENOM}</td>
                                  <td>${ele.DATE_COMMANDE.substring(0, 10)}</td>
                                  <td>${round(ele.PrixTotal)}</td>
                                  <td style="text-align: center">
                            <button
                                onclick="fillMedTable2(${ele.ID_COMMANDE})"
                              type="button"
                              class="btn btn-outline-primary btn-sm"
                              data-toggle="modal"
                              data-target=".bd-example-modal-lg"
                            >
                              <i class="fas fa-clipboard-list"></i>
                            </button>
                          </td>
                          <td style="text-align: center">
                            <button
                            onclick="Supprimer(${ele.ID_COMMANDE})"
                              type="button"
                              class="btn btn-outline-danger btn-sm"
                            >
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </td>
                                </tr>`;
      $("#medTable").innerHTML += `</tbody>`;
    });
  });
}

const tableheader2 = `<thead>
                        <tr>
                        <th>Code CIS</th>
                          <th>Denomination</th>
                          <th>Prix</th>
                          <th>Quantity</th>
                          <th>Prix Totale</th>
                        </tr>
                      </thead><tbody>`;

const tablevide2 = `<tbody><tr>
                          <td>...</td>
                          <td>...</td>
                          <td>...</td>
                          <td>...</td>
                          <td>...</td>
                        </tr></tbody>`;

function fillMedTable2(id) {
  $("#medTable2").innerHTML = tableheader2;

  axios.get("http://localhost:4000/commande/Medicaments/" + id).then((res) => {
    res.data.forEach((ele) => {
      $("#medTable2").innerHTML += `<tr>
                                  <td>${ele.ID}</td>
                                  <td>${ele.DENOMINATION}</td>
                                  <td>${round(ele.PRIX)}</td>
                                  <td>${ele.QUANTITY}</td>
                                  <td>${round(ele.PRIX) * ele.QUANTITY}</td>
                                </tr>`;
      $("#medTable2").innerHTML += `</tbody>`;
    });
  });
}

window.onload = () => {
  getSession();
  fillMedTable();
};
