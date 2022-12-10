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
            addressLine: {type: String} , 
            city: {type:String}, 
            postalCode: {type:Number}, 
            country: {type: String},
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