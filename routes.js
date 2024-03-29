module.exports = function(app) {

  app.use('/api/users', require('./api/user/index'));
  app.use('/api/modules', require('./api/module/index'));
  app.use('/api/assignments', require('./api/assignment/index'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|app|assets)/*')
   .get(function(req, res) {
    res.send(404);
  })

};