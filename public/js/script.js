(function() {
  const showNotification = function(message) {
    const notificationDiv = document.getElementById("notificationDiv");
    notificationDiv.innerText = message;
    notificationDiv.classList.add("show");
    setTimeout(function() {
      notificationDiv.classList.remove("show");
    }, 3000);
  };

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

  const logInToggle = function(userId, hideNotification = false) {
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
    if (!hideNotification) {
      showNotification("Logged " + (login ? "in!" : "out!"));
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
          showNotification("Added " + name.name + " to favorites.");
        } else {
          event.target.classList.remove("favorited");
          event.target.setAttribute("data-id", "");
          showNotification("Removed " + name.name + " from favorites.");
        }
      });
  };

  const searchHandler = function(event) {
    event.preventDefault();
    const form = document.getElementById("searchForm");
    window.location.href +=
      "results/" + form.term.value + "/" + form.gender.value;
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

  const loginHandler = function(event) {
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
      logInToggle(getUserId(), true);
    }
    document
      .getElementById("searchForm")
      .addEventListener("submit", searchHandler);
    document
      .getElementById("loginForm")
      .addEventListener("submit", loginHandler);
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
