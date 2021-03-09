let $ = (ele) => {
  return document.querySelector(ele);
};

function login() {
  axios
    .post("http://localhost:4000/login", {
      email: $("#email").value,
      password: $("#password").value,
    })
    .then((res) => {
      if (res.data.exist === true) {
        window.location = "./medicament/list.html";
      } else {
        $("#email").style.borderColor = "red";
        $("#password").style.borderColor = "red";
      }
    });
}
