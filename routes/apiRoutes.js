var db = require("../models");
const Scrapper = require("../scrapper/scrappe.js");
const scrapper = new Scrapper();
const auth = require("../auth/isAuthenticated");
const bcrypt = require("bcrypt");
const Hashids = require("hashids/cjs");
const hashids = new Hashids("BabyNames");

const saltRounds = 10;
module.exports = function(app) {
  // Get the API for specific user:
  app.get("/api/names/:userid", function(req, res) {
    console.log(req.params.userid);
    db.Names.findAll({
      where: {
        userId: hashids.decode(req.params.userid)
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

  // Create a new favorite Name
  app.post("/api/names", function(req, res) {
    console.log(req.body.UserId);
    req.body.UserId = hashids.decode(req.body.UserId);
    console.log(req.body.UserId);
    db.Names.create(req.body).then(function(dbnames) {
      res.json(dbnames.dataValues.id);
    });
  });

  // Delete a Name by id
  app.delete("/api/names/:userid/:id", function(req, res) {
    db.Names.destroy({
      where: { id: req.params.id, userId: hashids.decode(req.params.userid) }
    }).then(function(dbExample) {
      res.json(req.params.id);
    });
  });

  app.post("/api/login", function(req, res) {
    db.Users.findOne({ where: { name: req.body.username } }).then(function(
      user
    ) {
      bcrypt.compare(req.body.password, user.password, function(err, isAuth) {
        // isAuth === true
        if (isAuth) {
          res.json({ id: hashids.encode(user.id) });
          // isAuth === false
        } else {
          res.json(401);
        }
      });
    });
  });

  app.post("/api/signup", function(req, res) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB.
        db.Users.create({
          name: req.body.username,
          password: hash
        }).then(function(dbnames) {
          res.json(hashids.encode(dbnames.userId));
        });
      });
    });
  });
};
