let input = document.getElementById("btns");
input.addEventListener("OnClick", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("myBtn").click();
  }
});
