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
                          <th>Code CIS</th>
                          <th>Denomination</th>
                          <th>Quantity</th>
                        </tr>
                      </thead><tbody>`;

const tablevide = `<tbody><tr>
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

function listerMed(ID) {}

function fillMedTable() {
  $("#medTable").innerHTML = tableheader;

  axios.get("http://localhost:4000/Stock").then((res) => {
    res.data.forEach((ele) => {
      $("#medTable").innerHTML += `<tr>
                                  <td>${ele.ID}</td>
                                <td>${ele.DENOMINATION}</td>
                                  <td>${ele.QUANTITY}</td>

                                  
                                </tr>`;
      $("#medTable").innerHTML += `</tbody>`;
    });
  });
}

window.onload = () => {
  getSession();
  fillMedTable();
};
