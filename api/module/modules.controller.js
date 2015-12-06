var _ = require('lodash')
// var datastore = require('../datastore');

var Module = require('./module.model');


function handleError(res, err) {
      return res.send(500, err);
    };

    // Get list of modules
    exports.index = function(req, res) {
      Module.find(function (err, modules) {
        if(err) { return handleError(res, err); }
        return res.json(200, modules);
      });
    };

    // Creates a new module in database.
    exports.create = function(req, res) {
      Module.create(req.body, function(err, module) {
        if(err) { return handleError(res, err); }
        return res.json(201, module);
      });
    };

// Update an existing module in database.
    exports.update = function(req, res) {
       Module.findById(req.params.id, function (err, module) {
            user.title = req.body.title
            user.lecturer = req.body.lecturer
            user.save(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200, 'Update successful');
            });
        });
     }

// Deletes a module from database.
    exports.destroy = function(req, res) {
        Module.findById(req.params.id, function (err, module) {
            user.remove(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200,'Deleted');
            });
        })
    }

exports.show = function(req, res) {
      Module.findById(req.params.id, function (err, module) {
        if(err) { return handleError(res, err); }
        return res.json(200, user);
      });
    } ;