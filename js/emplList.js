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

function addUser() {
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

  if (valid) {
    let data = {
      NOM_PRENOM: $("#userNameInput").value,
      EMAIL: $("#userEmail").value,
      TEL: $("#userTel").value,
      PASSWORDD: $("#userPassword").value,
      TYPE: getType(),
    };
    console.log(JSON.stringify(data));
    axios.post("http://localhost:4000/User/add", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

window.onload = () => {
  getSession();
};
