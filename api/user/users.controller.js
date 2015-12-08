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

exports.login = function(req, res) {
  User.findOne({username : req.query.username}, function(err, user){
    if(user.password === req.query.password){
      return res.json(200, "Found!");
    }
    else{
      return res.json(404, "Not found");
    }
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
exports.addAssign = function(req, res) {
  User.findById(req.params.id, function (err, user){
    user.modules.id(req.params.modId).assignments.push(req.body)
    user.save(function (err) {
      if(err) {return handleError(res, err); }
      return res.send(200, 'Assignment added to users module');
    });
  })
};

exports.updateAssign = function(req, res) {
  User.findById(req.params.id, function (err, user){
    user.modules.id(req.params.modId).assignments.id(req.params.assignId).title = req.body.title
    user.modules.id(req.params.modId).assignments.id(req.params.assignId).snippet = req.body.snippet
    user.modules.id(req.params.modId).assignments.id(req.params.assignId).date = req.body.date
    user.modules.id(req.params.modId).assignments.id(req.params.assignId).complete = req.body.complete
    user.modules.id(req.params.modId).assignments.id(req.params.assignId).details = req.body.details
    user.save(function (err) {
      if(err) { return handleError(res, err); }
      return res.send(200, 'Update successful');
    });
  })
};

exports.deleteAssign = function(req, res) {
  User.findById(req.params.id, function (err, user){
    user.modules.id(req.params.modId).assignments.id(req.params.assignId).remove()
    user.save(function (err) {
      if(err) { return handleError(res, err); }
      return res.send(200, 'Delete of assignment successful');
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

    exports.getAges = function(req, res) {
      var delimeter = req.params.delim;
      if (delimeter === 'gt'){
        var query = User.where('age').gt(req.params.age)
        query.exec(function (err, users){
          if(err) { return handleError(res, err); }
          return res.json(200, users);
        })
      }
      else if (delimeter === 'lt'){
        var query = User.where('age').lt(req.params.age)
        query.exec(function (err, users){
          if(err) { return handleError(res, err); }
          return res.json(200, users);
        })
      }
      else if (delimeter === 'gte'){
        var query = User.where('age').gte(req.params.age)
        query.exec(function (err, users){
          if(err) { return handleError(res, err); }
          return res.json(200, users);
        })
      }
      else if (delimeter === 'lte'){
        var query = User.where('age').lte(req.params.age)
        query.exec(function (err, users){
          if(err) { return handleError(res, err); }
          return res.json(200, users);
        })
      }
      else{
        return res.json(404, "No such records found")
      }
    }

    // Creates a new user in database.
    exports.create = function(req, res) {
      User.create(req.body, function(err, user) {
        if(err) { 
          console.log(err)
          return handleError(res, err); }
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