const mongoose = require("mongoose");
const runDb = () =>{
mongoose.connect('mongodb://localhost:27017/HospitalManagement')

const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', () => console.log("connected to database"))

}

module.exports = runDb