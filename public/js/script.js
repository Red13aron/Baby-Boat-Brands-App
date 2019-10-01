(function() {
  const getUserId = function() {
    const userId = document.cookie.split(";")[0].split("=")[1];
    return userId !== "null" ? Number(userId) : void 0;
  };

  const buildName = function(element) {
    const genderElement = element.parentNode.previousElementSibling;
    const nameElement = genderElement.previousElementSibling;
    let genderValue = null;
    if (genderElement.children[0].classList.contains("fa-mars") === "M") {
      genderValue = 0;
    } else if (genderElement.children[0].classList.contains("fa-venus")) {
      genderValue = 1;
    }
    const nameId = element.getAttribute("data-id");
    const name = {
      UserId: getUserId(),
      name: nameElement.innerText,
      gender: genderValue,
      searchTerm: getSearchTerm()
    };
    if (nameId !== "") {
      name.id = Number(nameId);
    }
    return name;
  };

  const shareHandler = function(event) {
    const name = buildName(event.target);
    alert("share " + name.name + " " + (name.gender ? "F" : "M"));
  };

  const logInToggle = function(userId) {
    const login = userId !== void 0;
    document.cookie = "userId=" + (login ? userId : null);
    document.getElementById("modal").checked = !login;
    document.getElementById("logInLabel").innerText =
      "Log " + (login ? "out" : "in");
    const getStartedContainer = document.getElementById("getStartedContainer");
    if (getStartedContainer) {
      getStartedContainer.style.display = login ? "none" : "block";
    }
    if (login) {
      document.getElementById("usernameInput").value = "";
      document.getElementById("passwordInput").value = "";
    }
  };

  const getSearchTerm = function() {
    const pathName = window.location.pathname;
    const params = pathName.split("/");
    return params[1];
  };

  const favoriteHandler = function(event) {
    const name = buildName(event.target);
    const favorited = name.id === void 0;
    const method = favorited ? "POST" : "DELETE";
    const url = "/api/names" + (favorited ? "" : "/" + name.id);
    fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: method,
      body: JSON.stringify(name)
    })
      .then(res => res.json())
      .then(userId => {
        if (favorited) {
          event.target.classList.add("favorited");
          event.target.setAttribute("data-id", userId);
        } else {
          event.target.classList.remove("favorited");
          event.target.setAttribute("data-id", "");
        }
      });
  };

  const signUpHandler = function(event) {
    event.preventDefault();
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    fetch("/api/signup", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(user => logInToggle(user.id));
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
      .then(user => logInToggle(user.id));
  };

  const init = function() {
    if (getUserId() !== void 0) {
      logInToggle(getUserId());
    }
    document
      .getElementById("loginForm")
      .addEventListener("submit", submitHandler);
    document
      .getElementById("signupButton")
      .addEventListener("click", signUpHandler);
    document.addEventListener("click", function(event) {
      if (event.target.classList.contains("favorite-button")) {
        favoriteHandler(event);
      }
      if (event.target.classList.contains("share-button")) {
        shareHandler(event);
      }
    });
    document
      .getElementById("logInLabel")
      .addEventListener("click", function(event) {
        if (event.target.innerText === "Log out") {
          logInToggle();
        }
      });
    document
      .getElementById("modal")
      .addEventListener("change", function(event) {
        if (event.target.checked) {
          document.getElementById("usernameInput").focus();
        }
      });
    getSearchTerm();
  };

  document.addEventListener("DOMContentLoaded", init);
})();
