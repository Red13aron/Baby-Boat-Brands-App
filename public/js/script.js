(function() {
  let userId = null;

  const favoriteHandler = function(event) {
    const name = {
      name: "nameTest",
      gender: 0,
      searchTerm: "termTest"
    };
    fetch("/api/favorite", {
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
        userId = user.id;
      });
  };

  const init = function() {
    document
      .getElementById("loginForm")
      .addEventListener("submit", submitHandler);
    document.addEventListener("click", function(event) {
      if (event.target.classList.contains("favorite-button")) {
        favoriteHandler(event);
      }
    });
  };

  document.addEventListener("DOMContentLoaded", init);
})();
