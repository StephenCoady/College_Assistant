var _ = require('lodash')
// var datastore = require('../datastore');

var Assignment = require('./assignment.model');


function handleError(res, err) {
  return res.send(500, err);
};

    // Get list of assignments
    exports.index = function(req, res) {
      Assignment.find(function (err, assignments) {
        if(err) { return handleError(res, err); }
        return res.json(200, assignments);
      });
    };

    // Creates a new assignment in database.
    exports.create = function(req, res) {
      Assignment.create(req.body, function(err, assignment) {
        if(err) { return handleError(res, err); }
        return res.json(201, assignment);
      });
    };

// Update an existing assignment in database.
exports.update = function(req, res) {
 Assignment.findById(req.params.id, function (err, assignment) {
  assignment.title = req.body.title
  assignment.snippet = req.body.snippet
  assignment.date = req.body.date
  assignment.complete = req.body.complete
  assignment.details = req.body.details
  assignment.save(function (err) {
    if(err) { return handleError(res, err); }
    return res.send(200, 'Update successful');
  });
});
}

// Deletes a assignment from database.
exports.destroy = function(req, res) {
  Assignment.findById(req.params.id, function (err, assignment) {
    assignment.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.send(200,'Deleted');
    });
  })
}

exports.show = function(req, res) {
  Assignment.findById(req.params.id, function (err, assignment) {
    if(err) { return handleError(res, err); }
    return res.json(200, assignment);
  });
} ;