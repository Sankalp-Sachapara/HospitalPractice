const mongoose = require("mongoose")

const billSchema = new mongoose.Schema({
    prescriptionId:{
        type:String
    },
    doctorName:{
        type: String
    },
    patientName : {
        type: String,
    },
    
    hospitalName:{
        type: String
    },
    doctorCharge:{
        type: Number
    },
    roomCharge:{
        type: Number
    },
    medicineCharge:{
        type: Number
    },
    operationCharge:{
        type: Number
    },
    noOfDays:{
        type: Number
    },
    totalCharge:{
        type: Number
    },
    
})


module.exports = mongoose.model('Bill', billSchema);