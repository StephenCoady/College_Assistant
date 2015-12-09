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

    var UserSchema = new Schema({
      firstName: { type: String, required: true } ,
      secondName: { type: String, required: true } ,
      email: { type: String, required: true, unique: true },
      username: { 
        type: String, 
        required: true,
        unique: true 
      },
      password: { 
        type: String, 
        validate: [
          function(password) {
            return password.length >= 4;
          },
          'Password should be longer'
        ]
      },
      age: { type: String, required: true },
      course: { type: String, required: false },
      modules: [ModuleSchema]
    });

    module.exports = mongoose.model('users', UserSchema);