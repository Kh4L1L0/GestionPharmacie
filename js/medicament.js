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

let round = (num) => {
  return Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
};

const tableheader = `<thead>
                        <tr>
                          <th>ID</th>
                          <th>Nom</th>
                          <th>Date d'Asurance</th>
                          <th>Prix Unitaire en DH</th>
                          <th>Forme</th>
                        </tr>
                      </thead><tbody>`;

const tablevide = `<tbody><tr>
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

function fillMedTable() {
  let num = 10;
  let i = 0;
  $("#medTable").innerHTML = tableheader;

  if ($("#searchBar").value.length >= 3) {
    axios
      .get("http://localhost:4000/Medicament?s=" + $("#searchBar").value)
      .then((res) => {
        res.data.forEach((ele) => {
          $("#medTable").innerHTML += `<tr>
                                <td>${ele.ID}</td>
                                <td>${ele.DENOMINATION}</td>
                                <td>${ele.DATEAMM.substring(0, 10)}</td>
                                <td>${round(ele.PRIX)}</td>
                                <td>${ele.FORM}</td>
                              </tr>`;
          $("#medTable").innerHTML += `</tbody>`;
        });
      });
  } else {
    emptyTable();
  }
}

$("#searchBar").onkeyup = fillMedTable;
window.onload = () => {
  getSession();
  emptyTable();
};
