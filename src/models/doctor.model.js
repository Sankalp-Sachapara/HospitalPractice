const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    doctorName:{
        type: String
    },
    doctorEmail : {
        type: String,
    },
    doctorPassword : {
        type: String,
    },
    doctorDepartment:{
        type: String
    },
    hospitalId:{
        type:String
    },
    hospitalName:{
        type: String
    },
})

module.exports = mongoose.model('Doctors', doctorSchema);