var mongoose = require('mongoose')
    var Schema = mongoose.Schema;


    var AssignmentSchema = new Schema({
      title: { 
        type: String,
        default: "Untitled Assignment"
      } ,
      snippet: { type: String} ,
      date: { type: String} ,
      moduleId: { type: String, required: true } ,
      complete: { 
        type: Boolean,
        default: false 
      } ,
      details: { type: String}
    });

    module.exports = mongoose.model('assignments', AssignmentSchema);