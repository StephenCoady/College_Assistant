var mongoose = require('mongoose')
    var Schema = mongoose.Schema;


    var AssignmentSchema = new Schema({
      title: { type: String, required: true } ,
      snippet: { type: String, required: true } ,
      date: { type: String, required: true } ,
      moduleId: { type: String, required: true } ,
      id: { type: String, required: true } ,
      complete: { type: Boolean, required: true } ,
      details: { type: String, required: true }
    });

    var ModuleSchema = new Schema({
      title: { type: String, required: true } ,
      lecturer: { type : String, require: true} ,
      assignments: [AssignmentSchema]
    }); 

    var UserSchema = new Schema({
      firstName: { type: String, required: true } ,
      secondName: { type: String, required: true } ,
      email: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      age: { type: String, required: true },
      course: { type: String, required: false },
      modules: [ModuleSchema]
    });

    module.exports = mongoose.model('users', UserSchema);