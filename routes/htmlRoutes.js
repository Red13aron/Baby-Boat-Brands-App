var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  // Load the history with the favorites users'name:
  app.get("/history", function(req, res) {
    res.render("history");
  });

  // Load results page and show the names:
  app.get("/results/:searchTerm/:gender", function(req, res) {
    res.render("results");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
