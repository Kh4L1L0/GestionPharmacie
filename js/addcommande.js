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

let tableMed = [];

function verifierStock(id) {
  axios.get("http://localhost:4000/Stock").then((res) => {
    let valid = false;
    let color = "green";
    res.data.forEach((ele) => {
      if (
        ele.ID == parseInt($("#codeMed" + id).value) &&
        ele.QUANTITY >= parseInt($("#quantityMed" + id).value)
      ) {
        color =
          ele.QUANTITY - 5 > $("#quantityMed" + id).value ? "green" : "yellow";
        valid = true;
      }
    });
    $("#quantityMed" + id).style.color = valid ? color : "red";
    console.log(valid);
    return valid;
  });
}

function validate(id) {
  let valid = true;
  if ($("#codeMed" + id).value.length < 8) {
    valid = false;
    $("#codeMed" + id).style.borderColor = "red";
  } else {
    $("#codeMed" + id).style.borderColor = "green";
  }

  let quantity = parseInt($("#quantityMed" + id).value);
  if ($("#quantityMed" + id).value === "" || quantity <= 0) {
    valid = false;
    $("#quantityMed" + id).style.borderColor = "red";
  } else {
    $("#quantityMed" + id).style.borderColor = "green";
  }

  verifierStock(id);

  //   let v = verifierStock(id);
  //   console.log(v);
  //   if (!verifierStock(id)) {
  //     console.log("HERE");
  //     valid = false;
  //     $("#quantityMed" + id).style.borderColor = "red";
  //   }
  return valid;
}

function generateRow(id, last) {
  id = id + 1;
  let codevalue = last ? "" : tableMed[id - 1].ID;
  let Qvalue = last ? "" : tableMed[id - 1].QUANTITY;
  let html = `                <div class="form-group row">
                  <div class="col-sm-5">
                    <input
                    id="codeMed${id}"
                      type="text"
                      class="form-control"
                      id="inputEmail3"
                      placeholder="Medicament"
                      value="${codevalue}"
                      ${last ? "" : "disabled"}
                    />
                  </div>
                  <div class="col-sm-2">
                    <input
                    id="quantityMed${id}"
                      type="number"
                      class="form-control"
                      id="inputEmail3"
                      placeholder="Quantite"
                      value="${Qvalue}"
                      ${last ? "" : "disabled"}
                    />
                  </div>`;
  if (last) {
    html += `<button id="addMedbtn${id}" onclick="addMed()" type="button" class="btn btn-primary btn-s mr-2">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>`;
  } else {
    html += `<button id="addMedbtn${id}" onclick="delMed(${
      id - 1
    })" type="button" class="btn btn-warning btn-s mr-2">
                    <i class="fas fa-minus"></i>
                  </button>
                </div>`;
  }
  return html;
}

function changeTable() {
  $(
    "#addMedbtn" + tableMed.length + 1
  ).innerHTML = `<i class="fas fa-minus"></i>`;
}

function generateList() {
  $("#med_contente").innerHTML = "";

  for (let i = 0; i < tableMed.length + 1; i++) {
    $("#med_contente").innerHTML += generateRow(i, tableMed.length == i);
  }
}

function delMed(id) {
  tableMed.splice(id, 1);
  generateList();
}

function addMed() {
  if (validate(tableMed.length + 1)) {
    tableMed.push({
      ID: $("#codeMed" + (tableMed.length + 1)).value,
      QUANTITY: $("#quantityMed" + (tableMed.length + 1)).value,
    });
    generateList();
  }
}

function addCommande() {
  axios.get("http://localhost:4000/session").then((res) => {
    axios
      .post(
        "http://localhost:4000/commande/add",
        { ID_USER: res.data.ID },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        axios.get("http://localhost:4000/commande/last").then((res) => {
          let id_Commande = res.data.ID;
          tableMed.forEach((ele) => {
            axios.post(
              "http://localhost:4000/commande/addVente",
              {
                ID: ele.ID,
                ID_COMMANDE: id_Commande,
                QUANTITY: ele.QUANTITY,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            axios.get("http://localhost:4000/Stock").then((res) => {
              res.data.forEach((t) => {
                if (ele.ID == t.ID) {
                  let newQUANTITY = t.QUANTITY - ele.QUANTITY;

                  axios.post(
                    "http://localhost:4000/Stock/add",
                    {
                      ID: t.ID,
                      QUANTITY: newQUANTITY,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );
                }
              });
            });
          });
        });
      });
  });
}

window.onload = () => {
  getSession();
  generateList();
};
