var db = require("../models");
const Scrapper = require("../scrapper/scrappe.js");
const scrapper = new Scrapper();
module.exports = function(app) {
  // Get the API for specific user:
  app.get("/api/names/:userid", function(req, res) {
    db.Names.findAll({
      where: {
        userId: req.params.userid
      }
    }).then(function(dbnames) {
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
  app.post("/api/names", function(req, res) {
    db.Names.create(req.body).then(function(dbnames) {
      res.json(dbnames.dataValues.id);
    });
  });

  // Delete an example by id
  app.delete("/api/names/:id", function(req, res) {
    db.Names.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(req.params.id);
    });
  });

  app.post("/api/login", function(req, res) {
    db.Users.findOne({ where: { name: req.body.username } }).then(function(
      user
    ) {
      if (req.body.password === user.password) {
        res.json({ id: user.id });
      } else {
        res.json(401);
      }
    });
  });

  app.post("/api/signup", function(req, res) {
    db.Users.create({
      name: req.body.username,
      password: req.body.password
    }).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });
};
