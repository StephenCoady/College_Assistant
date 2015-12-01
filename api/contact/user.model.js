var mongoose = require('mongoose')
    var Schema = mongoose.Schema;

    var UserSchema = new Schema({
      firstName: { type: String, required: true } ,
      secondName: { type: String, required: true } ,
      email: { type: String, required: true },
      email: { type: String, required: true },
      email: { type: String, required: true }
      email: { type: String, required: true },
      email: { type: String, required: true },
      email: { type: String, required: true },
      email: { type: String, required: true }
    });

    module.exports = mongoose.model('contacts', ContactSchema);

    "firstName": "Admin",
        "secondName": "N/A",
        "email": "N/A",
        "username": "admin",
        "password": "admin",
        "age": "N/A",
        "course": "N/A",
        "timetable": [],
        "modules": []