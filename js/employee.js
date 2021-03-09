let $ = (ele) => {
  return document.querySelector(ele);
};

let ID = 1;
const getSession = () => {
  axios.get("http://localhost:4000/session").then((res) => {
    let userId = res.data.ID;
    if (userId == 1) {
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
                          <th>ID</th>
                          <th>Nom Complete</th>
                          <th>Email</th>
                          <th>Tel</th>
                          <th>Type</th>
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
                          <td>...</td>
                        </tr></tbody>`;

function emptyTable() {
  $("#medTable").innerHTML = tableheader;
  $("#medTable").innerHTML += tablevide;
}

function getType() {
  let userType = document.getElementsByName("typeUser");
  let value;
  userType.forEach((ele) => {
    if (ele.checked) {
      value = ele.value;
    }
  });
  return value;
}

function validate() {
  let valid = true;

  if ($("#userNameInput").value === "") {
    valid = false;
    $("#userNameInput").style.borderColor = "red";
  } else {
    $("#userNameInput").style.borderColor = "green";
  }

  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      $("#userEmail").value
    )
  ) {
    $("#userEmail").style.borderColor = "green";
  } else {
    valid = false;
    $("#userEmail").style.borderColor = "red";
  }
  if (isNaN($("#userTel").value) || $("#userTel").value === "") {
    valid = false;
    $("#userTel").style.borderColor = "red";
  } else {
    $("#userTel").style.borderColor = "green";
  }

  if ($("#userPassword").value.length <= 5) {
    valid = false;
    $("#userPassword").style.borderColor = "red";
  } else {
    $("#userPassword").style.borderColor = "green";
  }

  return valid;
}

function Supprimer(id) {
  axios.delete("http://localhost:4000/User/delete/" + id);
  window.location.reload();
}

function Modifier(id) {
  axios.get("http://localhost:4000/User/" + id).then((res) => {
    $("#userNameInput").value = res.data.NOM_PRENOM;
    $("#userEmail").value = res.data.EMAIL;
    $("#userTel").value = res.data.TEL;
  });
  ID = id;
  $("#modifyBut").onclick = () => {
    if (!validate()) return;

    let data = {
      NOM_PRENOM: $("#userNameInput").value,
      EMAIL: $("#userEmail").value,
      TEL: $("#userTel").value,
      TYPE: getType(),
      passwordd: $("#userPassword").value,
    };
    console.log(data);
    axios.put("http://localhost:4000/User/update/" + ID, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    window.location.reload();
  };
}

function fillMedTable() {
  let num = 10;
  let i = 0;
  $("#medTable").innerHTML = tableheader;

  axios.get("http://localhost:4000/User").then((res) => {
    res.data.forEach((ele) => {
      if (ele.ID_USER != 0) {
        $("#medTable").innerHTML += `<tr>
                                  <td>${ele.ID_USER}</td>
                                  <td>${ele.NOM_PRENOM}</td>
                                  <td>${ele.EMAIL}</td>
                                  <td>${ele.TEL}</td>
                                  <td>${ele.TYPE}</td>
                                  <td style="text-align: center">
                            <button
                                onclick="Modifier(${ele.ID_USER})"
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
                            onclick="Supprimer(${ele.ID_USER})"
                              type="button"
                              class="btn btn-outline-danger btn-sm"
                            >
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </td>
                                </tr>`;
        $("#medTable").innerHTML += `</tbody>`;
      }
    });
  });
}

window.onload = () => {
  getSession();
  fillMedTable();
};
