(function() {
  // https://stackoverflow.com/questions/4825683/how-do-i-create-and-read-a-value-from-cookie
  const createCookie = function(name, value) {
    const expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
  };
  const getCookie = function(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=");
      if (c_start !== -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(";", c_start);
        if (c_end === -1) {
          c_end = document.cookie.length;
        }
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  };

  const showNotification = function(message) {
    const notificationDiv = document.getElementById("notificationDiv");
    notificationDiv.innerText = message;
    notificationDiv.classList.add("show");
    setTimeout(function() {
      notificationDiv.classList.remove("show");
    }, 3000);
  };

  const showError = function(message) {
    const errorDiv = document.getElementById("errorDiv");
    errorDiv.innerText = message;
    errorDiv.classList.add("show");
    setTimeout(function() {
      errorDiv.classList.remove("show");
    }, 3000);
  };

  const getUserId = function() {
    const userId = getCookie("userId");
    const userIdExists = userId.length > 0 && userId !== "undefined";
    return userIdExists ? Number(userId) : void 0;
  };

  const buildName = function(element) {
    const genderElement = element.parentNode.previousElementSibling;
    const nameElement = genderElement.previousElementSibling;
    let genderValue = null;
    if (genderElement.children[0].classList.contains("fa-mars")) {
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
    if (nameId !== null && nameId !== "") {
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
    createCookie("userId", userId);
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
    const userId = getUserId();
    if (userId !== void 0) {
      logInToggle(userId, true);
    }
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
      searchForm.addEventListener("submit", searchHandler);
    }
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
