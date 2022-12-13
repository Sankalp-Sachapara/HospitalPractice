const mongoose = require("mongoose")


const medicinesSchema= new mongoose.Schema({ 
        medicineName:{
            type: String
        },
        medicineCost: {
            type: Number,
        },
})


const prescriptionSchema = new mongoose.Schema({
    doctorId:{
        type: String
    },
    doctorName:{
        type: String
    },
    patientId : {
        type: String,
    },
    patientName:{
        type: String,
    },
    diagnose: {
        type: String,
    },
    medicines:[medicinesSchema],
},
{timestamps: { createdAt: 'createdAt' } }
)

module.exports = mongoose.model('Prescription', prescriptionSchema);