var mongoose = require('mongoose')
    var Schema = mongoose.Schema;


    var AssignmentSchema = new Schema({
      title: { type: String, required: true } ,
      snippet: { type: String, required: true } ,
      date: { type: String, required: true } ,
      moduleId: { type: String, required: true } ,
      complete: { type: Boolean, required: true } ,
      details: { type: String, required: true }
    });

    var ModuleSchema = new Schema({
      title: { type: String, required: true } ,
      lecturer: { type : String, require: true} ,
      assignments: [AssignmentSchema]
    });

    module.exports = mongoose.model('modules', ModuleSchema);