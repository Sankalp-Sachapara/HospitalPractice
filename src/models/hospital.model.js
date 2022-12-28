const mongoose = require("mongoose")

const hospitalSchema = new mongoose.Schema({
    hospitalName:{
        type: String
    },
    hospitalAddress:{
        type:{
            addressLine: {type: String} , 
            city: {type:String}, 
            postalCode: {type:Number}, 
            country: {type: String},
        }
    },
    noOfRooms : {
        type: Number,
    },
    roomCharge:{
        type: Number
    }
    
})

module.exports = mongoose.model('Hospital', hospitalSchema);