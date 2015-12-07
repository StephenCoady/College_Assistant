var mongoose = require('mongoose')
    var Schema = mongoose.Schema;


    var AssignmentSchema = new Schema({
      title: { type: String} ,
      snippet: { type: String} ,
      date: { type: String} ,
      moduleId: { type: String, required: true } ,
      complete: { type: Boolean, required: true } ,
      details: { type: String}
    });

    module.exports = mongoose.model('assignments', AssignmentSchema);