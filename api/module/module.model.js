var mongoose = require('mongoose')
    var Schema = mongoose.Schema;


    var AssignmentSchema = new Schema({
      title: { 
        type: String,
        default: "Unitled Assignment"
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

    var ModuleSchema = new Schema({
      title: { type: String, required: true } ,
      lecturer: { type : String, require: true} ,
      assignments: [AssignmentSchema]
    });

    module.exports = mongoose.model('modules', ModuleSchema);