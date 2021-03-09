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

let AjouterStock = () => {
  let valid = true;

  if ($("#medID").value.length != 8) {
    valid = false;
    $("#medID").style.borderColor = "red";
  } else {
    $("#medID").style.borderColor = "green";
  }
  let quantity = parseInt($("#medQuantity").value);
  if ($("#medQuantity").value === "" || quantity < 0) {
    valid = false;
    $("#medQuantity").style.borderColor = "red";
  } else {
    $("#medQuantity").style.borderColor = "green";
  }

  if (valid) {
    if ($("#medQuantity").value == 0) {
      axios.delete("http://localhost:4000/Stock/delete/" + $("#medID").value);
    } else {
      let data = {
        ID: $("#medID").value,
        QUANTITY: $("#medQuantity").value,
      };
      console.log(JSON.stringify(data));
      axios
        .post("http://localhost:4000/Stock/add", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.status === 400) {
            $("#medID").style.borderColor = "red";
          }
        });
    }
  }
};

window.onload = () => {
  getSession();
};
