const { date } = require("joi");
const mongoose = require("mongoose")

const visitsSchema = new mongoose.Schema({
    doctorId:{
        type: String
    },
    hospitalId:{
        type: String
    },
    hospitalName : {
        type: String,
    },
    timings:{
        type: {
            from: {type: String},
            to: {type: String}
        }
    }
    
})

module.exports = mongoose.model('Visit', visitsSchema);