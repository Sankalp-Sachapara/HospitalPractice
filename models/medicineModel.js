const mongoose = require("mongoose")

const medicineSchema = new mongoose.Schema({
    medicineName:{
        type: String
    },
    medicineType: {
        type: String,
    },
    medicineCost: {
        type: Number,
    },
    medicineDescription:{
        type:String
    },
})

module.exports = mongoose.model('Medicine', medicineSchema);