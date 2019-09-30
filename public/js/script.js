(function() {
  let _userId = null;
  let searchTerm = "";

  const getSearchTerm = function() {
    const pathName = window.location.pathname;
    const params = pathName.split("/");
    searchTerm = params[1];
  };

  const favoriteHandler = function(event) {
    const genderElement = event.target.parentNode.previousElementSibling;
    const nameElement = genderElement.previousElementSibling;
    const nameIdElement = nameElement.previousElementSibling;
    let genderValue = null;
    if (genderElement.innerText === "M") {
      genderValue = 0;
    } else if (genderElement.innerText === "F") {
      genderValue = 1;
    }
    const userId = nameIdElement.classList.contains("name-id")
      ? nameIdElement.value
      : _userId;
    const name = {
      UserId: userId,
      name: nameElement.innerText,
      gender: genderValue,
      searchTerm: searchTerm
    };
    console.log(name);
    fetch("/api/names/" + userId, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(name)
    })
      .then(res => res.json())
      .then(isFavorite => {
        alert(isFavorite);
      });
  };

  const submitHandler = function(event) {
    event.preventDefault();
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    fetch("/api/login", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(user => {
        _userId = user.id;
        document.cookie = "userId=" + user.id;
      });
  };

  const init = function() {
    _userId = Number(document.cookie.split(";")[0].split("=")[1]);
    document
      .getElementById("loginForm")
      .addEventListener("submit", submitHandler);
    document.addEventListener("click", function(event) {
      if (event.target.classList.contains("favorite-button")) {
        favoriteHandler(event);
      }
    });
    getSearchTerm();
  };

  document.addEventListener("DOMContentLoaded", init);
})();
