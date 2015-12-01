var _ = require('lodash')
var datastore = require('../datastore');

var User = require('./user.model');  // NEW line

function handleError(res, err) {
      return res.send(500, err);
    }

    // Get list of contacts
    exports.index = function(req, res) {
      User.find(function (err, users) {
        if(err) { return handleError(res, err); }
        return res.json(200, users);
      });
    } ;

    // Creates a new contact in datastore.
    exports.create = function(req, res) {
      User.create(req.body, function(err, user) {
        if(err) { return handleError(res, err); }
        return res.json(201, user);
      });
    };

// Update an existing contact in datastore.
    exports.update = function(req, res) {
       User.findById(req.params.id, function (err, user) {
            contact.name = req.body.name
            contact.address = req.body.address
            contact.phone_number = req.body.phone_number
            contact.save(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200, 'Update successful');
            });
        });
     }

// Deletes a customer from datastore.
    exports.destroy = function(req, res) {
        User.findById(req.params.id, function (err, contact) {
            contact.remove(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200,'Deleted');
            });
        })
    }

exports.show = function(req, res) {
    var index = _.findIndex(datastore.contacts , 
           function(contact) {
              return contact.id == req.params.id;
        });      
     if (index != -1) {
        return res.json(datastore.contacts[index] );
      }
      else
        {
         return res.send(404)
       }

};