var _ = require('lodash')
// var datastore = require('../datastore');

var User = require('./user.model');


function handleError(res, err) {
      return res.send(500, err);
    };

    exports.getModules = function(req, res) {
      User.findById(req.params.id, function (err, user){
        if(err) { return handleError(res, err); }
        return res.json(201, user);
      })
    };

    exports.addToUser = function(req, res) {
      User.findById(req.params.id, function (err, user){
        user.modules.push(req.body)
        user.save(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200, 'Update successful');
            });
      })
    };

    exports.deleteFromUser = function(req, res) {
      User.findById(req.params.id, function (err, user){
        user.modules.id(req.params.modId).remove()
        user.save(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200, 'Delete of module successful');
            });
      })
    };
    // Get list of users
    exports.index = function(req, res) {
      User.find(function (err, users) {
        if(err) { return handleError(res, err); }
        return res.json(200, users);
      });
    } ;

    // Creates a new user in database.
    exports.create = function(req, res) {
      User.create(req.body, function(err, user) {
        if(err) { return handleError(res, err); }
        return res.json(201, user);
      });
    };

// Update an existing user in database.
    exports.update = function(req, res) {
       User.findById(req.params.id, function (err, user) {
            user.firstName = req.body.firstName
            user.secondName = req.body.secondName
            user.email = req.body.email
            user.username = req.body.username
            user.password = req.body.password
            user.age = req.body.age
            user.course = req.body.course
            user.save(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200, 'Update successful');
            });
        });
     }

// Deletes a customer from database.
    exports.destroy = function(req, res) {
        User.findById(req.params.id, function (err, user) {
            user.remove(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200,'Deleted');
            });
        })
    }

    exports.show = function(req, res) {
      User.findById(req.params.id, function (err, user) {
        if(err) { return handleError(res, err); }
        return res.json(200, user);
      });
    } ;