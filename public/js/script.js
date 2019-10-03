(function() {
  // build the name object, including name id, user id, name, gender, and search term
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

  // https://stackoverflow.com/questions/4825683/how-do-i-create-and-read-a-value-from-cookie
  const createCookie = function(name, value) {
    const expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
  };

  // post or delete favorite depending on whether its alreayd saved
  const favoriteHandler = function(event) {
    const name = buildName(event.target);
    // if the user isn't logged in, show error message
    if (name.UserId === void 0) {
      showError("Please log in to add favorites.");
      return false;
    }
    const favorited = name.id === void 0;
    const method = favorited ? "POST" : "DELETE";
    const url =
      "/api/names" + (favorited ? "" : "/" + getUserId() + "/" + name.id);
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

  // https://stackoverflow.com/questions/4825683/how-do-i-create-and-read-a-value-from-cookie
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

  // get the name meaning that was searched for
  const getSearchTerm = function() {
    const pathName = window.location.pathname;
    const params = pathName.split("/");
    return params[2];
  };

  // get the userId from the cookie. if none is found, return undefined
  const getUserId = function() {
    const userId = getCookie("userId");
    const userIdExists = userId.length > 0 && userId !== "undefined";
    return userIdExists ? userId : void 0;
  };

  // init function to run when document is loaded
  const init = function() {
    const userId = getUserId();
    // if the userId doesn't exist, don't show the logged in notification
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

  // log in an existing user
  const loginHandler = function(event) {
    event.preventDefault();
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    if (!validateLogin(username, password)) {
      showError("Please enter both a username and a password.");
      return false;
    }
    fetch("/api/login", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(user => {
        if (user !== 401) {
          logInToggle(user.id);
        } else {
          showError("User not found. Please sign up first.");
        }
      });
  };

  // change "Log in" to "Log out", save userId to cookie, clear login form, show notification
  const logInToggle = function(userId, hideNotification = false) {
    // if userId isn't undefined, we are logging in
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
      window.location.reload();
    }
  };

  // go to results/{searchTerm}/{gender} when searching
  const searchHandler = function(event) {
    event.preventDefault();
    const form = document.getElementById("searchForm");
    window.location.href +=
      "results/" + form.term.value + "/" + form.gender.value;
  };

  // show the error notification
  const showError = function(message) {
    const errorDiv = document.getElementById("errorDiv");
    errorDiv.innerText = message;
    errorDiv.classList.add("show");
    setTimeout(function() {
      errorDiv.classList.remove("show");
    }, 3000);
  };

  // show the success notification
  const showNotification = function(message) {
    const notificationDiv = document.getElementById("notificationDiv");
    notificationDiv.innerText = message;
    notificationDiv.classList.add("show");
    setTimeout(function() {
      notificationDiv.classList.remove("show");
    }, 3000);
  };

  // sign a new user up
  const signUpHandler = function(event) {
    event.preventDefault();
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    if (!validateLogin(username, password)) {
      showError("Please enter both a username and a password.");
      return false;
    }
    fetch("/api/signup", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(user => {
        if (user !== 401) {
          logInToggle(user.id);
        } else {
          showError("User not found. Please sign up first.");
        }
      });
  };

  const validateLogin = function(username, password) {
    return username.length > 0 && password.length > 0;
  };

  document.addEventListener("DOMContentLoaded", init);
})();
