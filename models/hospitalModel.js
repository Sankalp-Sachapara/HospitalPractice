const mongoose = require("mongoose")

const hospitalSchema = new mongoose.Schema({
    hospitalName:{
        type: String
    },
    hospitalAddress:{
        type:{
            address_line: {type: String} , 
            City: {type:String}, 
            Postal_Code: {type:Number}, 
            Country: {type: String},
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