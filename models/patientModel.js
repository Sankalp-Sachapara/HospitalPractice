const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({
 
    patientName:{
        type: String
    },
    patientEmail : {
        type: String,
    },
    patientPassword : {
        type: String,
    },
    patientDob:{
        type : Date //'YYYY-MM-DD'
    },
    patientWeight:{
        type: Number
    },
    patientGender:{
        type: String
    },
    patientAddress:{
        type:{
            address_line: {type: String} , 
            City: {type:String}, 
            Postal_Code: {type:Number}, 
            Country: {type: String},
        }
    },
    patientPhone:{
        type: Number
    },
    doctorId:{
        type:String
    },
},
    {timestamps: { createdAt: 'created_at' } },
)

module.exports = mongoose.model('Patients', patientSchema);