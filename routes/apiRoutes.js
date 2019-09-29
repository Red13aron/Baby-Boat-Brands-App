var db = require("../models");

module.exports = function(app) {
  // Get the API for specific user:
  app.get("/api/names/:userid", function(req, res) {
    db.Names.findAll({ where: {
      userId: req.params.userid }).then(function(dbnames) {
      res.json(dbnames);
    });
  });
// Get the API for the search terms in form HTML: not done!
  app.get("/api/names", function(req, res) {
    db.Names.findAll({ where: {
      userId: req.params.userid }).then(function(dbnames) {
      res.json(dbnames);
    });
  });

   // Get the API for all the names - just for developers:
  app.get("/api/developer/names", function(req, res) {
    db.Names.findAll({}).then(function(dbnames) {
      res.json(dbnames);
    });
  }); 

  // Create a new example
  app.post("/api/names/:userid", function(req, res) {
    db.Names.create(req.body).then(function(dbnames) {
      res.json(dbnames);
    });
  });

  // Delete an example by id
  app.delete("/api/names/:userid", function(req, res) {
    db.Names.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};
