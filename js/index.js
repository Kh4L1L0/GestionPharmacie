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
          ).innerHTML += `                            <a class="collapse-item" href="stockage/forum.html">
              Ajouter medicaments
            </a>`;
        }
      });
    } else {
      window.location = "./login.html";
    }
  });
};

const onLoad = () => {
  getSession();
};

window.onload = onLoad;
