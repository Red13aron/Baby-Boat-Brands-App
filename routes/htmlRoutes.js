const Scrapper = require("../scrapper/scrappe.js");
const scrapper = new Scrapper();

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  // Load example page and pass in an example by id
  app.get("/favorites", function(req, res) {
    res.render("favorites");
  });

  app.get("/results/:searchterm/:gender", async function(req, res) {
    const searchterm = req.params.searchterm;
    const genderterm = req.params.gender;

    const bNames = await scrapper.scrapper(searchterm, genderterm);
    if (bNames) {
      bNames.sort(function(a, b) {
        const nameA = a.bnResults.toLowerCase(),
          nameB = b.bnResults.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA === nameB) return 0;
        return 1;
      });
    }

    res.render("results", { bNames });
  });
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
